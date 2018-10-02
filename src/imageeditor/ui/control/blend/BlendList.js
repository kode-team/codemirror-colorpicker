import BaseTab from "../../BaseTab";
import FilterList from "./FilterList";

export default class BlendList extends BaseTab {

    components() {
        return { FilterList }
    }

    template () { 
        return `
            <div class="tab blend-list-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="background">Background Blend</div>
                    <div class="tab-item" data-id="mix">Mix Blend</div>
                    <div class="tab-item" data-id="filter">Filter</div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="background">
                        <div class="blend-list" ref="$blendList"></div>
                    </div>
                    <div class="tab-content" data-id="mix">
                        <div class="blend-list" ref="$mixBlendList"></div>
                    </div>
                    <div class="tab-content" data-id="filter">
                        <FilterList></FilterList>
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