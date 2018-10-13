import UIElement from "../../../colorpicker/UIElement";
import PropertyView from "./layer/PropertyView";
import LayerView from "./layer/LayerView";  
import ImageView from "./layer/ImageView";


export default class FeatureControl extends UIElement {

    template () {
        return `
            <div class='feature-control'>
                <div class='feature page-feature selected' data-type='page'>
                    <PropertyView></PropertyView>
                </div>
                <div class='feature layer-feature' data-type='layer'>
                    <LayerView></LayerView>
                </div>              
                <div class='feature image-feature' data-type='image'>
                    <ImageView></ImageView>
                </div>
            </div>
        `
    }

    components () {
        return { PropertyView, LayerView, ImageView } 
    }

    selectFeature () {
        var obj = this.read('/item/current')
        this.$el.$('.feature.selected').removeClass('selected');

        var selectType = 'page'; 
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