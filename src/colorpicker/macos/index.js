import BaseColorPicker from '../BaseColorPicker'

import ColorWheel from './ColorWheel'
import ColorControl from './ColorControl'

import ColorInformation from '../chromedevtool/ColorInformation'
import ColorSetsChooser from '../chromedevtool/ColorSetsChooser'
import CurrentColorSets from '../chromedevtool/CurrentColorSets'
import CurrentColorSetsContextMenu from '../chromedevtool/CurrentColorSetsContextMenu'

export default class MacOSColorPicker extends BaseColorPicker {
 
    template () {
        return `
            <div class='colorpicker-body'>
                <div target="colorwheel"></div>
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
            colorwheel: ColorWheel,  
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