import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import EventMachin from '../util/EventMachin'

const color = ColorUtil.color;

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
            var item = list.createChild('div', 'color-item', { 
                'title' : color,  
                'data-index' : i,
                'data-color' : color
            });

            item.createChild('div', 'empty');
            item.createChild('div', 'color-view', null, { 
                'background-color': color 
            })
        }

        
        if (currentColorSets.edit) {
            list.createChild('div', 'add-color-item').html('+'); 
        }
    
        return list; 
    }    

    initialize () {
        // make colorsets view 
        this.$el = new Dom('div', 'colorsets' );

        const $colorSetsMenu = this.$el.createChild('div', 'menu', {
            title: 'Open Color Pallets'
        });
        this.$colorSetsColorList = this.$el.createChild('div', 'color-list' );

        this.$colorSetsChooseButton = $colorSetsMenu.createChild('button', 'color-sets-choose-btn arrow-button', {
            type : 'button'
        });
    
        this.refresh();
    }

    refresh () {
        this.$colorSetsColorList.html(this.makeCurrentColorSets())    
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

    'click $colorSetsColorList .add-color-item' (e) {
        this.addColor(this.colorpicker.getCurrentColor());
    }

    'click $colorSetsColorList .color-item'  (e) {
        this.colorpicker.setColor(e.$delegateTarget.attr('data-color'));
    }

}
