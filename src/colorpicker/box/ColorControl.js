import { enableEyeDropper } from '../../util/functions/support';
import Hue from '../ui/control/Hue';
import Opacity from '../ui/control/Opacity'
import UIElement from '../UIElement';
import Eyedropper from '../ui/Eyedropper';

const source = 'chromedevtool-control';

export default class ColorControl extends UIElement {

    components () {
        return { Hue, Opacity, Eyedropper }
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
            <div>
                ${$eyedropper}                                
                <div class="color-info">
                    <div ref="$controlPattern" class="empty"></div>
                    <div ref="$controlColor" class="color"></div>        
                </div>
            </div>
            <div target="Hue" ></div>
            <div target="Opacity" ></div>

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
        this.Hue.setColorUI()
        this.Opacity.setColorUI()
    }    

    '@changeColor' (sourceType) {
        if (source != sourceType) {
            this.refresh()
        }
    }

    '@initColor' () { this.refresh() }    

}
 