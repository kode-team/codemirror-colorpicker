import UIElement from "../../../../../colorpicker/UIElement";
import ColorPicker  from "../../color/ColorPicker";


export default class ColorPickerPanel extends UIElement {
    template () {
        return `
            <div class='property-item colorpicker'>
                <div class='items'>            
                    <ColorPicker></ColorPicker>
                </div>
            </div>
        `
    }

    components() {
        return { ColorPicker }
    }

}