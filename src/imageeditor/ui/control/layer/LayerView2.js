import UIElement from "../../../../colorpicker/UIElement";

import items  from './items/index'

export default class LayerView2 extends UIElement {

    template () {
        return `
            <div class='property-view accordian'>
                <BlendList></BlendList>
                <MixBlendList></MixBlendList>
                <FilterList></FilterList>
            </div> 
        `
    }

    components () {
        return items 
    }
}