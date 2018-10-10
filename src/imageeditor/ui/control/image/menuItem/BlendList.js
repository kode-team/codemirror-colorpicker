
import BaseTab from "../../../BaseTab";

export default class BlendList extends BaseTab {

    template () { 
        return `
            <div class="tab inner blend-list-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="background">Background Blend</div>
                    <div class="tab-item" data-id="mix">Mix Blend</div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="background">
                        <div class="blend-list" ref="$blendList"></div>
                    </div>
                    <div class="tab-content" data-id="mix">
                        <div class="blend-list" ref="$mixBlendList"></div>
                    </div>
                </div>
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

    'load $mixBlendList' () {
        var list = this.read('/blend/list')
        var item = this.read('/item/current/layer')
        if (!item) { return ''; }

        return  `<div>${list.map((blend) => {

                    var selected = blend == item.style['mix-blend-mode'] ? 'selected' : '' 
                    return `
                        <div class='blend-item ${selected}' data-mode="${blend}">
                            <div class="blend-item-view-container">
                                <div class="blend-item-blend-view"  style='${this.read('/blend/toStringWithoutDimension', item, '', blend)}'></div>
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

    'click.self $mixBlendList .blend-item' (e) {
        var item = this.read('/item/current/layer');

        if (!item) return; 
        
        item.style['mix-blend-mode'] = e.$delegateTarget.attr('data-mode')

        this.dispatch('/item/set', item, true)


        this.refresh();
    } 

}