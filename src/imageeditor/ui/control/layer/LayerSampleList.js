import UIElement from "../../../../colorpicker/UIElement";
import { parseParamNumber } from "../../../../util/filter/functions";


export default class LayerSampleList extends UIElement {
 
    initialize () {
        super.initialize();

        this.list = this.read('/layer/list/sample', this.props.type); 
        this.dispatch('/storage/load/layer')

    }

    template () {

        return `
        <div class="layer-sample-list">
            <div class='cached-list' ref="$cachedList"></div>

        </div>
        `  
    }

    'load $cachedList' () {
        
        var list = this.list.map( (item, index) => {
            var data = this.read('/layer/cache/toString', item)

            var rateX = 160 / parseParamNumber(data.obj.width);
            var rateY = 120 / parseParamNumber(data.obj.height);

            var transform = `transform: scale(${rateX} ${rateY})`

            return `
            <div class='layer-sample-item'  data-sample-id="${item.id}">
                <div class="layer-view" style="${data.css}; ${transform}"></div>

                <div class='item-tools'>
                    <button type="button" class='add-item'  data-index="${index}" title="Addd">&times;</button>
                </div>          
            </div>`
        })

        var storageList = this.read('/storage/layers').map( item => {
            var data = this.read('/layer/cache/toString', item)

            var rateX = 160 / parseParamNumber(data.obj.width);
            var rateY = 120 / parseParamNumber(data.obj.height);

            var minRate = Math.min(rateY, rateX);            

            var transform = `transform-origin: left top;transform: scale(${minRate})`


            return `
                <div class='layer-cached-item' data-sample-id="${item.id}">
                    <div class="layer-view" style="${data.css}; ${transform}"></div>
                    <div class='item-tools'>
                        <button type="button" class='add-item'  data-sample-id="${item.id}" title="Add">&times;</button>                
                        <button type="button" class='delete-item'  data-sample-id="${item.id}" title="Delete">&times;</button>
                    </div>          
                </div>
            `
        })

        var results = [
            ...list, 
            ...storageList, 
            `<button type="button" class="add-current-layer" title="Cache a layer">+</button>`
        ]

        var emptyCount = 5 - results.length % 5 
        
        var arr = [...Array(emptyCount)];

        arr.forEach(it => {
            results.push(`<div class='empty'></div>`)
        })

        return results;

    }

    refresh () {
        this.load();
    }

    '@changeStorage' () {
        this.refresh()
    }

    'click $el .layer-sample-item .add-item' (e) {
        var index = +e.$delegateTarget.attr('data-index')

        var newLayer = this.list[index];

        if (newLayer) {
            this.dispatch('/item/addCache/layer', newLayer );
        }


    }    

    'click $el .layer-cached-item .add-item' (e) {
        var newLayer = this.read('/storage/layers', e.$delegateTarget.attr('data-sample-id'));
        
        if (newLayer) {
            this.dispatch('/item/addCache/layer', newLayer );
        }
    }

    'click $el .layer-cached-item .delete-item' (e) {
        this.dispatch('/storage/remove/layer', e.$delegateTarget.attr('data-sample-id'));
        this.refresh();
    }    

    'click $el .add-current-layer' (e) {
        this.read('/item/current/layer', (layer) => {
            var newLayer = this.read('/collect/layer/one', layer.id)

            this.dispatch('/storage/add/layer', newLayer);
            this.refresh();
        })
        
    }

} 