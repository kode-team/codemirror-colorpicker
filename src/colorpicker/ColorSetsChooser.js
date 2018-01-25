import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'

const color = ColorUtil.color;
const hue_color = ColorUtil.hue_color;

export default class ColorSetsChooser {
    constructor (colorpicker) {

        this.colorpicker = colorpicker; 

        this.initialize();
    } 

    initialize () {
        // make colorset-chooser 
        this.$el = new Dom('div', 'color-chooser' );
        const $colorsetsList = new Dom('div', 'colorsets-list' );
    
        this.$el.append($colorsetsList);
    }

    initializeEvent() {
        
    }

    destroy () {

    }
}
