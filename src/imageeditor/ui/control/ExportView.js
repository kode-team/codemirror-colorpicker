import UIElement from "../../../colorpicker/UIElement";

export default class ExportView extends UIElement {

    template () {
        return `
            <div class='export-view'>
                <div class="color-view">
                    <div class="close" ref="$close">&times;</div>        
                    <div class="codeview-container">
                        <div class="title">Code
                            <div class="tools" ref="$title">
                                <div class="tool-item selected" data-type="html" ref="$htmlTitle">HTML</div>
                                <div class="tool-item" data-type="css" ref="$cssTitle">CSS</div>
                            </div>
                        </div>
                        <div class="codeview">
                            <div class="content-item selected" data-type="html" ref="$htmlContent">
                                <textarea ref="$html"></textarea>
                            </div>
                            <div class="content-item" data-type="css" ref="$cssContent">
                                <textarea ref="$css"></textarea>
                            </div>
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
        this.cmHtml = CodeMirror.fromTextArea(this.refs.$html.el, {
            lineNumbers: true, 
            readOnly: true,
            lineWrapping: true,
            mode : "text/html"
        });

        this.cmCss = CodeMirror.fromTextArea(this.refs.$css.el, {
            lineNumbers: true, 
            readOnly: true,
            lineWrapping: true,
            mode : "text/css"
        });        
    }
 

    makePageCSS (page) {
        var obj = Object.assign({
            position: 'relative',
            overflow: page.clip ? 'hidden' : ''
        }, page.style || {}); 


        return this.read('/css/toString', obj);
    }

    getClassName (className) {
        return (className || '').split(' ').map(it => '.' + it).join('')
    }

    getPageStyle (page) {
        var pageStyle = this.makePageCSS(page).split(';').map(it => {
            return `\t` + it + ';';
        }).join('\n')

        return pageStyle;
    }

    getPageHtml (page) {
        var html = `<div id="page-1">\n${this.read('/item/map/children', page.id, (item, index) => {

            var idString = item.idString || 'layer-' + (index+1)
            var className = item.className

            var selector = [] 

            if (className) {
                selector.push(`class="${className}"`)
            }

            if (!selector.length && item.idString) {
                selector.push(`id="${idString}"`);
            } else {
                selector.push(`id="layer-${index+1}"`);
            }


            var clipPath = this.read('/layer/toStringClipPath', item);

            if (clipPath) {
                clipPath = `\t\t\n${clipPath}`
            }

            return `\t<div ${selector.join(' ')}>${clipPath}</div>`
        }).join('\n')}
</div>`

        return html;
    }

    getLayerStyle (page) {
        var layerStyle = this.read('/item/map/children', page.id, (item, index) => {


            var idString = item.idString || 'layer-' + (index+1)
            var className = item.className

            var selector = [] 

            if (className) {
                selector = this.getClassName(className);
            } else  {
                selector = `#${idString}`
            }

            var css = this.read('/layer/toExport', item, true).split(';').map(it => {
                return '\t' + it + ';';
            }).join('\n');

            return `${selector} {\n${css}\n}`;
        }).join('\n')


        return layerStyle;
    }

    generateCode () {
        var page = this.read('/item/current/page')

        if (!page) {
            return '';  
        }

        var pageStyle = this.getPageStyle(page);

        var html = this.getPageHtml(page);

        var layerStyle = this.getLayerStyle(page);

        var styleText = `
#page-1 { 
${pageStyle}
}
${layerStyle}

`
        var style = `<style type="text/css">${styleText}</style>\n`
        return {
            html: style + html,
            css: styleText
        } 
    }

    loadCode () {
        var page = this.read('/item/current/page')

        if (!page) {
            return '';  
        }

        var generateCode = this.generateCode()

        if (this.cmHtml) {
            this.cmHtml.setValue(generateCode.html);
            this.cmHtml.refresh();
        }

        if (this.cmCss) {
            this.cmCss.setValue(generateCode.css);
            this.cmCss.refresh();
        }        

        this.refs.$preview.html(generateCode.html);
    }

    refresh () {
        this.loadCode();
    }

    'click $close' (e) {
        this.$el.hide();
    }

    'click $title .tool-item' (e) {
        var type = e.$delegateTarget.attr('data-type');

        Object.keys(this.refs).filter(it => it.includes('Title')).forEach(key => {
            var obj = this.refs[key];
            obj.toggleClass('selected', `$${type}Title` == key);
        })

        Object.keys(this.refs).filter(it => it.includes('Content')).forEach(key => {
            var obj = this.refs[key];
            obj.toggleClass('selected', `$${type}Content` == key);

            if (this.cmHtml) this.cmHtml.refresh();
            if (this.cmHtml) this.cmCss.refresh();
        })        

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