import UIElement from "../../../../../colorpicker/UIElement";
import ColorPicker  from "../../color/ColorPicker";


export default class ColorPickerPanel extends UIElement {
    template () {
        return `
            <div class='property-item colorpicker show'>
                <div class='items'>            
                    <ColorPicker></ColorPicker>
                </div>
            </div>
        `
    }

    components() {
        return { ColorPicker }
    }


    refresh () {
        this.$el.toggle(this.isShow())
    }

    '@changeEditor' () {
        this.refresh()
    }

    isShow () {
        var item = this.read('/item/current/image')

        if (!item) return false; 

        return this.read('/image/type/isImage', item.type) == false; 
    }


}