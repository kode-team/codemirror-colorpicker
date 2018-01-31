
import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import EventMachin from '../util/EventMachin'


const color = ColorUtil.color;

export default class ColorControl extends EventMachin {
    constructor (colorpicker) {
        super();
        this.colorpicker = colorpicker; 
        this.initialize();
    } 
    
    initialize () {
        this.$el = new Dom('div', 'control' );
        this.$hue = this.$el.createChild('div', 'hue' );        
        this.$opacity = this.$el.createChild('div', 'opacity' );        
        this.$controlPattern = this.$el.createChild('div', 'empty' );
        this.$controlColor = this.$el.createChild('div', 'color' );

        this.$hueContainer = this.$hue.createChild('div', 'hue-container' );
        this.$drag_bar = this.$hueContainer.createChild('div', 'drag-bar');
        this.drag_bar_pos = {}

        this.$opacityContainer = this.$opacity.createChild('div', 'opacity-container' );
        this.$opacityColorBar = this.$opacityContainer.createChild('div', 'color-bar' );
    
        this.$opacity_drag_bar = this.$opacityContainer.createChild('div', 'drag-bar2' );  
        this.opacity_drag_bar_pos = {}      
    }

    setBackgroundColor (color) {
        this.$controlColor.css("background-color", color);
    }

    refresh () {
        this.setColorUI();
    }

    setColorUI() {
        var  x = this.$el.width() * this.colorpicker.currentS, 
             y = this.$el.height() * ( 1 - this.colorpicker.currentV );
    
        this.$drag_pointer.css({
            left : (x - 5) + "px",
            top : (y - 5) + "px"
        });
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
    
        this.opacity_drag_bar_pos = { x };
    
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
    
        this.drag_bar_pos = { x : hueX };
    
        var opacityX = this.$opacityContainer.width() * (this.colorpicker.currentA || 0);
    
        this.$opacity_drag_bar.css({
            left : (opacityX - 7.5) + 'px'
        });
    
        this.opacity_drag_bar_pos = { x : opacityX };
        
    }

    caculateH() {

        var huePos = this.drag_bar_pos  || { x : 0 };
        
        var h = (huePos.x / this.$hueContainer.width()) * 360;

        return { h } ; 
    }

    caculateOpacity() {
        var opacityPos = this.opacity_drag_bar_pos  || { x : 0 };
        var a = Math.round((opacityPos.x / this.$opacityContainer.width()) * 100) / 100;

        return isNaN(a) ? 1 : a;
    }


    EventDocumentMouseMove(e) {
        if (this.isHueDown) {
            this.setHueColor(e);
        }
    
        if (this.isOpacityDown) {
            this.setOpacity(e);
        }
    }         

    EventDocumentMouseUp (e) {
        this.isHueDown = false ;
        this.isOpacityDown = false;
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
    
        this.drag_bar_pos = { x };
    
        var hueColor = color.checkHueColor(dist/100);
    
        this.colorpicker.setBackgroundColor(hueColor);
        this.colorpicker.setCurrentH((dist/100) * 360);
        this.colorpicker.setInputColor();
    }    

    setOnlyHueColor() {
        var min = this.$hueContainer.offset().left;
        var max = min + this.$hueContainer.width();
        var current = min + (max - min) * (this.colorpicker.currentH / 360);
    
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
    
        this.drag_bar_pos = { x };
    
        var hueColor = color.checkHueColor(dist/100);
        this.colorpicker.setBackgroundColor(hueColor);        
        this.colorpicker.setCurrentH((dist/100) * 360);
    }       

    'mousedown $drag_bar' (e) {
        e.preventDefault();
        this.isHueDown = true; 
    }
    
    'mousedown $opacity_drag_bar' (e) {
        e.preventDefault();
        this.isOpacityDown = true; 
    }
    
    'mousedown $hueContainer' (e) {
        this.isHueDown = true; 
        this.setHueColor(e);
    }
    
    'mousedown $opacityContainer' (e) {
        this.isOpacityDown = true; 
        this.setOpacity(e);
    }    
}
