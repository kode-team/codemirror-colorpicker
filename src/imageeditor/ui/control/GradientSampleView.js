import UIElement from "../../../colorpicker/UIElement";
import GradientSampleList from "./colorsteps/GradientSampleList";



export default class GradientSampleView extends UIElement {

    components () {
        return {
            GradientSampleList
        }
    }

    template () {
        return `
            <div class='gradient-sample-view'>
                <div class="close">&times;</div>
                <GradientSampleList></GradientSampleList>
            </div>
        `
    }

    'click $el .close' (e) {
        this.$el.toggle();
    }

    '@toggleGradientSampleView' () {
        this.$el.toggle();
    }


}