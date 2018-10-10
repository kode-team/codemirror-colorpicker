import UIElement from "../../../../../colorpicker/UIElement";
import ColorPicker  from "../../color/ColorPicker";


export default class ColorPickerPanel extends UIElement {
    template () {
        return `
            <div class='property-item colorpicker'>
                <ColorPicker></ColorPicker>
            </div>
        `
    }

    components() {
        return { ColorPicker }
    }

}