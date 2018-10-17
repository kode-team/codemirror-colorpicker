import UIElement from "../../../../../colorpicker/UIElement";
import GradientSampleList from "../../colorsteps/GradientSampleList";

export default class ColorSampleList extends UIElement {
    template () {
        return `
            <div class='property-item sample-list show'>
                <div class='items'>            
                    <GradientSampleList type="color"></GradientSampleList>
                </div>
            </div>
        `
    }

    components() {
        return { GradientSampleList }
    }

}