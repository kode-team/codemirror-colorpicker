import BaseTab from "../../BaseTab";

import FilterList from './menuItem/FilterList'
import BlendList from './menuItem/BlendList'
import ImageList from './menuItem/ImageList'

export default class LayerMenuTab extends BaseTab {
 
    components() {
        return { FilterList, BlendList, ImageList }
    }

    template () { 
        return `
            <div class="tab layer-menu-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="image">Image</div>                
                    <div class="tab-item" data-id="blend">Blend</div>
                    <div class="tab-item" data-id="filter">Filter</div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="image">
                        <ImageList></ImageList>
                    </div>                
                    <div class="tab-content" data-id="blend">
                        <BlendList></BlendList>
                    </div>
                    <div class="tab-content" data-id="filter">
                        <FilterList></FilterList>
                    </div>                    
                </div>
            </div>        
        `
    }

}