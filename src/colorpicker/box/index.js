import BaseColorPicker from '../BaseColorPicker'

import ColorControl from './ColorControl'
import ColorInformation from '../ui/ColorInformation'
import ColorPalette from '../ui/ColorPalette'
import ColorSetsChooser from '../ui/ColorSetsChooser'
import CurrentColorSets from '../ui/CurrentColorSets'
import CurrentColorSetsContextMenu from '../ui/CurrentColorSetsContextMenu'

export default class BoxColorPicker extends BaseColorPicker {

    template () {
        return /*html*/`
            <div class='colorpicker-body'>
                <div target="palette"></div> 
                <div>
                    <div target="control"></div>
                    <div target="information"></div>
                    <div target="currentColorSets"></div>
                    <div target="colorSetsChooser"></div>
                    <div target="contextMenu"></div>
                </div>
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