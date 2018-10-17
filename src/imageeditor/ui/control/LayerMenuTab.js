import BaseTab from '../BaseTab';
import LayerView from './layer/LayerView';
import LayerView2 from './layer/LayerView2';
 
export default class LayerMenuTab extends BaseTab {
 
    components() {
        return { 
            LayerView,
            LayerView2
        }
    } 
 
    template () { 

        return `
            <div class="tab layer-menu-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="property">
                        Property
                    </div>
                    <div class="tab-item" data-id="background-blend" title="Blend & Filter">
                        Blend & Filter 
                    </div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class='tab-content selected' data-id='property'>
                        <LayerView></LayerView>
                    </div>
                    <div class="tab-content" data-id="background-blend">
                        <LayerView2></LayerView2>
                    </div>
                </div>
            </div>        
        `
    }

    refresh () {        
        if (this.read('/item/is/mode', 'page')) {
            this.selectTab('property')
        }
    }

    '@changeEditor' () {
        this.refresh()
    }

}