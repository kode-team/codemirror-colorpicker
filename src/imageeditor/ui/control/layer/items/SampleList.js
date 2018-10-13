import UIElement from "../../../../../colorpicker/UIElement";
import GradientSampleList from "../../colorsteps/GradientSampleList";

export default class SampleList extends UIElement {
    template () {
        return `
            <div class='property-item sample-list'>
                <div class='title'>Select Images</div>
                <div class='items'>            
                    <GradientSampleList></GradientSampleList>
                </div>
            </div>
        `
    }

    components() {
        return { GradientSampleList }
    }

}