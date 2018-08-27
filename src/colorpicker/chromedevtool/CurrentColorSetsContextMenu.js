import Dom from '../../util/Dom'
import Event from '../../util/Event'
import EventMachin from '../../util/EventMachin'

export default class CurrentColorSetsContextMenu extends EventMachin {
    constructor (colorpicker) {
        super();

        this.colorpicker = colorpicker; 
        this.currentColorSets = colorpicker.currentColorSets;

        this.initialize();
    } 

    template () {
        return `
            <ul class="colorsets-contextmenu">
                <li class="menu-item small-hide" data-type="remove-color">Remove color</li>
                <li class="menu-item small-hide" data-type="remove-all-to-the-right">Remove all to the right</li>
                <li class="menu-item" data-type="clear-palette">Clear palette</li>
            </ul>
        `
    }

    initialize () {

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

        this.runCommand(e.$delegateTarget.attr('data-type'));
        this.hide();        
    }

}
