
import Color from '../../../util/Color'
import Event from '../../../util/Event'
import EventMachin from '../../../util/EventMachin' 

export default class Opacity extends EventMachin {
    constructor (parent) {
        super();
        this.parent = parent; 
        this.initialize();
    } 
    template () {
        return `
        <div class="opacity">
            <div ref="$container" class="opacity-container">
                <div ref="$colorbar" class="color-bar"></div>
                <div ref="$bar" class="drag-bar2"></div>
            </div>
        </div>
        `
    }
    
    initialize () {
        this.pos = {}    
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
        this.refs.$colorbar.css('background',  'linear-gradient(to right, ' + start + ', ' + end + ')');
    }
    
    setOpacity(e) {
        var min = this.refs.$container.offset().left;
        var max = min + this.state.get('$container.width');
        var current = Event.pos(e).clientX;
        var dist;
    
        var dist;
        if (current < min) {
            dist = 0;
            this.refs.$bar.addClass('first').removeClass('last')
        } else if (current > max) {
            dist = 100;
            this.refs.$bar.addClass('last').removeClass('first')
        } else {
            dist = (current - min) / (max - min) * 100;
            this.refs.$bar.removeClass('first').removeClass('last')
        }  
    
        var x = (this.state.get('$container.width') * (dist/100));
    
        this.refs.$bar.css({
            // left: (x -Math.ceil(this.state.get('$opacity_drag_bar.width')/2)) + 'px'
            left: (x) + 'px'            
        });
    
        this.pos = { x };
    
        this.parent.colorpicker.setCurrentA(this.caculateOpacity());
        this.parent.colorpicker.currentFormat();
        this.parent.colorpicker.setInputColor();
    }
 
    setInputColor () {
        this.setBackgroundColor(this.parent.colorpicker.getFormattedColor('rgb'));
        
        var rgb = this.parent.colorpicker.convertRGB();
        var colorString = Color.format(rgb, 'rgb');
        this.setOpacityColorBar(colorString);        
    }

    setColorUI() {
        var x = this.state.get('$container.width') * (this.parent.colorpicker.currentA || 0);
        this.refs.$bar.css({ left : (x) + 'px' });
        this.pos = { x };
        
    }

    caculateOpacity() {
        var opacityPos = this.pos  || { x : 0 };
        var a = Math.round((opacityPos.x / this.state.get('$container.width')) * 100) / 100;

        return isNaN(a) ? 1 : a;
    }

    // Event Bindings 
    'mouseup document' (e) {
        this.isDown = false;
    }

    'mousemove document' (e) {
        if (this.isDown) {
            this.setOpacity(e);
        }
    }
    
    'mousedown $bar' (e) {
        e.preventDefault();
        this.isDown = true; 
    }
    
    'mousedown $container' (e) {
        this.isDown = true; 
        this.setOpacity(e);
    }    
}
