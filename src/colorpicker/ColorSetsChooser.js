import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'

const color = ColorUtil.color;
const hue_color = ColorUtil.hue_color;

const DATA_COLORSETS_INDEX = 'data-colorsets-index';

export default class ColorSetsChooser {
    constructor (colorpicker) {

        this.colorpicker = colorpicker; 


        this.$EventToggle = this.EventToggle.bind(this);
        this.$EventClickColorSetsItem = this.EventClickColorSetsItem.bind(this);        

        this.initialize();
    } 

    initialize () {
        // make colorset-chooser 
        this.$el = new Dom('div', 'color-chooser' );

        const $container = new Dom('div', 'color-chooser-container');
        this.$el.append($container);

        const $header = new Dom('div', 'colorsets-item colorsets-item-header');
        
        this.$toggleButton = new Dom('span', 'items').html('&times;');

        $header.append(new Dom('h1', 'title').html('Color Pallets'))
        $header.append(this.$toggleButton)

        $container.append($header);
                

        this.$colorsetsList = new Dom('div', 'colorsets-list' );
        this.$colorsetsList.append(this.makeColorSetsList());
        $container.append(this.$colorsetsList);
    }

    makeColorItemList (colors, maxCount = 5) {
        var $list = new Dom('div');
    
        for(var i = 0, len = colors.length; i < len && i < maxCount; i++) {
            var color = colors[i];
            var $item = new Dom('div', 'color-item', {
                title: color
            });
            var $colorView = new Dom('div', 'color-view');
            $colorView.css({ 'background-color': color })
    
            $item.append($colorView);
    
            $list.append($item);
        }
    
        return $list;         
    }

    makeColorSetsList () {
        const $div = new Dom('div');

        // colorsets 
        const colorSets = this.colorpicker.getColorSetsList();
        colorSets.forEach( (element, index) => {
            const $item = new Dom('div', 'colorsets-item', {
                [DATA_COLORSETS_INDEX] : index 
            });
    
            const $span = new Dom('div', 'items');
            $span.append(this.makeColorItemList(element.colors, 5));

            $item.append(new Dom('h1', 'title').html(element.name))
            $item.append($span)

            $div.append($item);
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

    EventToggle (e) {
        this.toggle();
    }

    EventClickColorSetsItem (e) {
        e.preventDefault();
        const $item = new Dom(e.target).closest('colorsets-item');

        if ($item) {

            const index = parseInt($item.attr(DATA_COLORSETS_INDEX));
            this.colorpicker.setCurrentColorSets(index);
            this.hide();
        }
    }

    initializeEvent() {
        Event.addEvent(this.$toggleButton.el, 'click', this.$EventToggle);
        Event.addEvent(this.$colorsetsList.el, 'click', this.$EventClickColorSetsItem);
    }

    destroy () {
        Event.removeEvent(this.$toggleButton.el, 'click', this.$EventToggle);
        Event.removeEvent(this.$colorsetsList.el, 'click', this.$EventClickColorSetsItem);
    }
}
