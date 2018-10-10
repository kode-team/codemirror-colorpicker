import UIElement from '../../../colorpicker/UIElement';

export default class PageList extends UIElement {

    template () { 
        return `
            <div class='pages'>         
                <div class='title'> 
                    <h1>Pages</h1>
                    <div class="tools">
                        <button type="button" class='add-page' ref="$addPage">+</button>
                    </div>
                </div> 
                <div class="page-list" ref="$pageList">
                
                </div>
            </div>
        `
    }

    makeItemNode (node) {
        var item = this.read('/item/get', node.id);

        var page = this.read('/item/current/page')

        var selectedId = '' 

        if (page) selectedId = page.id; 

        if (item.itemType == 'page') {
            return this.makeItemNodePage(item, selectedId);
        }

    }

    makeItemNodePage (item, selectedId) {
        var selected = item.id == selectedId ? 'selected' : ''; 
        return `
            <div class='tree-item ${selected}' id="${item.id}" type='page'>
                <div class="item-title">
                    ${item.name || `Page `}
                </div>   
            </div>
            `
    }

    'load $pageList' () {
        return this.read('/item/map/page', (item, index) => {
            return this.makeItemNode(item); 
        });
    }

    refresh () {
        this.load()
    }

    '@changeEditor' () {
        this.refresh()
    }

    'click $addPage' (e) {
        this.dispatch('/item/add/page', true);
        this.refresh();
    }

    'click.self $pageList .tree-item' (e) { 

        this.dispatch('/item/select', e.$delegateTarget.attr('id'));
        this.refresh();

        if (e.$delegateTarget.attr('type') == 'page') {
            this.emit('@selectPage')
        } 
        
    }

}