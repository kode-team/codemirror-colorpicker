import BaseColorPicker from '../BaseColorPicker'

import ColorControl from './ColorControl'

import ColorWheel from '../ui/ColorWheel'
import ColorInformation from '../ui/ColorInformation'
import ColorSetsChooser from '../ui/ColorSetsChooser'
import CurrentColorSets from '../ui/CurrentColorSets'
import CurrentColorSetsContextMenu from '../ui/CurrentColorSetsContextMenu'

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


}