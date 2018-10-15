

import BaseTab from '../BaseTab';
import PropertyView from './layer/PropertyView';
 
export default class PageMenuTab extends BaseTab {
 
    components() {
        return { 
            PropertyView
        }
    } 
 
    template () { 

        return `
            <div class="tab page-menu-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="property">
                        Property
                    </div>                 
                </div>
                <div class="tab-body" ref="$body">
                    <div class='tab-content selected' data-id='property'>
                        <PropertyView></PropertyView>
                    </div>
                </div>
            </div>        
        `
    }
}