
import Event from '../util/Event'
import UIElement from './UIElement';

const source = 'base-slider';

export default class BaseSlider extends UIElement {

    onDragMove (e) { }
    onDragStart (e) { }
    onDragEnd (e) {}

    getMinMax () {
        var min = this.refs.$container.offset().left;
        var width = this.state.get('$container.width')
        var max = min + width;

        return { min, max, width }
    }

    getCurrent (value) {
        var width = this.state.get('$container.width')
        return min + width * value; 
    }

    getDist (current) {
        var {min, max} = this.getMinMax()

        var dist; 
        if (current < min) {
            dist = 0;
        } else if (current > max) {
            dist = 100;
        } else {
            dist = (current - min) / (max - min) * 100;
        }

        return dist; 
    }

    // Event Bindings 
    'mouseup document' (e) {
        this.isDown = false ;
    }

    'mousemove document' (e) {
        if (this.isDown) {
            this.onDragMove(e);
        }
    }

    'mousedown $bar' (e) {
        e.preventDefault();
        this.isDown = true; 
    }
    
    'mousedown $container' (e) {
        this.isDown = true; 
        this.onDragStart(e);
    }
    
}
