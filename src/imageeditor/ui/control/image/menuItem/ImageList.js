import UIElement from '../../../../../colorpicker/UIElement';

export default class ImageList extends UIElement {

    template () {  
        return `
            <div class='images'>
                <div class='image-tools'>   
                    <div class="image-list" ref="$imageList">

                    </div>
                </div>
            </div>
        `
    }

    makeAddButton () {
        return `<div class='menu-buttons'><button type="button" class='add-button'>+ Gradient</button></div>`
    }

    makeItemNodeImage (item) {
        var selected = item.selected ? 'selected' : '' 
        return `
            <div class='tree-item ${selected}' id="${item.id}" >
                <div class="item-view-container">
                    <div class="item-view"  style='${this.read('/image/toString', item)}'></div>
                </div>
                <div class='item-tools'>
                    <button type="button" class='copy-item' item-id='${item.id}'>+</button>
                    <button type="button" class='delete-item' item-id='${item.id}'>&times;</button>
                    <button type="button" class='left-item' item-id='${item.id}'>&lt;&lt;</button>
                    <button type="button" class='right-item' item-id='${item.id}'>&gt;&gt;</button>
                </div>            
            </div>
            `
    }       

    'load $imageList' () {
        var item = this.read('/item/current/layer');

        if (!item) return ''; 

        var imageString = this.read('/item/map/children', item.id, (item) => {
            return this.makeItemNodeImage(item)
        }).join('');

        imageString  += this.makeAddButton();

        return imageString;
    }

    refresh () {
        this.load()
    }

    '@changeEditor' () {
        this.refresh()
    }

    isNotSelected (e) {
        return !e.$delegateTarget.hasClass('selected')
    }

    'click.self.isNotSelected $imageList .tree-item' (e) { 
        var id = e.$delegateTarget.attr('id')

        if (id) {
            this.dispatch('/item/select', id);
            this.refresh();
        }

    }

    'click $imageList .add-button' (e) {
        this.read('/item/current/layer', (item) => {
            this.dispatch('/item/add', 'image', false, item.id)
            this.refresh()
        }); 
    }       

}