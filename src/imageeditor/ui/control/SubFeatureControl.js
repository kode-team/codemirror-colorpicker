import UIElement from "../../../colorpicker/UIElement";
import ImageSubView from "./layer/ImageSubView";


export default class SubFeatureControl extends UIElement {

    template () {
        return `
            <div class='sub-feature-control'>         
                <div class='feature selected image-feature' data-type='image'>
                    <ImageSubView></ImageSubView>
                </div>
            </div>
        `
    }

    components () {
        return { ImageSubView } 
    }

    refresh () {
        // this.$el.toggleClass('show', this.read('/item/is/mode', 'image'));
    }

    '@changeEditor' () {
        // this.refresh();
    }
}