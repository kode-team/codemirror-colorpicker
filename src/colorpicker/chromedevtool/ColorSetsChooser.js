import UIElement from '../UIElement';

const DATA_COLORSETS_INDEX = 'data-colorsets-index';

export default class ColorSetsChooser extends UIElement {

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

    refresh () {
        this.load();
    }

    '@changeCurrentColorSets' () {
        this.refresh()
    }

    '@toggleColorChooser' () {
        this.toggle()
    }

    // loadable 
    'load $colorsetsList' () {
        // colorsets 
        const colorSets = this.$store.dispatch('/getColorSetsList');

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

            this.$store.dispatch('/setCurrentColorSets', index);

            this.hide();
        }
    }

    destroy () {
        super.destroy();

        this.hide();
    }

}
