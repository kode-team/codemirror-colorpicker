import UIElement from "../../../../colorpicker/UIElement";

import items  from './items/index'

export default class ImageView extends UIElement {

    template () {
        return `
            <div class='property-view'>
                <!-- <SampleList></SampleList> -->                    
                <ColorPickerPanel></ColorPickerPanel>
                <!--<ColorSampleList></ColorSampleList>-->
                <!-- <ImageTypeSelect></ImageTypeSelect> -->
                <ColorSteps></ColorSteps>
                <ColorStepsInfo></ColorStepsInfo>
            </div>  
        `
    }

    components () {
        return items 
    }
}