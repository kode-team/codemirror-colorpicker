
const source = 'vertical-slider';

export default class VerticalSlider extends BaseSlider {

    getMinMax () {
        var min = this.refs.$container.offset().top;
        var height = this.state.get('$container.height')
        var max = min + height;

        return { min, max, height }
    }

    getCurrent (value) {
        var height = this.state.get('$container.height')
        return min + height * value; 
    }
}
