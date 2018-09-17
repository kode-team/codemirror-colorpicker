import Event from '../util/Event'
import BaseSlider from "./BaseSlider";

export default class VerticalSlider extends BaseSlider {

    constructor (opt) {
        super(opt)

        this.source = 'vertical-slider'
    }

    /** get max height for vertical slider */
    getMaxDist () {
        return this.state.get('$container.height');
    }

    /** set mouse pointer for vertical slider */
    setMousePosition (y) {
        this.refs.$bar.css({ top : (y) + 'px' });
    }

    /** get mouse position by pageY for vertical slider */    
    getMousePosition (e) {
        return Event.pos(e).pageY;
    }       

    /** get min position for vertial slider */
    getMinPosition () {
        return this.refs.$container.offset().top;
    }

    /** get caculated dist for domain value   */
    getCaculatedDist (e) {
        var current = e ? this.getMousePosition(e) : this.getCurrent(this.getDefaultValue() / this.maxValue);
        var dist =  100 - this.getDist(current);
        
        return dist; 
    }

    /** set drag bar position  */
    setColorUI(v) {
        
        v = v || this.getDefaultValue(); 

        if (v <= this.minValue) {
            this.refs.$bar.addClass('first').removeClass('last')
        } else if (v >= this.maxValue) {
            this.refs.$bar.addClass('last').removeClass('first')
        } else {
            this.refs.$bar.removeClass('last').removeClass('first')
        }

        var per = 1 - ( (v || 0) / this.maxValue);

        this.setMousePosition(this.getMaxDist() * per );
    }        
}
