import UIElement from '../../../colorpicker/UIElement';

export default class LayerList extends UIElement {

    template () { 
        return `
            <div class='layers'>
                <div class='title'> 
                    <h1>Layers</h1>
                    <div class="tools">
                        <button type="button" class='add-layer' ref="$addLayer">+</button>
                    </div>
                </div>             
                <div class="layer-list" ref="$layerList"></div>
            </div>
        `
    }

    makeItemNode (node) {
        var item = this.read('/item/get', node.id);

        var layer = this.read('/item/current/layer')

        var selectedId = '' 
        if (layer) selectedId = layer.id ; 

        if (item.itemType == 'layer') {
            return this.makeItemNodeLayer(item, selectedId);
        }

    }
 
    makeItemNodeLayer (item, selectedId) {
        var selected = item.id == selectedId ? 'selected' : ''; 
        return `
            <div class='tree-item ${selected}' id="${item.id}" type='layer'>
                <div class="item-view-container">
                    <div class="item-view"  style='${this.read('/layer/toString', item, false)}'></div>
                </div>
                <div class="item-title"> ${item.name || `Layer `} </div>
            </div>
            `
    }    

    'load $layerList' () {
        var page = this.read('/item/current/page')

        if (!page) {
            return '';
        }

        return this.read('/item/map/children', page.id, (item, index) => {
            return this.makeItemNode(item); 
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
}