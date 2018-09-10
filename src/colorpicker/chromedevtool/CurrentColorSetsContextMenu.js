import Event from '../../util/Event'
import UIElement from '../UIElement';

export default class CurrentColorSetsContextMenu extends UIElement {

    template () {
        return `
            <ul class="colorsets-contextmenu">
                <li class="menu-item small-hide" data-type="remove-color">Remove color</li>
                <li class="menu-item small-hide" data-type="remove-all-to-the-right">Remove all to the right</li>
                <li class="menu-item" data-type="clear-palette">Clear palette</li>
            </ul>
        `
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
            this.$store.dispatch('/removeCurrentColor', this.selectedColorIndex);        
            break;
        case 'remove-all-to-the-right': 
            this.$store.dispatch('/removeCurrentColorToTheRight', this.selectedColorIndex);        
            break;
        case 'clear-palette': 
            this.$store.dispatch('/clearPalette');
            break;
        }
    }

    '@showContextMenu' (e, index) {
        this.show(e, index)
    }

    'click $el .menu-item' (e) {
        e.preventDefault();

        this.runCommand(e.$delegateTarget.attr('data-type'));
        this.hide();        
    }

}
