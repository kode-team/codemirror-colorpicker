import BaseTab from "../../BaseTab";

import BlendList from './menuItem/BlendList'
import ImageList from './menuItem/ImageList'
import MixBlendList from './menuItem/MixBlendList'

export default class LayerMenuTab extends BaseTab {
 
    components() {
        return { BlendList, ImageList, MixBlendList }
    } 

    template () { 

        return `
            <div class="tab layer-menu-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="image">Image</div>                
                    <div class="tab-item" data-id="background-blend">
                        <div class='blend-preview-item'>
                            <div class="blend-item-view-container">
                                <div class="blend-item-blend-view" ref="$backgroundBlendMode" ></div>
                            </div>
                        </div>
                        Background Blend
                    </div>
                    <div class="tab-item" data-id="mix-blend">
                        <div class='blend-preview-item'>
                            <div class="blend-item-view-container">
                                <div class="blend-item-blend-view"  ref="$mixBlendMode" ></div>
                            </div>
                        </div>
                        Mix Blend
                    
                    </div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="image">
                        <ImageList></ImageList>
                    </div>                
                    <div class="tab-content" data-id="background-blend">
                        <BlendList></BlendList>
                    </div>
                    <div class="tab-content" data-id="mix-blend">
                        <MixBlendList></MixBlendList>
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
        
    }

    '@changeEditor' () {
        this.refresh()
    }

}