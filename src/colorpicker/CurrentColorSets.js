import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import ColorSetsList from './ColorSetsList'

const color = ColorUtil.color;
const hue_color = ColorUtil.hue_color;

export default class CurrentColorSets {
    constructor (colorpicker) {

        this.colorpicker = colorpicker; 

        this.colorSetsList = new ColorSetsList(this.colorpicker);

        this.initialize();
    } 
    
    makeCurrentColorSets () {
        var list = new Dom('div', 'current-color-sets');
        const currentColorSets  = this.colorSetsList.getCurrentColorSets()
    
        for(var i = 0, len = currentColorSets.colors.length; i < len; i++) {
            var color = currentColorSets.colors[i];
            var item = new Dom('div', 'color-item', { 'data-color' : color});
            var colorView = new Dom('div', 'color-view');
            colorView.css({ 'background-color': color })
    
            item.append(colorView);
    
            list.append(item);
        }
    
        if (currentColorSets.edit) {
            var item = new Dom('div', 'add-color-item').html('+');
    
            list.append(item);
        }
    
        return list; 
    }    

    initialize () {
        // make colorsets view 
        this.$el = new Dom('div', 'colorsets' );

        this.$colorSets = this.$el; 
        this.$colorSetsMenu = new Dom('div', 'menu' );
        this.$colorSetsColorList = new Dom('div', 'color-list' );

        this.$colorSetsChooseButton = new Dom('button', 'color-sets-choose-btn').html('+');
        this.$colorSetsMenu.append(this.$colorSetsChooseButton)

        this.$el.append(this.$colorSetsMenu);
        this.$el.append(this.$colorSetsColorList);
    
        this.refresh();
    }

    refresh () {
        this.$colorSetsColorList.empty();
        this.$colorSetsColorList.append(this.makeCurrentColorSets())    
    }

    initializeEvent () {

    }

    destroy() {

    }
}
