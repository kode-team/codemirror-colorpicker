import UIElement from "../../../../colorpicker/UIElement";

import items  from './items/index'

export default class ImageView extends UIElement {

    template () {
        return `
            <div class='property-view'>
                <SampleList></SampleList>                                   
                <ImageTypeSelect></ImageTypeSelect>            
                <ColorPickerPanel></ColorPickerPanel>
                <!--<ColorSteps></ColorSteps>-->
                <ColorStepsInfo></ColorStepsInfo>
                <ImageInfo></ImageInfo>
                <ImageResource></ImageResource>
            </div>  
        `
    }

    components () {
        return items 
    }
}