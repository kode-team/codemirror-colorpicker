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
}
