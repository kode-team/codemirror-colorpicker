import UIElement from "../../../../../colorpicker/UIElement";
import GradientSteps from "../../colorsteps/GradientSteps";


export default class BasePropertyItem extends UIElement {

    
    'click $title' () {
        this.$el.toggleClass('show');
    } 

}