import UIElement from "../../../../colorpicker/UIElement";

import items  from './items/index'

export default class PropertyView extends UIElement {

    template () {
        return `
            <div class='property-view inline'>
                <PageName></PageName>
                <PageSize></PageSize>
                <clip></clip>
                <PageExport></PageExport>
            </div>
        `
    }

    components () {
        return items 
    }
}