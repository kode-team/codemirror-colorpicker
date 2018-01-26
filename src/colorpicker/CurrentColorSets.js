import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import ColorSetsList from './ColorSetsList'

const color = ColorUtil.color;
const hue_color = ColorUtil.hue_color;

export default class CurrentColorSets {
    constructor (colorpicker) {

        this.colorpicker = colorpicker; 

        this.colorSetsList = this.colorpicker.colorSetsList;

        this.$EventToggleColorChooser = this.EventToggleColorChooser.bind(this);
        this.$EventSelectColor = this.EventSelectColor.bind(this);

        this.initialize();
    } 
    
    makeCurrentColorSets () {
        var list = new Dom('div', 'current-color-sets');
        const currentColorSets  = this.colorSetsList.getCurrentColorSets()
        const colors  = this.colorSetsList.getCurrentColors()
        
    
        for(var i = 0, len = colors.length; i < len; i++) {
            var color = colors[i];
            var item = new Dom('div', 'color-item', { 
                'title' : color,  
                'data-color' : color
            });
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
        this.$colorSetsMenu = new Dom('div', 'menu', {
            title: 'Open Color Pallets'
        });
        this.$colorSetsColorList = new Dom('div', 'color-list' );

        this.$colorSetsChooseButton = new Dom('button', 'color-sets-choose-btn arrow-button', {
            type : 'button'
        });
        this.$colorSetsMenu.append(this.$colorSetsChooseButton)

        this.$el.append(this.$colorSetsMenu);
        this.$el.append(this.$colorSetsColorList);
    
        this.refresh();
    }

    refresh () {
        this.$colorSetsColorList.empty();
        this.$colorSetsColorList.append(this.makeCurrentColorSets())    
    }

    EventToggleColorChooser (e) {
        this.colorpicker.toggleColorChooser();
    }

    EventSelectColor (e) {
        e.preventDefault();
        const $item = new Dom(e.target).closest('color-item');

        if ($item) {
            const color = $item.attr('data-color');
            this.colorpicker.setColor(color);
        }
    }

    initializeEvent () {
        Event.addEvent(this.$colorSetsChooseButton.el, 'click', this.$EventToggleColorChooser);        
        Event.addEvent(this.$colorSetsColorList.el, 'click', this.$EventSelectColor);
    }

    destroy() {
        Event.removeEvent(this.$colorSetsChooseButton.el, 'click', this.$EventToggleColorChooser);
        Event.removeEvent(this.$colorSetsColorList.el, 'click', this.$EventSelectColor);        
    }
}
