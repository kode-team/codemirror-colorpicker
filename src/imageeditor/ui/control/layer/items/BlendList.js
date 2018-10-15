
import UIElement from '../../../../../colorpicker/UIElement';

export default class BlendList extends UIElement {

    template () { 
        return `
            <div class='background-blend-list blend-list-tab'>
                <div class="blend-list" ref="$blendList"></div>
            </div>
        `
    }


    'load $blendList' () {
        var list = this.read('/blend/list')

        var item = this.read('/item/current/layer')
        if (!item) { return ''; }

        return  `<div>${list.map((blend) => {

                    var selected = blend == item.style['background-blend-mode'] ? 'selected' : '' 
                    return `
                        <div class='blend-item ${selected}' data-mode="${blend}">
                            <div class="blend-item-view-container">
                                <div class="blend-item-blend-view"  style='${this.read('/blend/toStringWithoutDimension', item, blend)}'></div>
                                <div class="blend-item-text">${blend}</div>
                            </div>
                        </div>` 
                }).join('')}</div>`
    }

    refresh () {
        this.load()
    }

    '@changeEditor' () {
        this.refresh()
    }


    'click.self $blendList .blend-item' (e) {
        var item = this.read('/item/current/layer');

        if (!item) return; 

        item.style['background-blend-mode'] = e.$delegateTarget.attr('data-mode')

        this.dispatch('/item/set', item, true)
        this.refresh();
    }

}