import UIElement from "../../../colorpicker/UIElement";
import ImageSubView from "./layer/ImageSubView";
import items from './layer/items/index';


export default class SubFeatureControl extends UIElement {

    template () {
        return `
            <div class='sub-feature-control'>         
                <div class='feature'>
                    <div class="property-view">
                        <BackgroundSize></BackgroundSize>
                    </div>
                    <div class="property-view" ref="$linear">
                        <PredefinedLinearGradientAngle></PredefinedLinearGradientAngle>
                        <GradientAngle></GradientAngle>                            
                    </div>
                    <div class="property-view" ref="$radial">
                        <PredefinedRadialGradientPosition></PredefinedRadialGradientPosition>
                        <GradientPosition></GradientPosition>

                    </div>
                </div>
            </div>
        `
    }

    components () {
        return { ImageSubView, ...items } 
    }


    refresh () {
        this.$el.toggle(this.isShow())
        this.refs.$linear.toggleClass('hide', !this.isLinearShow())
        this.refs.$radial.toggleClass('hide', !this.isRadialShow())
    }


    isShow () {
        if (!this.read('/item/is/mode', 'image')) return false;         
        var image = this.read('/item/current/image')

        if (!image) { return false; }

        return true;
    }

    isLinearShow () {
        if (!this.read('/item/is/mode', 'image')) return false; 

        var item = this.read('/item/current/image')

        if (!item) return false; 

        if (!this.read('/image/type/isLinear', item.type)) {
            return false; 
        }

        return this.read('/tool/get', 'guide.angle')
    }

    isRadialShow () {
        if (!this.read('/item/is/mode', 'image')) return false; 

        var item = this.read('/item/current/image')
        if (!item) return false; 

        if (!this.read('/image/type/isRadial', item.type)) {
            return false; 
        }

        return this.read('/tool/get', 'guide.angle')
    }

    '@changeEditor' () {
        this.refresh();
    }
}