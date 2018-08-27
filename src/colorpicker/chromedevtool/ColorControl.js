
import Color from '../../util/Color'
import HueColor from '../../util/HueColor'
import Dom from '../../util/Dom'
import Event from '../../util/Event'
import EventMachin from '../../util/EventMachin'

export default class ColorControl extends EventMachin {
    constructor (colorpicker) {
        super();
        this.colorpicker = colorpicker; 
        this.initialize();
    } 

    template () {
        return `
        <div class="control">
            <div ref="$hue" class="hue">
                <div ref="$hueContainer" class="hue-container">
                    <div ref="$drag_bar" class="drag-bar"></div>
                </div>
            </div>
            <div ref="$opacity" class="opacity">
                <div ref="$opacityContainer" class="opacity-container">
                    <div ref="$opacityColorBar" class="color-bar"></div>
                    <div ref="$opacity_drag_bar" class="drag-bar2"></div>
                </div>
            </div>
            <div ref="$controlPattern" class="empty"></div>
            <div ref="$controlColor" class="color"></div>
        </div>
        `
    }
    
    initialize () {

        this.drag_bar_pos = {}
        this.opacity_drag_bar_pos = {}      
    }

    setBackgroundColor (color) {
        this.refs.$controlColor.css("background-color", color);
    }

    refresh () {
        this.setColorUI();
    }

    setOpacityColorBar(hueColor) {
        var rgb = Color.parse(hueColor);
    
        rgb.a = 0;
        var start = Color.format(rgb, 'rgb');
    
        rgb.a = 1;
        var end = Color.format(rgb, 'rgb');
    
        var prefix = cssPrefix;
        this.refs.$opacityColorBar.css('background',  'linear-gradient(to right, ' + start + ', ' + end + ')');
    }
    
    setOpacity(e) {
        var min = this.refs.$opacityContainer.offset().left;
        var max = min + this.state.get('$opacityContainer.width');
        var current = Event.pos(e).clientX;
        var dist;
    
        var dist;
        if (current < min) {
            dist = 0;
            this.refs.$opacity_drag_bar.addClass('first').removeClass('last')
        } else if (current > max) {
            dist = 100;
            this.refs.$opacity_drag_bar.addClass('last').removeClass('first')
        } else {
            dist = (current - min) / (max - min) * 100;
            this.refs.$opacity_drag_bar.removeClass('first').removeClass('last')
        }  
    
        var x = (this.state.get('$opacityContainer.width') * (dist/100));
    
        this.refs.$opacity_drag_bar.css({
            // left: (x -Math.ceil(this.state.get('$opacity_drag_bar.width')/2)) + 'px'
            left: (x) + 'px'            
        });
    
        this.opacity_drag_bar_pos = { x };
    
        this.colorpicker.setCurrentA(this.caculateOpacity());
        this.colorpicker.currentFormat();
        this.colorpicker.setInputColor();
    }
 
    setInputColor () {
        this.setBackgroundColor(this.colorpicker.getFormattedColor('rgb'));
        
        var rgb = this.colorpicker.convertRGB();
        var colorString = Color.format(rgb, 'rgb');
        this.setOpacityColorBar(colorString);        
    }

    setColorUI() {
    
        var hueX = this.state.get('$hueContainer.width') * (this.colorpicker.currentH / 360);      

        this.refs.$drag_bar.css({
            // left : (hueX - 7.5) + 'px'
            left : (hueX) + 'px'
        });
    
        this.drag_bar_pos = { x : hueX };
    
        var opacityX = this.state.get('$opacityContainer.width') * (this.colorpicker.currentA || 0);
    
        this.refs.$opacity_drag_bar.css({
            // left : (opacityX - 7.5) + 'px'
            left : (opacityX) + 'px'
        });
    
        this.opacity_drag_bar_pos = { x : opacityX };
        
    }

    caculateH() {

        var huePos = this.drag_bar_pos  || { x : 0 };
        
        var h = (huePos.x / this.state.get('$hueContainer.width')) * 360;

        return { h } ; 
    }

    caculateOpacity() {
        var opacityPos = this.opacity_drag_bar_pos  || { x : 0 };
        var a = Math.round((opacityPos.x / this.state.get('$opacityContainer.width')) * 100) / 100;

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
        this.refs.$controlColor.css('background-color', color);
    }
        

    setHueColor(e, isOnlyHue) {
        var min = this.refs.$hueContainer.offset().left;
        var max = min + this.state.get('$hueContainer.width');
        var current = e ? Event.pos(e).clientX : min + (max - min) * (this.colorpicker.currentH / 360);
    
        var dist;
        if (current < min) {
            dist = 0;
            this.refs.$drag_bar.addClass('first').removeClass('last')
        } else if (current > max) {
            dist = 100;
            this.refs.$drag_bar.addClass('last').removeClass('first')
        } else {
            dist = (current - min) / (max - min) * 100;
            this.refs.$drag_bar.removeClass('first').removeClass('last')
        }
    
        var x = (this.state.get('$hueContainer.width') * (dist/100));
    
        this.refs.$drag_bar.css({
            // left: (x -Math.ceil(this.state.get('$drag_bar.width')/2)) + 'px'
            left: (x) + 'px'
        });
    
        this.drag_bar_pos = { x };
    
        var hueColor = HueColor.checkHueColor(dist/100);
    
        this.colorpicker.setBackgroundColor(hueColor);
        this.colorpicker.setCurrentH((dist/100) * 360);

        if (!isOnlyHue) {
            this.colorpicker.setInputColor();
        }

    }    

    setOnlyHueColor() {
        this.setHueColor(null, true)
    }       

    // Event Bindings 
    'mouseup document' (e) {
        this.EventDocumentMouseUp(e);
    }

    'mousemove document' (e) {
        this.EventDocumentMouseMove(e);
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
