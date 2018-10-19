import UIElement from '../../../colorpicker/UIElement';

export default class PageList extends UIElement {

    template () { 
        return `
            <div class='pages'>         
                <div class="page-list" ref="$pageList">
                
                </div>
                <div class='project-tools'>
                    <button type="button" ref="$saveButton">Save</button>
                </div>
            </div>
        `
    }

    makeItemNode (node, index) {
        var item = this.read('/item/get', node.id);

        var page = this.read('/item/current/page')

        var selectedId = '' 

        if (page) selectedId = page.id; 

        if (item.itemType == 'page') {
            return this.makeItemNodePage(item, index, selectedId);
        }

    }

    makeItemNodePage (item, index, selectedId) {
        var selected = item.id == selectedId ? 'selected' : ''; 
        return `
            <div class='tree-item ${selected}' id="${item.id}" type='page'>
                <div class="item-title">
                    ${item.name || `Project ${index}`}
                </div>   
            </div>
            `
    }

    'load $pageList' () {
        var str = this.read('/item/map/page', (item, index) => {
            return this.makeItemNode(item, index); 
        }).join('');

        str += `<button type="button" class='add-page'>+ Project</button>`

        return str; 
    }

    refresh () { 
        this.load()
    }

    '@changeEditor' () {
        this.refresh()
    }

    'click $pageList .add-page' (e) {
        this.dispatch('/item/add/page', true);
        this.refresh();
    }

    'click.self $pageList .tree-item' (e) { 

        this.dispatch('/item/select', e.$delegateTarget.attr('id'));
        this.refresh();

        if (e.$delegateTarget.attr('type') == 'page') {
            this.emit('selectPage')
        } 
        
    }

    'click $saveButton' (e) {
        this.run('/storage/save');
    }

}