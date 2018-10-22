import BasePropertyItem from "./BasePropertyItem";

export default class FilterList extends BasePropertyItem {

    template () { 
        return `
            <div class='property-item filters'>
                <div class='title' ref="$title">Filter - <span class='description' ref="$desc"></span></div>
                <div class='items'>                    
                    <div class="filter-list" ref="$filterList">
                        
                    </div>
                </div>
            </div>
        `
    }

    makeInputItem (id, viewObject, dataObject) {

        var value = dataObject.value; 

        if (typeof value == 'undefined') {
            value = viewObject.defaultValue
        }        

        if (viewObject.type == 'range') {
            return `
                <div>
                    <span class='title'>
                        <label><input type="checkbox" ${dataObject.checked ? `checked="checked"` : ''} data-filter-id="${id}" /> ${viewObject.title} </label>
                    </span>
                    <span class='range'><input type="range" min="${viewObject.min}" max="${viewObject.max}" step="${viewObject.step}" value="${value}" data-filter-id="${id}" /></span>
                    <span class='input'><input type="number" min="${viewObject.min}" max="${viewObject.max}" step="${viewObject.step}" value="${value}" data-filter-id="${id}"/></span>
                    <span class='unit'>${viewObject.unit}</span>
                </div>
            `
        }

        return `<div>

        </div>`
    }

    'load $filterList' () {

        var layer = this.read('/item/current/layer');

        if (!layer) return '' 

        var defaultFilterList = this.read('/layer/filter/list') 
        var filters = this.getFilterList();


        return Object.keys(defaultFilterList).map(id => {
            var viewObject = defaultFilterList[id];
            var dataObject = filters[id] || {};
 
            return `
                <div class='filter-item' data-filter="${id}">
                    <div class="filter-item-input">
                        ${this.makeInputItem(id, viewObject, dataObject)}
                    </div>
                </div>`
        })
    }

    refreshFilter (id) {
        this.read('/item/current/layer', (layer) => {
            var filter = layer.filters[id]

            if (filter) {
                var $dom = this.$el.$(`[data-filter=${id}]`);

                $dom.$(`.input [data-filter-id=${id}]`).val(filter.value)
                $dom.$(`.range [data-filter-id=${id}]`).val(filter.value)
            }
        })
        this.refreshFilterList()        
    }

    '@changeEditor' () {
        this.refresh()
    }

    refresh () {
        this.load()
        this.refreshFilterList()
    }

    refreshFilterList() {
        this.read('/item/current/layer', (layer) => {
            this.refs.$desc.html(this.read('/layer/make/filter', layer.filters)); 
        })        
    }

    getFilterList () {

        var layer = this.read('/item/current/layer');

        if (!layer) return []

        return layer.filters || []
    }

    'click $filterList input[type=checkbox]' (e) {
        var id = e.$delegateTarget.attr('data-filter-id');

        this.read('/item/current/layer', (layer) => {
            if (!layer.filters[id]) {
                layer.filters[id] = { checked: false}
            }

            layer.filters[id].checked = e.$delegateTarget.el.checked;

            this.dispatch('/item/set', layer);
            this.refreshFilterList()
        })
    }

    'change:input $filterList input[type=range]' (e) {
        var id = e.$delegateTarget.attr('data-filter-id');

        this.read('/item/current/layer', (layer) => {

            if (!layer.filters) {
                layer.filters = {}
            }

            if (!layer.filters[id]) {
                layer.filters[id] = {}
            }

            layer.filters[id].value = e.$delegateTarget.val();

            this.dispatch('/item/set', layer);
            this.refreshFilter(id);
        })
    }

    'input $filterList input[type=number]' (e) {
        var id = e.$delegateTarget.attr('data-filter-id');

        this.read('/item/current/layer', (layer) => {
            layer.filters[id].value = e.$delegateTarget.val();

            if (!layer.filters) {
                layer.filters = {}
            }

            if (!layer.filters[id]) {
                layer.filters[id] = {}
            }

            this.dispatch('/item/set', layer);
            this.refreshFilter(id);
        })
    }    

}