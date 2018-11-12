import UIElement from "../../../colorpicker/UIElement";
import GradientSteps from "./colorsteps/GradientSteps";

export default class VerticalColorStep extends UIElement {

    components () {
        return {
            GradientSteps
        }
    }

    template () {
        return `
            <div class='vertical-colorstep'>
                <GradientSteps></GradientSteps>
            </div>
        `
    }

    refresh () {
        this.$el.toggle(this.isShow())
        this.$el.px('width', this.$store.step.width);
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