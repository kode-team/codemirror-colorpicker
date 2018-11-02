import UIElement from "../../../../colorpicker/UIElement";

import items  from './items/index'

export default class PropertyView extends UIElement {

    template () {
        return `
            <div class='property-view inline'>
                <PanelLayout></PanelLayout>            
                <PageName></PageName>
                <PageSize></PageSize>
                <clip></clip>
                <PageExport></PageExport>
                <PageLayout></PageLayout>
            </div>
        ` 
    }

    components () {
        return items 
    }
}