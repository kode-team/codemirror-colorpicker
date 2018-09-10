
import Event from '../../../util/Event'
import UIElement from '../../UIElement';

const source = 'macos-control-Opacity';

export default class Value extends UIElement {

    template () {
        return `
            <div class="value">
                <div ref="$container" class="value-container">
                    <div ref="$bar" class="drag-bar"></div>
                </div>
            </div>
        `
    }

    refresh () {
        this.setColorUI();
    }
 
    setColorUI(v) {
    
        v = v || (this.$store.hsv.v)

        var valueX = this.state.get('$container.width') * v;

        this.refs.$bar.css({
            left : (valueX) + 'px'
        });
    
        this.pos = { x : valueX };
        
    }
        
    setValueForHSV(e) {

        if (!this.state.get('$container.width')) return;

        var min = this.refs.$container.offset().left;
        var max = min + this.state.get('$container.width');
        var current = e ? Event.pos(e).pageX : min + (max - min) * (1 - this.$store.hsv.v/100);
    
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

        this.setColorUI(dist/100)

        this.$store.dispatch('/changeColor', {
            type: 'hsv',
            v: dist/100,
            source
        })        
    }    

    '@changeColor' (sourceType) {
        if (source != sourceType) {
            this.refresh()
        }
    }

    // Event Bindings 
    'mouseup document' (e) {
        this.isDown = false ;
    }

    'mousemove document' (e) {
        if (this.isDown) {
            this.setValueForHSV(e);
        }
    }

    'mousedown $bar' (e) {
        e.preventDefault();
        this.isDown = true; 
    }
    
    'mousedown $container' (e) {
        this.isDown = true; 
        this.setValueForHSV(e);
    }
    
}
