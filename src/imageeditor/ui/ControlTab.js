import BaseTab from "./BaseTab";
import ImageControl from './control/ImageControl'
import BlendControl from './control/BlendControl'
export default class ControlTab extends BaseTab {
    template () {
        return `
            <div class="tab control-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="image">Images</div>
                    <div class="tab-item" data-id="blend">Blend Modes</div>
                    <div class="tab-item" data-id="filter">Filters</div>                    
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="image">
                        <ImageControl></ImageControl>
                    </div>
                    
                    <div class="tab-content" data-id="blend">
                        <BlendControl></BlendControl>                        
                    </div>
                    <div class="tab-content" data-id="filter">
                        <FilterControl></FilterControl>                        
                    </div>
                </div>
            </div>
        `
    }

    components () {
        return { ImageControl, BlendControl   }
    }
}