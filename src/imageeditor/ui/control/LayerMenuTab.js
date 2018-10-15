

import BlendList from './layer/items/BlendList'
import MixBlendList from './layer/items/MixBlendList'
import FilterList from './layer/items/FilterList'
import BaseTab from '../BaseTab';
import LayerView from './layer/LayerView';
 
export default class LayerMenuTab extends BaseTab {
 
    components() {
        return { 
            LayerView,
            BlendList, 
            MixBlendList,
            FilterList 
        }
    } 
 
    template () { 

        return `
            <div class="tab layer-menu-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="property">
                        Property
                    </div>
                    <div class="tab-item" data-id="background-blend" title="Background Blend">
                        <div class='blend-preview-item'>
                            <div class="blend-item-view-container">
                                <div class="blend-item-blend-view" ref="$backgroundBlendMode" ></div>
                            </div>
                        </div>
                        Background Blend 
                    </div>
                    <div class="tab-item" data-id="mix-blend" title="Mix Blend">
                        <div class='blend-preview-item'>
                            <div class="blend-item-view-container">
                                <div class="blend-item-blend-view"  ref="$mixBlendMode" ></div>
                            </div>
                        </div>
                        Mix Blend
                    
                    </div>
                    <div class="tab-item" data-id="filter" title="Filter">
                        Filter                    
                    </div>                    
                </div>
                <div class="tab-body" ref="$body">
                    <div class='tab-content selected' data-id='property'>
                        <LayerView></LayerView>
                    </div>
                    <div class="tab-content" data-id="background-blend">
                        <BlendList></BlendList>
                    </div>
                    <div class="tab-content" data-id="mix-blend">
                        <MixBlendList></MixBlendList>
                    </div>                    
                    <div class="tab-content" data-id="filter">
                        <FilterList></FilterList>
                    </div>                                        
                </div>
            </div>        
        `
    }

    refresh () {
        this.read('/item/current/layer', (item) => {
            this.refs.$backgroundBlendMode.el.style = this.read('/blend/toStringWithoutDimension', item, item.style['background-blend-mode'])
            this.refs.$mixBlendMode.el.style = this.read('/blend/toStringWithoutDimension', item, item.style['background-blend-mode'], item.style['mix-blend-mode'])
        })
        
        if (this.read('/item/is/mode', 'page')) {
            this.selectTab('property')
        }
    }

    '@changeEditor' () {
        this.refresh()
    }

}