import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import ColorSetsList from './ColorSetsList'

const color = ColorUtil.color;
const hue_color = ColorUtil.hue_color;

export default class CurrentColorSetsContextMenu {
    constructor (colorpicker) {

        this.colorpicker = colorpicker; 
        this.currentColorSets = colorpicker.currentColorSets;

        this.$EventClickMenuItem = this.EventClickMenuItem.bind(this);

        this.initialize();
    } 

    initialize () {
        // make colorsets view 
        this.$el = new Dom('ul', 'colorsets-contextmenu' );

        this.$el.append(new Dom('li', 'menu-item small-hide', {
            'data-type' : 'remove-color'
        }).html('Remove color')) 

        this.$el.append(new Dom('li', 'menu-item small-hide', {
            'data-type' : 'remove-all-to-the-right'
        }).html('Remove all to the right'))

        this.$el.append(new Dom('li', 'menu-item', {
            'data-type' : 'clear-palette'
        }).html('Clear palette'));

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

    EventClickMenuItem (e) {
        e.preventDefault();
        const $target = new Dom(e.target);
        
        const $item = $target.closest('menu-item');
        if ($item) {
            this.runCommand($item.attr('data-type'));
        }
        this.hide();        
    }

    initializeEvent () {
        Event.addEvent(this.$el.el, 'click', this.$EventClickMenuItem);
    }

    destroy() {
        Event.removeEvent(this.$el.el, 'click', this.$EventSelectColor);        
    }
}
