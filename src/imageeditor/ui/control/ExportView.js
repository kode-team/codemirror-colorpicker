import UIElement from "../../../colorpicker/UIElement";

export default class ExportView extends UIElement {

    template () {
        return `
            <div class='export-view'>
                <div class="color-view">
                    <div class="close" ref="$close">&times;</div>        
                    <div class="codeview-container">

                        <div class="title">Code</div>
                        <div class="codeview">
                            <textarea ref="$code"></textarea>
                        </div>
                    </div>
                    <div class="preview-container">
                        <div class="title">Preview</div>
                        <div class='preview' ref="$preview"></div>
                    </div>
                </div>
            </div>
        `
    }

    afterRender () {
        this.cm = CodeMirror.fromTextArea(this.refs.$code.el, {
            lineNumbers: true, 
            readOnly: true,
            lineWrapping: true,
            mode : "text/html"
        });
    }
 

    makePageCSS (page) {
        var obj = Object.assign({
            position: 'relative',
            overflow: page.clip ? 'hidden' : ''
        }, page.style || {}); 


        return this.read('/css/toString', obj);
    }

    loadCode () {
        var page = this.read('/item/current/page')

        if (!page) {
            return ''; 
        }

        var pageStyle = this.makePageCSS(page)

        var html = `<div id="page-1" style="${pageStyle}">\n${this.read('/item/map/children', page.id, (item, index) => {
                return `\t<div id="layer-${index+1}" style="${this.read('/layer/toExport', item, true)}"></div>`
            }).join('\n')}\n</div>`


        if (this.cm) {
            this.cm.setValue(html);
            this.cm.refresh();
        }

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
        this.$el.show();
        this.refresh();                
    }

    '@hideExport' () {
        this.$el.hide();
    }    
}