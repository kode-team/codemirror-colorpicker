import UIElement from '../../../colorpicker/UIElement';

export default class ImageList extends UIElement {

    template () {  
        return `
            <div class='images'>
                <div class='image-tools'>   
                    <div class='menu-buttons'>
                        <div class='gradient-type' ref="$gradientType">
                            <div class="gradient-item static" data-type="static" title="Static Color"></div>
                            <div class="gradient-item linear" data-type="linear" title="Linear Gradient"></div>
                            <div class="gradient-item radial" data-type="radial" title="Radial Gradient"></div>
                            <div class="gradient-item repeating-linear" data-type="repeating-linear" title="repeating Linear Gradient"></div>
                            <div class="gradient-item repeating-radial" data-type="repeating-radial" title="repeating Radial Gradient"></div>
                            <div class="gradient-item image" data-type="image" title="Background Image">
                                <div class="m1"></div>
                                <div class="m2"></div>
                                <div class="m3"></div>
                            </div>
                        </div>
                    </div>
                    <div class="image-list" ref="$imageList">

                    </div>
                </div>
            </div>
        `
    }

    makeItemNodeImage (item) {
        var selected = item.selected ? 'selected' : '' 
        return `
            <div class='tree-item ${selected}' id="${item.id}" >
                <div class="item-view-container">
                    <div class="item-view"  style='${this.read('/image/toString', item)}'></div>
                </div>
                <div class='item-tools'>
                    <button type="button" class='copy-item' item-id='${item.id}'>&times;</button>
                    <button type="button" class='delete-item' item-id='${item.id}'>&times;</button>
                    <button type="button" class='left-item' item-id='${item.id}'>&lt;</button>
                    <button type="button" class='right-item' item-id='${item.id}'>&gt;</button>
                </div>            
            </div>
            ` 
    }       

    'load $imageList' () {
        var item = this.read('/item/current/layer');

        if (!item)  {
            var page = this.read('/item/current/page');
            if (page) {
                var list = this.read('/item/list/children', page.id)
                if (list.length) {
                    item = { id: list[0]}
                } else {
                    return '';
                }
            }
            
        }; 

        return this.read('/item/map/children', item.id, (item) => {
            return this.makeItemNodeImage(item)
        })
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

    'click $gradientType .gradient-item' (e) {
        this.read('/item/current/layer', (item) => {

            var type = e.$delegateTarget.attr('data-type')

            this.dispatch('/item/add/image', type, true, item.id)
            this.refresh()
        }); 
    }       

    'click $imageList .copy-item' (e) {
        this.dispatch('/item/addCopy', e.$delegateTarget.attr('item-id'))
        this.refresh()
    }

    'click $imageList .delete-item' (e) {
        this.dispatch('/item/remove', e.$delegateTarget.attr('item-id'))
        this.refresh()
    }

    'click $imageList .left-item' (e) {
        this.dispatch('/item/move/prev', e.$delegateTarget.attr('item-id'))
        this.refresh()
    }

    'click $imageList .right-item' (e) {
        this.dispatch('/item/move/next', e.$delegateTarget.attr('item-id'))
        this.refresh()
    }

}