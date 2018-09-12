import BaseColorPicker from '../BaseColorPicker'

import ColorControl from './ColorControl'
import ColorPalette from '../ui/ColorPalette'

export default class MiniColorPicker extends BaseColorPicker {

    template () {
        return `
            <div class='colorpicker-body'>
                <div target="palette"></div><div target="control"></div>
            </div>
        `
    } 

    components() {
        return { 
            palette: ColorPalette,  
            control: ColorControl
        }
    }

}