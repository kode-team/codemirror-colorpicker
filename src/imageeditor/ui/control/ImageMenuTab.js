

import BaseTab from '../BaseTab';
import ImageView from './layer/ImageView';
 
export default class ImageMenuTab extends BaseTab {
 
    components() {
        return { 
            ImageView 
        }
    } 
 
    template () { 

        return `
            <div class="tab image-menu-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="property">
                        Property
                    </div>               
                </div>
                <div class="tab-body" ref="$body">
                    <div class='tab-content selected' data-id='property'>
                        <ImageView></ImageView>
                    </div>
                </div>
            </div>        
        `
    }
}