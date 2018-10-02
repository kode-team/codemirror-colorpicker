import BaseColorPicker from '../BaseColorPicker'

import Hue from '../ui/control/Hue';
import Opacity from '../ui/control/Opacity'
import ColorView from '../ui/control/ColorView'
import Information from '../ui/ColorInformation'
import Palette from '../ui/ColorPalette'
import ColorSetsChooser from '../ui/ColorSetsChooser'
import CurrentColorSets from '../ui/CurrentColorSets'
import ContextMenu from '../ui/CurrentColorSetsContextMenu'

export default class ChromeDevToolColorPicker extends BaseColorPicker {

    template () {
        return `
            <div class='colorpicker-body'>
                <Palette></Palette> 
                <div class="control">
                    <Hue></Hue>
                    <Opacity></Opacity>
                    <div class="empty"></div>
                    <ColorView></ColorView>
                </div>
                <Information></Information>
                <CurrentColorSets></CurrentColorSets>
                <ColorSetsChooser></ColorSetsChooser>
                <ContextMenu></ContextMenu>
            </div>
        `
    }

    components() {
        return { 
            Hue, Opacity, ColorView, 
            Palette,  
            Information,
            CurrentColorSets,
            ColorSetsChooser,
            ContextMenu
        }
    }

}