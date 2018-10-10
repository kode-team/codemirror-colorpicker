import UIElement from "../../../../../colorpicker/UIElement";
import GradientInfo from "../../colorsteps/GradientInfo";

export default class ColorStepsInfo extends UIElement {
    template () {
        return `
            <div class='property-item gradient-steps-info'>
                <GradientInfo></GradientInfo>
            </div>
        ` 
    }

    components() {
        return { GradientInfo }
    }
 
    refresh () {
        this.$el.toggle(this.isShow())
    }

    '@changeEditor' () {
        this.refresh()
    }

    isShow () {
        var item = this.read('/item/current/image')

        if (!item) return false; 

        return this.read('/image/type/isGradient', item.type)
    }
}