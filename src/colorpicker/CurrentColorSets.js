import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import EventMachin from '../util/EventMachin'
import ColorSetsList from './ColorSetsList'

const color = ColorUtil.color;
const hue_color = ColorUtil.hue_color;

export default class CurrentColorSets extends EventMachin {
    constructor (colorpicker) {
        super();

        this.colorpicker = colorpicker; 

        this.colorSetsList = this.colorpicker.colorSetsList;

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
                'data-index' : i,
                'data-color' : color
            });

            item.createChild('div', 'empty');
            item.createChild('div', 'color-view', null, { 'background-color': color })

    
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

    refreshAll () {
        this.refresh();
        this.colorpicker.refreshColorSetsChooser();        
    }

    addColor (color) {
        this.colorSetsList.addCurrentColor(color);
        this.refreshAll();
    }

    removeColor (index) {
        this.colorSetsList.removeCurrentColor(index);
        this.refreshAll();
    }

    removeAllToTheRight (index) {
        this.colorSetsList.removeCurrentColorToTheRight(index);
        this.refreshAll();
    }

    clearPalette () {
        this.colorSetsList.clearPalette();
        this.refreshAll();
    }

    'click $colorSetsChooseButton' (e) {
        this.colorpicker.toggleColorChooser();
    }

    'contextmenu $colorSetsColorList' (e) {
        e.preventDefault();
        const currentColorSets  = this.colorSetsList.getCurrentColorSets()

        if (!currentColorSets.edit) {
            return; 
        }

        const $target = new Dom(e.target);
        
        const $item = $target.closest('color-item');

        if ($item) {
            const index = parseInt($item.attr('data-index'));
            
            this.colorpicker.showContextMenu(e, index);
        } else {
            this.colorpicker.showContextMenu(e);
        }
    }

    'click $colorSetsColorList'  (e) {
        e.preventDefault();
        const $target = new Dom(e.target);
        
        const $item = $target.closest('color-item');

        if ($item) {
            const color = $item.attr('data-color');
            this.colorpicker.setColor(color);
        } else {
            const $addColorItem = $target.closest('add-color-item');

            if ($addColorItem) {
                this.addColor(this.colorpicker.getCurrentColor());
            }
        }
    }

    initializeEvent () {
        this.initializeEventMachin();

        
    }

    destroy() {
        this.destroyEventMachin();       
    }
}
