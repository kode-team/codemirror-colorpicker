import UIElement from "../../../colorpicker/UIElement";
import items from './layer/items/index';
import GradientAngle from "../view/GradientAngle";
import GradientPosition from "../view/GradientPosition";
import PredefinedLinearGradientAngle from "../view/PredefinedLinearGradientAngle";
import PredefinedRadialGradientPosition from "../view/PredefinedRadialGradientPosition";
import PredefinedRadialGradientAngle from "../view/PredefinedRadialGradientAngle";
import ImageList from "../layer/ImageList";


export default class SubFeatureControl extends UIElement {

    template () {
        return `
            <div class='sub-feature-control'>         
                <div class='feature'>
                    <div class="property-view image-list" ref="$imageList">
                        <ImageList></ImageList>
                    </div>
                    <div class="property-view" ref="$background">
                        <BackgroundSize></BackgroundSize>
                    </div>
                    <div class="property-view" ref="$linear">
                        <PredefinedLinearGradientAngle></PredefinedLinearGradientAngle>
                        <GradientAngle></GradientAngle>                            
                    </div>
                    <div class="property-view" ref="$radial">
                        <PredefinedRadialGradientAngle></PredefinedRadialGradientAngle>                    
                        <PredefinedRadialGradientPosition></PredefinedRadialGradientPosition>
                        <GradientPosition></GradientPosition>
                    </div>
                </div>
            </div>
        `
    }

    components () {
        return { 
            ImageList,
            PredefinedRadialGradientAngle,
            GradientAngle, 
            GradientPosition, 
            PredefinedLinearGradientAngle, 
            PredefinedRadialGradientPosition, 
            ...items
        } 
    }


    refresh () {
        this.$el.toggle(this.isShow())
        this.refs.$background.toggleClass('hide', !this.isBackgroundShow())
        this.refs.$imageList.toggleClass('hide', !this.isImageListShow())
        this.refs.$linear.toggleClass('hide', !this.isLinearShow())
        this.refs.$radial.toggleClass('hide', !this.isRadialShow())
    }


    isShow () {
        //if (!this.read('/item/is/mode', 'image')) return false;         
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

    isBackgroundShow () {
        if (!this.read('/item/is/mode', 'image')) return false; 

        var item = this.read('/item/current/image')
        if (!item) return false; 

        return this.read('/tool/get', 'guide.angle')
    }    

    isImageListShow () {
        var layer = this.read('/item/current/layer');

        if (!layer) return false; 

        var count = this.read('/item/count/children', layer.id);

        if (!count) return false; 

        return true; 
    }

    '@changeEditor' () {
        this.refresh();
    }
}