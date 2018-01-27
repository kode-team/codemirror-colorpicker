
import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import EventMachin from '../util/EventMachin'


const color = ColorUtil.color;
const hue_color = ColorUtil.hue_color;

export default class ColorControl extends EventMachin {
    constructor (colorpicker) {
        super();
        this.colorpicker = colorpicker; 
        this.initialize();
    } 
    
    initialize () {
        this.$el = new Dom('div', 'control' );
        this.$controlPattern = new Dom('div', 'empty' );
        this.$controlColor = new Dom('div', 'color' );
        this.$hue = new Dom('div', 'hue' );
        this.$hueContainer = new Dom('div', 'hue-container' );
        this.$drag_bar = new Dom('div', 'drag-bar' );
        this.$opacity = new Dom('div', 'opacity' );
        this.$opacityContainer = new Dom('div', 'opacity-container' );
        this.$opacityColorBar = new Dom('div', 'color-bar' );
    
        this.$opacity_drag_bar = new Dom('div', 'drag-bar2' );
    
        this.$hueContainer.append(this.$drag_bar);
        this.$hue.append(this.$hueContainer);
    
        this.$opacityContainer.append(this.$opacityColorBar);
        this.$opacityContainer.append(this.$opacity_drag_bar);
        this.$opacity.append(this.$opacityContainer);
    
        this.$el.append(this.$hue);
        this.$el.append(this.$opacity);
        this.$el.append(this.$controlPattern);
        this.$el.append(this.$controlColor);
        
    }

    setBackgroundColor (color) {
        this.$controlColor.css("background-color", color);
    }

    refresh () {
        this.setColorUI();
    }

    setColorUI() {
        var  x = this.$el.width() * this.colorpicker.currentS, y = this.$el.height() * ( 1 - this.colorpicker.currentV );
    
        this.$drag_pointer.css({
            left : (x - 5) + "px",
            top : (y - 5) + "px"
        });
    
        this.$drag_pointer.data('pos', { x  : x, y : y });
    }


    setMainColor(e) {
        e.preventDefault();
        var pos = this.colorpicker.$root.position();         // position for screen
        var w = $color.width();
        var h = $color.height();
    
        var x = e.clientX - pos.left;
        var y = e.clientY - pos.top;
    
        if (x < 0) x = 0;
        else if (x > w) x = w;
    
        if (y < 0) y = 0;
        else if (y > h) y = h;
    
        this.$drag_pointer.css({
            left: (x - 5) + 'px',
            top: (y - 5) + 'px'
        });
    
        this.$drag_pointer.data('pos', { x: x, y : y});
    
        this.colorpicker.caculateHSV()
        this.colorpicker.setInputColor();
    }    


    setOpacityColorBar(hueColor) {
        var rgb = color.parse(hueColor);
    
        rgb.a = 0;
        var start = color.format(rgb, 'rgb');
    
        rgb.a = 1;
        var end = color.format(rgb, 'rgb');
    
        var prefix = cssPrefix;
        this.$opacityColorBar.css('background',  'linear-gradient(to right, ' + start + ', ' + end + ')');
    }
    
    setOpacity(e) {
        var min = this.$opacityContainer.offset().left;
        var max = min + this.$opacityContainer.width();
        var current = Event.pos(e).clientX;
        var dist;
    
        if (current < min) {
            dist = 0;
        } else if (current > max) {
            dist = 100;
        } else {
            dist = (current - min) / (max - min) * 100;
        }
    
        var x = (this.$opacityContainer.width() * (dist/100));
    
        this.$opacity_drag_bar.css({
            left: (x -Math.ceil(this.$opacity_drag_bar.width()/2)) + 'px'
        });
    
        this.$opacity_drag_bar.data('pos', { x : x });
    
        this.colorpicker.setCurrentA(this.caculateOpacity());
        this.colorpicker.currentFormat();
        this.colorpicker.setInputColor();
    }
 
    setInputColor () {
        this.setBackgroundColor(this.colorpicker.getFormattedColor('rgb'));
        
        var rgb = this.colorpicker.convertRGB();
        var colorString = color.format(rgb, 'rgb');
        this.setOpacityColorBar(colorString);        
    }

    setColorUI() {
    
        var hueX = this.$hueContainer.width() * (this.colorpicker.currentH / 360);
    
        this.$drag_bar.css({
            left : (hueX - 7.5) + 'px'
        });
    
        this.$drag_bar.data('pos', { x : hueX });
    
        var opacityX = this.$opacityContainer.width() * (this.colorpicker.currentA || 0);
    
        this.$opacity_drag_bar.css({
            left : (opacityX - 7.5) + 'px'
        });
    
        this.$opacity_drag_bar.data('pos', { x : opacityX });
    }

    caculateH() {

        var huePos = this.$drag_bar.data('pos') || { x : 0 };
        
        var h = (huePos.x / this.$hueContainer.width()) * 360;

        return { h } ; 
    }

    caculateOpacity() {
        var opacityPos = this.$opacity_drag_bar.data('pos') || { x : 0 };
        var a = Math.round((opacityPos.x / this.$opacityContainer.width()) * 100) / 100;

        return isNaN(a) ? 1 : a;
    }


    EventDocumentMouseMove(e) {
        if (this.$hue.data('isDown')) {
            this.setHueColor(e);
        }
    
        if (this.$opacity.data('isDown')) {
            this.setOpacity(e);
        }
    }         

    EventDocumentMouseUp (e) {
        this.$hue.data('isDown', false);
        this.$opacity.data('isDown', false);
    }



    setControlColor (color) {
        this.$controlColor.css('background-color', color);
    }
        

    setHueColor(e) {
        var min = this.$hueContainer.offset().left;
        var max = min + this.$hueContainer.width();
        var current = e ? Event.pos(e).clientX : min + (max - min) * (this.colorpicker.currentH / 360);
    
        var dist;
        if (current < min) {
            dist = 0;
        } else if (current > max) {
            dist = 100;
        } else {
            dist = (current - min) / (max - min) * 100;
        }
    
        var x = (this.$hueContainer.width() * (dist/100));
    
        this.$drag_bar.css({
            left: (x -Math.ceil(this.$drag_bar.width()/2)) + 'px'
        });
    
        this.$drag_bar.data('pos', { x : x});
    
        var hueColor = color.checkHueColor(dist/100);
    
        this.colorpicker.setBackgroundColor(hueColor);
        this.colorpicker.setCurrentH((dist/100) * 360);
        this.colorpicker.setInputColor();
    }    

    'mousedown $drag_bar' (e) {
        e.preventDefault();
        this.$hue.data('isDown', true);
    }
    
    'mousedown $opacity_drag_bar' (e) {
        e.preventDefault();
        this.$opacity.data('isDown', true);
    }
    
    'mousedown $hueContainer' (e) {
        this.$hue.data('isDown', true);
        this.setHueColor(e);
    }
    
    'mousedown $opacityContainer' (e) {
        this.$opacity.data('isDown', true);
        this.setOpacity(e);
    }    
    

    initializeEvent () {
        this.initializeEventMachin();
    }

    destroy() {
        this.destroyEventMachin();
    }
}
