import UIElement from "../../../../colorpicker/UIElement";

import items  from './items/index'

export default class PropertyView extends UIElement {

    template () {
        return `
            <div class='property-view'>
                <name></name>
                <size></size>
                <clip></clip>
            </div>
        `
    }

    components () {
        return items 
    }
}