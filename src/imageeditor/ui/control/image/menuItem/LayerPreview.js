import UIElement from '../../../../../colorpicker/UIElement';

export default class LayerPreview extends UIElement {

    template () {  
        return `
            <div class="layer-preview">
            </div>            
        `
    }
    
    'load $el' () {
        var item = this.read('/item/current/layer');

        if (!item) return '';

        var imageList = this.read('/item/filter/children', item.id, (item) => {
            return item.selected;
        });

        var selected = !imageList.length ? 'selected' : ''
 
        return ` 
            <div class='tree-item ${selected}' type='layer'>
                <div class="item-view-container">
                    <div class="item-view"  style='${this.read('/layer/toString', item, false)}'></div>
                    <div class="item-view-background-color" style="background-color: ${item.style['background-color']};"></div>
                </div>
            </div>`
    }


    refresh () {
        this.load()
    }

    '@changeEditor' () {
        this.refresh()
    }

    'click $el .tree-item' (e) {
        this.read('/item/current/layer', (layer) => {

            this.read('/item/each/children', layer.id, (image) => {

                image.selected = false; 
            })

            this.dispatch('/item/select', layer.id);
            this.refresh()
        });        

    }    

}