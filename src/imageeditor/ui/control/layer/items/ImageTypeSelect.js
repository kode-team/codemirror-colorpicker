import PredefinedRadialGradientAngle from '../../../view/PredefinedRadialGradientAngle'
import BasePropertyItem from './BasePropertyItem';

export default class ImageTypeSelect extends BasePropertyItem {

    components () {
        return { PredefinedRadialGradientAngle }
    } 

    template () {
        return `
        <div class='property-item gradient-tools show'>
            <div class='title' ref="$title">Change Image Types</div>
            <div class='items' ref="$items">        
                <div class='gradient-type' ref="$gradientType">
                    <div ref="$static" class="gradient-item static" data-type="static" title="Static Color"></div>
                    <div ref="$linear" class="gradient-item linear" data-type="linear" title="Linear Gradient"></div>
                    <div ref="$radial" class="gradient-item radial" data-type="radial" title="Radial Gradient"></div>
                    <div ref="$repeatingLinear" class="gradient-item repeating-linear" data-type="repeating-linear" title="repeating Linear Gradient"></div>
                    <div ref="$repeatingRadial" class="gradient-item repeating-radial" data-type="repeating-radial" title="repeating Radial Gradient"></div>
                    <div ref="$image" class="gradient-item image" data-type="image" title="Background Image">
                        <div class="m1"></div>
                        <div class="m2"></div>
                        <div class="m3"></div>
                    </div>
                </div>
                <div ref="$angular" class='gradient-angular linear'>
                    <div class="gradient-angular-item radial">
                        <PredefinedRadialGradientAngle></PredefinedRadialGradientAngle>
                    </div>
                    <div class="gradient-angular-item image">
                        
                    </div>                
                </div>
            </div>
        </div>

          
        `
    }

    refresh () {

        const isShow = this.isShow();
        this.$el.toggle(isShow)

        if (isShow) {
            this.setLayerTypeUI();
        }

    }

    isShow () {
        var item = this.read('/item/current/image')

        if (!item) return false; 

        return true; 
    }


    '@changeEditor' () {
        this.refresh()
    }

    setLayerTypeUI (type) {
        var item = this.read('/item/current/image')

        if (!type && item) {
            type = item.type
        }

        this.refs.$static.toggleClass('selected', type == 'static');
        this.refs.$linear.toggleClass('selected', type == 'linear');
        this.refs.$radial.toggleClass('selected', type == 'radial');
        this.refs.$repeatingLinear.toggleClass('selected', type == 'repeating-linear');
        this.refs.$repeatingRadial.toggleClass('selected', type == 'repeating-radial');
        this.refs.$image.toggleClass('selected', type == 'image');

        this.refs.$angular.toggleClass('linear', this.read('/image/type/isLinear', type)); 
        this.refs.$angular.toggleClass('radial',  this.read('/image/type/isRadial', type));
        this.refs.$angular.toggleClass('image',  this.read('/image/type/isImage', type));
    }

    'click $gradientType .gradient-item' (e) {

        var type = e.$delegateTarget.attr('data-type');

        var item = this.read('/item/current/image');

        if (!item) return; 

        item.type = type; 

        this.dispatch('/item/set', item);
        this.setLayerTypeUI(type) 
    }

}