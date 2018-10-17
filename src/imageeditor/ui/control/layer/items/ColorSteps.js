import GradientSteps from "../../colorsteps/GradientSteps";
import BasePropertyItem from "./BasePropertyItem";

export default class ColorSteps extends BasePropertyItem {
    template () {
        return `
            <div class='property-item gradient-steps show'>
                <div class='title'>Color Steps</div>
                <div class='items'>            
                    <GradientSteps></GradientSteps>
                </div>
            </div>
        `
    }

    components() {
        return { GradientSteps }
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