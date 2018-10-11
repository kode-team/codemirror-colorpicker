import UIElement from "../../../colorpicker/UIElement";
import ImageSubView from "./layer/ImageSubView";


export default class SubFeatureControl extends UIElement {

    template () {
        return `
            <div class='sub-feature-control'>
                <div class='feature page-feature selected' data-type='page'>
                    
                </div>
                <div class='feature layer-feature' data-type='layer'>
                    
                </div>              
                <div class='feature image-feature' data-type='image'>
                    <ImageSubView></ImageSubView>
                </div>
            </div>
        `
    }

    components () {
        return { ImageSubView } 
    }

    selectFeature () {
        var obj = this.read('/item/current')
        this.$el.$('.feature.selected').removeClass('selected');

        var selectType = ''; 
        if (obj && obj.itemType == 'page') {
            selectType = 'page';
        } else if (obj)  {
            if (obj.itemType == 'layer') {
                selectType = 'layer';
            } else if (obj.itemType == 'image') {
                var layer = this.read('/item/current/layer');

                if (layer.selectTime > obj.selectTime) {
                    selectType = 'layer';
                } else {
                    selectType = 'image';
                }
                
            }
        }

        this.$el.$(`.feature[data-type=${selectType}]`).addClass('selected')

    }

    '@changeEditor' () {
        this.selectFeature()
    }
}