import UIElement from "../../../colorpicker/UIElement";
import LayerSampleList from "./layer/LayerSampleList";


export default class LayerSampleView extends UIElement {

    components () {
        return {
            LayerSampleList
        }
    }

    template () {
        return `
            <div class='layer-sample-view'>
                <div class="close">&times;</div>
                <LayerSampleList></LayerSampleList>
            </div>
        `
    }
    
    'click $el .close' (e) {
        this.$el.toggle();
    }

    '@toggleLayerSampleView' () {
        this.$el.toggle();
    }


}