import UIElement from '../../../../colorpicker/UIElement';
import PredefinedRadialGradientAngle from '../../view/PredefinedRadialGradientAngle'

export default class GradientType extends UIElement {

    components () {
        return { PredefinedRadialGradientAngle }
    } 

    template () {
        return `
        <div class='gradient-tools'>
            <div class='menu-buttons'><button type="button" ref="$createGradientButton">+ Gradient</button></div>
        </div>
        `
    }

    'click $createGradientButton' (e) {
        this.read('/item/current/layer', (item) => {
            this.dispatch('/item/add', 'image', false, item.id)
        }); 
    }    

}