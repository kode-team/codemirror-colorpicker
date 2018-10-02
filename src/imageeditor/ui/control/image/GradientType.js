import UIElement from '../../../../colorpicker/UIElement';
import PredefinedRadialGradientAngle from '../../view/PredefinedRadialGradientAngle'

export default class GradientType extends UIElement {

    components () {
        return { PredefinedRadialGradientAngle }
    } 

    template () {
        return `
        <div class='gradient-tools'>
            <div class='gradient-type' ref="$gradientType">
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

          
        `
    }

    '@changeLayer' () {
        // this.setLayerTypeUI()
    }

    '@initLayer' () {
        this.setLayerTypeUI()
    }

    setLayerTypeUI (type) {

        type = type || this.read('/image/get', 'type')

        this.refs.$linear.toggleClass('selected', type == 'linear');
        this.refs.$radial.toggleClass('selected', type == 'radial');
        this.refs.$repeatingLinear.toggleClass('selected', type == 'repeating-linear');
        this.refs.$repeatingRadial.toggleClass('selected', type == 'repeating-radial');
        this.refs.$image.toggleClass('selected', type == 'image');

        this.refs.$angular.toggleClass('linear', this.read('/image/isLinearType'));
        this.refs.$angular.toggleClass('radial',  this.read('/image/isRadialType'));
        this.refs.$angular.toggleClass('image',  this.read('/image/isImageType'));
    }

    'click $gradientType .gradient-item' (e) {

        var type = e.$delegateTarget.attr('data-type');

        this.dispatch('/image/change', { type });

        this.setLayerTypeUI(type) 
    }
}