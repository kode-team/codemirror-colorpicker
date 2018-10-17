import UIElement from "../../../../colorpicker/UIElement";

import items  from './items/index'

export default class ImageView extends UIElement {

    template () {
        return `
            <div class='property-view'>
                <Background></Background>
                <BackgroundRepeat></BackgroundRepeat>
            </div>  
        `
    }

    components () {
        return items 
    }
}