import Dom from '../../util/Dom'
import UIElement from '../UIElement';

export default class CurrentColorSets extends UIElement {

    template() {
        return `
            <div class="colorsets">
                <div class="menu" title="Open Color Palettes">
                    <button ref="$colorSetsChooseButton" type="button" class="color-sets-choose-btn arrow-button"></button>
                </div>
                <div ref="$colorSetsColorList" class="color-list"></div>
            </div>
        `
    }    
    
    'load $colorSetsColorList' () {
        const currentColorSets  = this.read('/getCurrentColorSets')
        const colors  = this.read('/getCurrentColors')

        return `
            <div class="current-color-sets">
            ${colors.map( (color, i) => {
                return `<div class="color-item" title="${color}" data-index="${i}" data-color="${color}">
                    <div class="empty"></div>
                    <div class="color-view" style="background-color: ${color}"></div>
                </div>`
            }).join('')}   
            ${currentColorSets.edit ? `<div class="add-color-item">+</div>` : ''}         
            </div>
        `
    }    

    refresh () {
        this.load();
    }


    addColor (color) {
        this.dispatch('/addCurrentColor', color);
        this.refresh();
    }

    '@changeCurrentColorSets' () {
        this.refresh()
    }

    'click $colorSetsChooseButton' (e) {
        this.emit('toggleColorChooser');
    }

    'contextmenu $colorSetsColorList' (e) {
        e.preventDefault();
        const currentColorSets  = this.read('/getCurrentColorSets')

        if (!currentColorSets.edit) {
            return; 
        }

        const $target = new Dom(e.target);
        
        const $item = $target.closest('color-item');

        if ($item) {
            const index = parseInt($item.attr('data-index'));

            this.emit('showContextMenu', e, index);
        } else {
            this.emit('showContextMenu', e);            
        }
    }

    'click $colorSetsColorList .add-color-item' (e) {
        this.addColor(this.dispatch('/toColor'));
    }

    'click $colorSetsColorList .color-item'  (e) {
        this.dispatch('/changeColor', e.$delegateTarget.attr('data-color'));
    }

}
