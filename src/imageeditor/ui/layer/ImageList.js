import UIElement from '../../../colorpicker/UIElement';

export default class ImageList extends UIElement {

    template () {  
        return `
            <div class='images'>
                <div class="title">Gradients</div>
                <div class='image-tools'>   
                    <div class="image-list" ref="$imageList"> </div>                                       
                    <div class='menu-buttons'>
                        <div class='gradient-type' ref="$gradientType">
                            <div class="gradient-item linear" data-type="linear" title="Linear Gradient"></div>
                            <div class="gradient-item radial" data-type="radial" title="Radial Gradient"></div>
                            <div class="gradient-item conic" data-type="conic" title="Conic Gradient"></div>                            
                            <div class="gradient-item repeating-linear" data-type="repeating-linear" title="repeating Linear Gradient"></div>
                            <div class="gradient-item repeating-radial" data-type="repeating-radial" title="repeating Radial Gradient"></div>
                            <div class="gradient-item repeating-conic" data-type="repeating-conic" title="repeating Conic Gradient"></div>                            
                            <div class="gradient-item static" data-type="static" title="Static Color"></div>                                
                            <div class="gradient-item image" data-type="image" title="Background Image">
                                <div class="m1"></div>
                                <div class="m2"></div>
                                <div class="m3"></div> 
                            </div>                                                  
                        </div>
                        <div class="gradient-sample-list">
                            <div class="arrow">
                            </div>
                        </div>
                    </div> 

                </div>
            </div>
        `
    }

    makeItemNodeImage (item) {
        var selected = item.selected ? 'selected' : '' 
        return `
            <div class='tree-item ${selected}' data-id="${item.id}" draggable="true" >
                <div class="item-view-container">
                    <div class="item-view"  style='${this.read('/image/toString', item)}'></div>
                </div>
                <div class='item-tools'>
                    <button type="button" class='delete-item' item-id='${item.id}' title="Remove">&times;</button>                
                    <button type="button" class='copy-item' item-id='${item.id}' title="Copy">&times;</button>
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

    'click.self $imageList .tree-item' (e) { 
        var id = e.$delegateTarget.attr('data-id')

        if (id) {
            this.dispatch('/item/select', id);
            this.refresh();
        }

    }

    'click $gradientType .gradient-item' (e) {
        this.read('/item/current/layer', (item) => {

            var type = e.$delegateTarget.attr('data-type')

            this.dispatch('/item/prepend/image', type, true, item.id)
            this.refresh()
        }); 
    }       

    'dragstart $imageList .tree-item' (e) {
        this.draggedImage = e.$delegateTarget;
        this.draggedImage.css('opacity', 0.5);
        // e.preventDefault();
    }

    'dragend $imageList .tree-item' (e) {

        if (this.draggedImage) {
            this.draggedImage.css('opacity', 1);        
        }
    }    

    'dragover $imageList .tree-item' (e) {
        e.preventDefault();        
    }        

    'drop.self $imageList .tree-item' (e) {
        e.preventDefault();        

        var destId = e.$delegateTarget.attr('data-id')
        var sourceId = this.draggedImage.attr('data-id')

        this.draggedImage = null; 
        this.dispatch('/item/move/in', destId, sourceId)
        this.refresh()
    }       
    
    'drop $imageList' (e) {
        e.preventDefault();        

        if (this.draggedImage) {
            var sourceId = this.draggedImage.attr('data-id')

            this.draggedImage = null; 
            this.dispatch('/item/move/last', sourceId)
            this.refresh()
        }

    }           

    'click $imageList .copy-item' (e) {
        this.dispatch('/item/addCopy/image', e.$delegateTarget.attr('item-id'))
        this.refresh()
    }

    'click $imageList .delete-item' (e) {
        this.dispatch('/item/remove', e.$delegateTarget.attr('item-id'))
        this.refresh()
    }   

    'click $el .gradient-sample-list' (e) {
        this.emit('toggleGradientSampleView');
    }
}