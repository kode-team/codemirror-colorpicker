import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import EventMachin from '../util/EventMachin'

const color = ColorUtil.color;

export default class CurrentColorSetsContextMenu extends EventMachin {
    constructor (colorpicker) {
        super();

        this.colorpicker = colorpicker; 
        this.currentColorSets = colorpicker.currentColorSets;

        this.initialize();
    } 

    initialize () {
        // make colorsets view 
        this.$el = new Dom('ul', 'colorsets-contextmenu' );

        this.$el.createChild('li', 'menu-item small-hide', {
            'data-type' : 'remove-color'
        }).html('Remove color') 

        this.$el.createChild('li', 'menu-item small-hide', {
            'data-type' : 'remove-all-to-the-right'
        }).html('Remove all to the right')

        this.$el.createChild('li', 'menu-item', {
            'data-type' : 'clear-palette'
        }).html('Clear palette')

    }

    show (e, index) {
        const $event = Event.pos(e);

        this.$el.css({
            top: ($event.clientY - 10) + 'px',
            left: $event.clientX + 'px' 
        });
        this.$el.addClass('show');
        this.selectedColorIndex = index; 

        if (typeof this.selectedColorIndex == 'undefined') {
            this.$el.addClass('small')
        } else {
            this.$el.removeClass('small')
        }

    }

    hide () {
        this.$el.removeClass('show');
    }

    runCommand (command) {
        switch(command) {
        case 'remove-color': 
            this.currentColorSets.removeColor(this.selectedColorIndex); 
            break;
        case 'remove-all-to-the-right': 
            this.currentColorSets.removeAllToTheRight(this.selectedColorIndex); 
            break;
        case 'clear-palette': 
            this.currentColorSets.clearPalette(); 
            break;
        }
    }

    'click $el .menu-item' (e) {
        e.preventDefault();

        const $item = new Dom(e.delegateTarget);
        this.runCommand($item.attr('data-type'));
        this.hide();        
    }

    initializeEvent () {
        this.initializeEventMachin();
    }

}
