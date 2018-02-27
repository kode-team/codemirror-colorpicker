import Color from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import EventMachin from '../util/EventMachin'

const DATA_COLORSETS_INDEX = 'data-colorsets-index';

export default class ColorSetsChooser extends EventMachin {
    constructor (colorpicker) {
        super();

        this.colorpicker = colorpicker;       

        this.initialize();
    } 

    initialize () {
        // make colorset-chooser 
        this.$el = new Dom('div', 'color-chooser' );

        const $container = this.$el.createChild('div', 'color-chooser-container');

        const $header = $container.createChild('div', 'colorsets-item colorsets-item-header');
        
        $header.createChild('h1', 'title').html('Color Paletts')

        this.$toggleButton = $header.createChild('span', 'items').html('&times;');
                
        this.$colorsetsList = $container.createChild('div', 'colorsets-list' );

        this.refresh();
    }

    refresh () {
        this.$colorsetsList.html(this.makeColorSetsList());
    }

    makeColorItemList (colors, maxCount = 5) {
        var $list = new Dom('div');
    
        for(var i = 0; i < maxCount; i++) {
            var color = colors[i] || 'rgba(255, 255, 255, 1)';
            var $item = $list.createChild('div', 'color-item', {
                title: color
            });

            $item.createChild('div', 'color-view', null, {         
                'background-color': color 
            });
        }
    
        return $list;         
    }

    makeColorSetsList () {
        const $div = new Dom('div');

        // colorsets 
        const colorSets = this.colorpicker.getColorSetsList();
        colorSets.forEach( (element, index) => {
            const $item = $div.createChild('div', 'colorsets-item', {
                [DATA_COLORSETS_INDEX] : index 
            });

            $item.createChild('h1', 'title').html(element.name)

            $item.createChild('div', 'items').append(this.makeColorItemList(element.colors, 5))

        });

        return $div; 
    }

    show () {
        this.$el.addClass('open');
    }

    hide () {
        this.$el.removeClass('open');
    }

    toggle () {
        this.$el.toggleClass('open');
    }


    'click $toggleButton' (e) {
        this.toggle();
    }

    'click $colorsetsList' (e) {
        e.preventDefault();
        const $item = new Dom(e.target).closest('colorsets-item');

        if ($item) {

            const index = parseInt($item.attr(DATA_COLORSETS_INDEX));
            this.colorpicker.setCurrentColorSets(index);
            this.hide();
        }
    }

    destroy () {
        super.destroy();

        this.hide();
    }

}
