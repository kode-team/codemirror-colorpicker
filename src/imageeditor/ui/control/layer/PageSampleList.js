import UIElement from "../../../../colorpicker/UIElement";
import { parseParamNumber } from "../../../../util/filter/functions";


export default class PageSampleList extends UIElement {
 
    initialize () {
        super.initialize();

        // this.list = this.read('/page/list/sample', this.props.type); 
        this.list = [] 
        this.dispatch('/storage/load/page')

    }

    template () {

        return `
        <div class="page-sample-list">
            <div class='cached-list' ref="$cachedList"></div>

        </div>
        `  
    }

    'load $cachedList' () {
        
        var list = this.list.map( (page, index) => {
            var data = this.read('/page/cache/toString', page)

            var rateX = 160 / parseParamNumber(data.obj.width);
            var rateY = 120 / parseParamNumber(data.obj.height);

            var transform = `transform: scale(${rateX} ${rateY})`

            return `
            <div class='page-sample-item'  data-sample-id="${page.id}">
                <div class="page-view" style="${data.css}; ${transform}">
                ${page.layers.map(layer => {
                    var data = this.read('/layer/cache/toString', layer)
                    return `
                        <div class="layer-view" style="${data.css}"></div>
                    `
                }).join('')}
                </div>

                <div class='item-tools'>
                    <button type="button" class='add-item'  data-index="${index}" title="Addd">&times;</button>
                </div>          
            </div>`
        })

        var storageList = this.read('/storage/pages').map( page => {
            var data = this.read('/page/cache/toString', page.page)
            var rateX = 160 / parseParamNumber(data.obj.width || 400);
            var rateY = 160 / parseParamNumber(data.obj.height || 300);

            var minRate = Math.min(rateY, rateX);

            var transform = `left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%) scale(${minRate})`

            return `
                <div class='page-cached-item' data-sample-id="${page.id}">
                    <div class="page-view" style="${data.css}; ${transform}">
                    ${page.layers.map(layer => {
                        var data = this.read('/layer/cache/toString', layer)
                        return `
                            <div class="layer-view" style="${data.css}"></div>
                        `
                    }).join('')}
                    </div>
                    <div class='item-tools'>
                        <button type="button" class='add-item'  data-sample-id="${page.id}" title="Add">&times;</button>                
                        <button type="button" class='delete-item'  data-sample-id="${page.id}" title="Delete">&times;</button>
                    </div>          
                </div>
            `
        })

        var results = [
            ...list, 
            ...storageList, 
            `<button type="button" class="add-current-page" title="Cache a page">+</button>`
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

    'click $el .page-sample-item .add-item' (e) {
        var index = +e.$delegateTarget.attr('data-index')

        var newPage = this.list[index];

        if (newPage) {
            this.dispatch('/item/addCache/page', newPage );
        }


    }    

    'click $el .page-cached-item .add-item' (e) {
        var newPage = this.read('/storage/pages', e.$delegateTarget.attr('data-sample-id'));
        if (newPage) {
            this.dispatch('/item/addCache/page', newPage );
        }
    }

    'click $el .page-cached-item .delete-item' (e) {
        this.dispatch('/storage/remove/page', e.$delegateTarget.attr('data-sample-id'));
        this.refresh();
    }    

    'click $el .add-current-page' (e) {
        this.read('/item/current/page', (page) => {
            var newPage = this.read('/collect/page/one', page.id)

            this.dispatch('/storage/add/page', newPage);
            this.refresh();
        })
        
    }

} 