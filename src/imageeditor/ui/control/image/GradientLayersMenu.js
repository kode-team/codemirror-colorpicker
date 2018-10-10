import UIElement from '../../../../colorpicker/UIElement';
import GradientType from './GradientType';


export default class LayersMenu extends UIElement {

    template () {
        return ` 
            <div class='gradient-layers-menu'>
                <div class="left">
                    <GradientType></GradientType>
                </div>
            </div>
        `
    }

    components () {
        return { GradientType }
    } 
}