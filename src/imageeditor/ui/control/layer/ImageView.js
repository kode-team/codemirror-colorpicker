import UIElement from "../../../../colorpicker/UIElement";

import items  from './items/index'

export default class ImageView extends UIElement {

    template () {
        return `
            <div class='property-view'>
                <ImageTypeSelect></ImageTypeSelect>
                <SampleList></SampleList>
                <ColorSteps></ColorSteps>
                <ColorStepsInfo></ColorStepsInfo>
                <ColorPickerPanel></ColorPickerPanel>

            </div>  
        `
    }

    components () {
        return items 
    }
}