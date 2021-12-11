import Value from '../ui/control/Value';
import UIElement from '../UIElement';
import Opacity from '../ui/control/Opacity'
import Eyedropper from '../ui/Eyedropper';
import { enableEyeDropper } from '../../util/functions/support';

const source = 'macos-control';

export default class ColorControl extends UIElement {

    components () {
        return { Value, Opacity, Eyedropper }
    } 

    template () {

        const hasEyeDropper = enableEyeDropper ? 'has-eyedropper' : '';
        let $eyedropper = !!enableEyeDropper ? `
        <div class="el-cp-color-control__left">
          <div target="Eyedropper"></div>
        </div>
      ` : '';


        return `
        <div class="control ${hasEyeDropper}">
            <div target="Value" ></div>
            <div target="Opacity" ></div>
            <div ref="$controlPattern" class="empty"></div>
            <div ref="$controlColor" class="color"></div>
            ${$eyedropper}                       
        </div>
        `
    }

    setBackgroundColor () {
        this.refs.$controlColor.css("background-color", this.$store.dispatch('/toRGB'));
    }
 
    refresh () {
        this.setColorUI();
        this.setBackgroundColor()
    }

    setColorUI() {
        this.Value.setColorUI()
        this.Opacity.setColorUI()
    }   
    
    '@changeColor' (sourceType) {
        if (source != sourceType) {
            this.refresh()
        }
    } 

    '@initColor' () { this.refresh() }    

}
 