
import Color from '../../../util/Color'
import HueColor from '../../../util/HueColor'
import Event from '../../../util/Event'
import EventMachin from '../../../util/EventMachin'

export default class Hue extends EventMachin {
    constructor (parent) {
        super();
        this.parent = parent ; 
        this.initialize();
    } 

    template () {
        return `
            <div class="hue">
                <div ref="$container" class="hue-container">
                    <div ref="$bar" class="drag-bar"></div>
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
 
    setColorUI() {
    
        var hueX = this.state.get('$container.width') * (this.parent.colorpicker.currentH / 360);      

        this.refs.$bar.css({
            left : (hueX) + 'px'
        });
    
        this.pos = { x : hueX };
        
    }

    caculateH() {

        var huePos = this.pos  || { x : 0 };
        
        var h = (huePos.x / this.state.get('$container.width')) * 360;

        return { h } ; 
    }
        
    setHueColor(e, isOnlyHue) {

        if (!this.state.get('$container.width')) return;

        var min = this.refs.$container.offset().left;
        var max = min + this.state.get('$container.width');
        var current = e ? Event.pos(e).clientX : min + (max - min) * (this.parent.colorpicker.currentH / 360);
    
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
            // left: (x -Math.ceil(this.state.get('$drag_bar.width')/2)) + 'px'
            left: (x) + 'px'
        });
    
        this.pos = { x };

        var hueColor = HueColor.checkHueColor(dist/100);
    
        this.parent.colorpicker.setBackgroundColor(hueColor);
        this.parent.colorpicker.setCurrentH((dist/100) * 360);

        if (!isOnlyHue) {
            this.parent.colorpicker.setInputColor();
        }

    }    

    setOnlyHueColor() {
        this.setHueColor(null, true)
    }       

    // Event Bindings 
    'mouseup document' (e) {
        this.isDown = false ;
    }

    'mousemove document' (e) {
        if (this.isDown) {
            this.setHueColor(e);
        }
    }

    'mousedown $bar' (e) {
        e.preventDefault();
        this.isDown = true; 
    }
    
    'mousedown $container' (e) {
        this.isDown = true; 
        this.setHueColor(e);
    }
    
}
