import Dom from '../../util/Dom'
import EventMachin from '../../util/EventMachin'

const DATA_COLORSETS_INDEX = 'data-colorsets-index';

export default class ColorSetsChooser extends EventMachin {
    constructor (colorpicker) {
        super();

        this.colorpicker = colorpicker;       

        this.initialize();
    } 

    template () {
        return `
            <div class="color-chooser">
                <div class="color-chooser-container">
                    <div class="colorsets-item colorsets-item-header">
                        <h1 class="title">Color Palettes</h1>
                        <span ref="$toggleButton" class="items">&times;</span>
                    </div>
                    <div ref="$colorsetsList" class="colorsets-list"></div>
                </div>
            </div>
        `
    }

    initialize () {

        this.load();
    }

    // loadable 
    'load $colorsetsList' () {
        // colorsets 
        const colorSets = this.colorpicker.getColorSetsList();

        return `
            <div>
                ${colorSets.map( (element, index) => {
                    return `
                        <div class="colorsets-item" data-colorsets-index="${index}" >
                            <h1 class="title">${element.name}</h1>
                            <div class="items">
                                <div>
                                    ${element.colors.filter((color, i) => i < 5).map(color => {
                                        color = color || 'rgba(255, 255, 255, 1)';
                                        return  `<div class="color-item" title="${color}">
                                                <div class="color-view" style="background-color: ${color}"></div>
                                            </div>`
                                    }).join('')}
                                </div>
                            </div>
                        </div>`
                }).join('')}
            </div>
        `
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
