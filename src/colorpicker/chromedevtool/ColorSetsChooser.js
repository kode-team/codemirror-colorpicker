import Dom from '../../util/Dom'
import EventMachin from '../../util/EventMachin'

const DATA_COLORSETS_INDEX = 'data-colorsets-index';

export default class ColorSetsChooser extends EventMachin {
    constructor (colorpicker) {
        super();

        this.colorpicker = colorpicker;       

        this.initialize();
    } 

    initialize () {

        this.template(`
            <div class="color-chooser">
                <div class="color-chooser-container">
                    <div class="colorsets-item colorsets-item-header">
                        <h1 class="title">Color Paletts</h1>
                        <span ref="$toggleButton" class="items">&times;</span>
                    </div>
                    <div ref="$colorsetsList" class="colorsets-list"></div>
                </div>
            </div>
        `)

        this.refresh();
    }

    refresh () {
        this.refs.$colorsetsList.html(this.makeColorSetsList());
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
            if (this.colorpicker.isPaletteType() && element.edit ) {
                // NOOP
            } else {
                const $item = $div.createChild('div', 'colorsets-item', {
                    [DATA_COLORSETS_INDEX] : index 
                });

                $item.createChild('h1', 'title').html(element.name)

                $item.createChild('div', 'items').append(this.makeColorItemList(element.colors, 5))
            }
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

    'click $colorsetsList .colorsets-item' (e) {
        const $item = e.$delegateTarget;

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
