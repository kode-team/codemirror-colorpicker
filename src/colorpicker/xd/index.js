import BaseColorPicker from '../BaseColorPicker'

import ColorControl from './ColorControl'
import ColorInformation from '../ui/ColorInformation'
import ColorPalette from '../ui/ColorPalette'
import ColorSetsChooser from '../ui/ColorSetsChooser'
import CurrentColorSets from '../ui/CurrentColorSets'
import CurrentColorSetsContextMenu from '../ui/CurrentColorSetsContextMenu'

export default class XDColorPicker extends BaseColorPicker {

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

}