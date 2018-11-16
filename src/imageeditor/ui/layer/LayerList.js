import UIElement from '../../../colorpicker/UIElement';

export default class LayerList extends UIElement {

    template () { 
        return `
            <div class='layers'>
                <div class='title'> 
                    <h1>Layers</h1>
                    <div class="tools">
                        <button type="button" class='add-layer' ref="$addLayer">+</button>
                        <button type="button" class='view-sample' ref="$viewSample">
                            <div class="arrow"></div>
                        </button>
                    </div>
                </div>             
                <div class="layer-list" ref="$layerList"></div>
            </div>
        `
    }

    makeItemNode (node, index) {
        var item = this.read('/item/get', node.id);

        var layer = this.read('/item/current/layer')

        var selectedId = '' 
        if (layer) selectedId = layer.id ; 

        if (item.itemType == 'layer') {
            return this.makeItemNodeLayer(item, selectedId, index);
        }

    }
 
    makeItemNodeLayer (item, selectedId, index = 0) {
        var selected = item.id == selectedId ? 'selected' : ''; 
        return `
            <div class='tree-item ${selected}' id="${item.id}" type='layer' draggable="true">
                <div class="item-view-container">
                    <div class="item-view"  style='${this.read('/layer/toString', item, false)}'></div>
                </div>
                <div class="item-title"> 
                    ${index+1}. ${item.name || `Layer `} 
                    <button type="button" class='delete-item' item-id='${item.id}' title="Remove">&times;</button>
                </div>
                <div class='item-tools'>
                    <button type="button" class='copy-item' item-id='${item.id}' title="Copy">+</button>
                </div>                            
            </div>
            `
    }    

    'load $layerList' () {
        var page = this.read('/item/current/page')

        if (!page) {
            return '';
        }

        return this.read('/item/map/children', page.id, (item, index) => {
            return this.makeItemNode(item, index); 
        })
    }

    refresh () {
        this.load()
    }

    '@changeEditor' () {
        this.refresh()
    }

    'click $addLayer' (e) {
        this.read('/item/current/page', (page) => {
            this.dispatch('/item/add', 'layer', true, page.id)
            this.refresh();    
        });
    }

    'click.self $layerList .tree-item' (e) { 

        this.dispatch('/item/select', e.$delegateTarget.attr('id'));
        this.refresh();

        if (e.$delegateTarget.attr('type') == 'layer') {
            this.emit('@selectLayer')
        }
        
    }

    'dragstart $layerList .tree-item' (e) {
        this.draggedLayer = e.$delegateTarget;
        this.draggedLayer.css('opacity', 0.5);
        // e.preventDefault();
    }

    'dragend $layerList .tree-item' (e) {

        if (this.draggedLayer) {
            this.draggedLayer.css('opacity', 1);        
        }
    }    

    'dragover $layerList .tree-item' (e) {
        e.preventDefault();        
    }        

    'drop.self $layerList .tree-item' (e) {
        e.preventDefault();        

        var destId = e.$delegateTarget.attr('id')
        var sourceId = this.draggedLayer.attr('id')

        this.draggedLayer = null; 
        this.dispatch('/item/move/in', destId, sourceId)
        this.refresh()
    }       
    
    'drop $layerList' (e) {
        e.preventDefault();        

        if (this.draggedLayer) {
            var sourceId = this.draggedLayer.attr('id')

            this.draggedLayer = null; 
            this.dispatch('/item/move/last', sourceId)
            this.refresh()
        }

    }           

    'click $layerList .copy-item' (e) {
        this.dispatch('/item/addCopy/layer', e.$delegateTarget.attr('item-id'))
        this.refresh()
    }

    'click $layerList .delete-item' (e) {
        this.dispatch('/item/remove', e.$delegateTarget.attr('item-id'))
        this.refresh()
    }

    'click $viewSample' (e) {
        this.emit('toggleLayerSampleView');
    }
}