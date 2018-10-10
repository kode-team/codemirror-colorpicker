import UIElement from "../../../../../colorpicker/UIElement";
import GradientSampleList from "../../colorsteps/GradientSampleList";

export default class SampleList extends UIElement {
    template () {
        return `
            <div class='property-item sample-list'>
                <GradientSampleList></GradientSampleList>
            </div>
        `
    }

    components() {
        return { GradientSampleList }
    }

}