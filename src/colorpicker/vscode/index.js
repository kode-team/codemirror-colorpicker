import BaseColorPicker from '../BaseColorPicker'

import ColorControl from './ColorControl'
import ColorPalette from '../ui/ColorPalette'
import Color from '../../util/Color'
import { enableEyeDropper } from '../../util/functions/support';
import Eyedropper from '../ui/Eyedropper';

export default class VSCodePicker extends BaseColorPicker {

    template () {

        const hasEyeDropper = enableEyeDropper ? 'has-eyedropper' : '';
        let $eyedropper = !!enableEyeDropper ? `
        <div class="el-cp-color-control__left">
          <div target="Eyedropper"></div>
        </div>
      ` : '';

        return /*html*/`
            <div class='colorpicker-body'>
                <div class='color-view ${hasEyeDropper}' >
                    <div class='color-view-container'  >
                        <div class="preview" ref="$colorview"></div>
                    </div>
                    ${$eyedropper}            
                </div>
                <div class='color-tool'>
                    <div target="palette"></div>
                    <div target="control"></div>
                </div>
            </div>
        `
    } 
    
    components() {
        return { 
            palette: ColorPalette,  
            control: ColorControl,
            Eyedropper
        }
    }

    initColorWithoutChangeEvent (color) {
        this.$store.dispatch('/initColor', color);
        this.refresh();
    }

    setBackgroundColor () {
        var color = this.$store.dispatch('/toColor')
        var rgb = this.$store.rgb;
        var bValue = Color.brightness(rgb.r,rgb.g,rgb.b);

        this.refs.$colorview.css({
            "background-color": color,
            'color': bValue > 127 ? 'black': 'white'
        });
        this.refs.$colorview.html(color);
    }

    'click $colorview' (e) {
        this.nextFormat()
    }

    nextFormat() {
        var current_format = this.$store.format || 'hex';

        var next_format = 'hex';
        if (current_format == 'hex') {
            next_format = 'rgb';
        } else if (current_format == 'rgb') {
            next_format = 'hsl';
        } else if (current_format == 'hsl') {
            next_format = 'hex';
        }

        this.$store.dispatch('/changeFormat', next_format);
        this.$store.emit('lastUpdateColor')
        this.refresh();
    }

    refresh () {
        this.setBackgroundColor()
    }

    '@changeColor' () {
        this.refresh()
    }

    '@initColor' () { 
        this.refresh() 
    }



}