import BaseSlider from "./BaseSlider";

const source = 'vertical-slider';

export default class VerticalSlider extends BaseSlider {

    getMaxDist () {
        return this.state.get('$container.height');
    }

    getMinPosition () {
        return this.refs.$container.offset().top;
    }
}
