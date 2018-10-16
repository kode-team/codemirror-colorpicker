import UIElement from "../../../colorpicker/UIElement";

export default class ExportView extends UIElement {

    template () {
        return `
            <div class='export-view'>
                <div class="color-view">
                    <div class="close" ref="$close">&times;</div>                
                    <textarea ref="$code"></textarea>
                </div>
            </div>
        `
    }


    makePageCSS (page) {
        var obj = Object.assign({
            overflow: page.clip ? 'hidden' : 'inherit'
        }, page.style || {}); 

        var results = Object.keys(obj).map(key => {
            return `${key}: ${obj[key]}`
        })

        return results.join(';'); 
    }

    loadCode () {
        var page = this.read('/item/current/page')

        if (!page) {
            return ''; 
        }

        var pageStyle = this.makePageCSS(page)

        var html = `<div class='page' style="${pageStyle}">\n${this.read('/item/map/children', page.id, (item) => {
                return `<div class='layer' item-id="${item.id}" style='${this.read('/layer/toString', item, true)}'></div>`
            }).join('\n')}\n</div>`

        this.refs.$code.val(html);
    }

    refresh () {
        this.loadCode();
    }

    'click $close' (e) {
        this.$el.hide();
    }

    '@toggleExport' () {
        this.$el.toggle();
    }

    '@showExport' () {
        this.refresh();        
        this.$el.show();
    }

    '@hideExport' () {
        this.$el.hide();
    }    
}