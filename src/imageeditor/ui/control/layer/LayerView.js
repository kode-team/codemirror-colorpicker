import UIElement from "../../../../colorpicker/UIElement";

import items  from './items/index'

export default class LayerView extends UIElement {

    template () {
        return `
            <div class='property-view'>
                <Name></Name>
                <div class="property-item">
                    <div class="gradient-view" ref="$gradientView"></div>
                </div>
                <size></size>
                <position></position>
                <radius></radius>
                <rotate></rotate>
            </div> 
        `
    }

    refresh () {
        this.setBackground()
    }

   
    '@changeEditor' () {
        this.refresh()
    } 

    setBackground() {
        var layer = this.read('/item/current/layer');

        if (layer) {
            this.refs.$gradientView.el.style = this.read('/layer/toString', layer, false); 
        }
    }

    components () {
        return items 
    }
}