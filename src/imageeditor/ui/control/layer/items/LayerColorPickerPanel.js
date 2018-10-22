import UIElement from "../../../../../colorpicker/UIElement";
import ColorPicker  from "../../color/ColorPicker";


export default class LayerColorPickerPanel extends UIElement {
    template () {
        return `
            <div class='property-item layer-colorpicker'>
                <div class='items'>            
                    <ColorPicker></ColorPicker>
                </div>
            </div>
        `
    }

    components() {
        return { ColorPicker }
    }

    '@toggleLayerColorPicker' () {
        this.$el.toggleClass('show');
    }

}