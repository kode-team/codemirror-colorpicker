import Color from '../../util/Color'

import BaseColorPicker from '../BaseColorPicker'

import ColorControl from './ColorControl'
import ColorInformation from './ColorInformation'
import ColorPalette from './ColorPalette'
import ColorSetsChooser from './ColorSetsChooser'
import CurrentColorSets from './CurrentColorSets'
import CurrentColorSetsContextMenu from './CurrentColorSetsContextMenu'

export default class ColorPicker extends BaseColorPicker {

    template () {
        return `
            <div class='colorpicker-body'>
                <div target="palette"></div>
                <div target="control"></div>
                <div target="information"></div>
                <div target="currentColorSets"></div>
                <div target="colorSetsChooser"></div>
                <div target="contextMenu"></div>
            </div>
        `
    }

    components() {
        return { 
            palette: ColorPalette,  
            control: ColorControl,
            information: ColorInformation,
            currentColorSets: CurrentColorSets,
            colorSetsChooser: ColorSetsChooser,
            contextMenu: CurrentColorSetsContextMenu
        }
    }

     // Event Bindings 
     'mouseup document' (e) {

        // when color picker clicked in outside
        if (this.checkInHtml(e.target)) {
            //this.setHideDelay(hideDelay);
        } else if (this.checkColorPickerClass(e.target) == false) {
            this.hide();
        }
    }

}