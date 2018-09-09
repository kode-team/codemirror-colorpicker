
import Event from '../../../util/Event'
import UIElement from '../../UIElement';

const source = 'chromedevtool-control-Hue';

export default class Hue extends UIElement {
    constructor (opt) {
        super(opt);
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

        this.$store.$ColorManager.on('change', (sourceType) => {
            if (source != sourceType) {
                this.refresh()
            }
        })
    }

    refresh () {
        this.setColorUI();
    }
 
    setColorUI(h) {
    
        h = h || this.$store.$ColorManager.hsv.h; 

        var x = this.state.get('$container.width') * ( h / 360);      

        this.refs.$bar.css({
            left : (x) + 'px'
        });
    
        this.pos = { x };
        
    }
        
    setHueColor(e) {

        if (!this.state.get('$container.width')) return;

        var min = this.refs.$container.offset().left;
        var max = min + this.state.get('$container.width');
        var current = e ? Event.pos(e).pageX : min + (max - min) * (this.$store.$ColorManager.hsv.h / 360);
    
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
    
        this.setColorUI(dist/100 * 360);

        this.$store.$ColorManager.changeColor({
            h: (dist/100) * 360,
            type: 'hsv',
            source
        })
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
