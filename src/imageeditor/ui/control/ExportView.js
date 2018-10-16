import UIElement from "../../../colorpicker/UIElement";

export default class ExportView extends UIElement {

    template () {
        return `
            <div class='export-view'>
                <div class="color-view">
                    <div class="close" ref="$close">&times;</div>                
                    <textarea ref="$code"></textarea>
                    <div class='preview' ref="$preview"></div>
                </div>
            </div>
        `
    }
 

    makePageCSS (page) {
        var obj = Object.assign({
            position: 'relative',
            overflow: page.clip ? 'hidden' : ''
        }, page.style || {}); 

        var results = Object.keys(obj).filter(key => {

            if (key == 'transform' && obj[key] == 'none') return false; 
            if (key == 'x') return false; 
            if (key == 'y') return false; 
 
            return obj[key];
        }).map(key => {
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

        var html = `<div style="${pageStyle}">\n${this.read('/item/map/children', page.id, (item) => {
                return `<div style='${this.read('/layer/toExport', item, true)}'></div>`
            }).join('\n')}\n</div>`

        this.refs.$code.val(html);

        this.refs.$preview.html(html);
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