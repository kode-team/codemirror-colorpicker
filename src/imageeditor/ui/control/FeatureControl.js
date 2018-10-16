import UIElement from "../../../colorpicker/UIElement";
import LayerMenuTab from "./LayerMenuTab";
import ImageMenuTab from "./ImageMenuTab";

export default class FeatureControl extends UIElement {

    template () {
        return `
            <div class='feature-control'>
                <div class='feature layer-feature' data-type='layer'>
                    <LayerMenuTab></LayerMenuTab>
                </div>              
                <div class='feature image-feature' data-type='image'>
                    <ImageMenuTab></ImageMenuTab>
                </div>
            </div>
        `
    }

    components () {
        return { 
            LayerMenuTab,
            ImageMenuTab 
        } 
    }

    selectFeature () {
        var obj = this.read('/item/current')
        var selectedFeature = this.$el.$('.feature.selected');
        
        if (selectedFeature) selectedFeature.removeClass('selected');

        var selectType = 'layer'; 

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

        this.$el.$(`.feature[data-type=${selectType}]`).addClass('selected')

    }

    '@changeEditor' () {
        this.selectFeature()
    }
}