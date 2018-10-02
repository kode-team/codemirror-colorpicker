import BaseColorPicker from '../BaseColorPicker'

import Information from '../ui/ColorInformation'
import Palette from '../ui/ColorPalette'
import ColorSetsChooser from '../ui/ColorSetsChooser'
import CurrentColorSets from '../ui/CurrentColorSets'
import ContextMenu from '../ui/CurrentColorSetsContextMenu'
import Hue from '../ui/control/VerticalHue'
import Opacity from '../ui/control/VerticalOpacity'

export default class XDColorPicker extends BaseColorPicker {

    template () { 
        return `
            <div class='colorpicker-body'>
                <palette></palette> 
                <div class="control">
                    <Hue></Hue>
                    <Opacity></Opacity>
                </div>
                <information></information>
                <currentColorSets></currentColorSets>
                <colorSetsChooser></colorSetsChooser>
                <contextMenu></contextMenu>
            </div>
        `
    }

    components() {
        return { 
            Hue,
            Opacity,
            Palette,  
            Information,
            CurrentColorSets,
            ColorSetsChooser,
            ContextMenu
        }
    }

}