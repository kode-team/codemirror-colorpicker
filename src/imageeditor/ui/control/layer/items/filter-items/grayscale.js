import UIElement from '../../../../../../colorpicker/UIElement'

export default class Grayscale extends UIElement {

    template () { 
        return `
            <div class='filter-item data-filter="grayscale">
                <div class="filter-item-view-container">
                    <div class="filter-item-blend-view" style='${this.read('/filter/toString', item, 'grayscale')}'></div>
                    <div class="filter-item-text">Grayscale</div>
                </div>
            </div>
        `
    }
}