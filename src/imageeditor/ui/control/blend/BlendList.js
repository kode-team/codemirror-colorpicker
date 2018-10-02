import UIElement from "../../../../colorpicker/UIElement";
 
export default class BlendList extends UIElement {

    template () { 
        return `
            <div class='blend-list-container'>
                <div class='layout-flow padding-0'>
                    <div class='blend-row'>
                        <div class="blend-mode-title">Background</div>
                        <div class="blend-list" ref="$blendList"></div>
                    </div>
                    <div class='blend-row'>
                        <div class="blend-mode-title">Mix</div>
                        <div class="blend-list" ref="$mixBlendList"></div>
                    </div>
                </div>
            </div>
        `
    }

    'load $blendList' () {
        var list = this.read('/blend/list')
        var layer = this.read('/layer/get')
        var backgroundBlendMode = this.read('/layer/get', 'backgroundBlendMode')
        return  `<div>${list.map((blend) => {

                    var selected = blend == backgroundBlendMode ? 'selected' : '' 
                    return `
                        <div class='blend-item ${selected}' data-mode="${blend}">
                            <div class="blend-item-view-container">
                                <div class="blend-item-blend-view"  style='${this.read('/blend/toString', layer, blend)}'></div>
                                <div class="blend-item-text">${blend}</div>
                            </div>
                        </div>`
                }).join('')}</div>`
    }

    'load $mixBlendList' () {
        var list = this.read('/blend/list')
        var layer = this.read('/layer/get')
        var mixBlendMode = this.read('/layer/get', 'mixBlendMode')
        return  `<div>${list.map((blend) => {

                    var selected = blend == mixBlendMode ? 'selected' : '' 
                    return `
                        <div class='blend-item ${selected}' data-mode="${blend}">
                            <div class="blend-item-view-container">
                                <div class="blend-item-blend-view"  style='${this.read('/blend/toString', layer, '', blend)}'></div>
                                <div class="blend-item-text">${blend}</div>
                            </div>
                        </div>`
                }).join('')}</div>`
    }

    refresh () {
        this.load()
    }

    '@changeLayer' () {
        this.refresh()
    }

    '@initLayer' () { this.refresh() }    



    'click.self $blendList .blend-item' (e) {
        this.dispatch('/blend/select', e.$delegateTarget.attr('data-mode'));

        this.refresh();
    }

    'click.self $mixBlendList .blend-item' (e) {
        this.dispatch('/blend/select/mix', e.$delegateTarget.attr('data-mode'));

        this.refresh();
    } 

}