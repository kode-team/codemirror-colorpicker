import BasePropertyItem from "./BasePropertyItem";

export default class CachedLayers extends BasePropertyItem {
    template () {
        return `
            <div class='property-item cached-layers'>
                <div class='title' ref="$title">Layers</div>
                <div class='items'>            
                    <div ref="$layerList"></div>
                </div>
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
        // 리스트 추가 버튼 필요 
        // 개별 객체 삭제 버튼 필요 


        return this.read('/storage/layers').map( (item, index) => {
            return this.makeItemNode(item); 
        })
    }    

    refresh () {
        this.load()
    }

    '@changeEditor' () {
        this.refresh()
    }

}