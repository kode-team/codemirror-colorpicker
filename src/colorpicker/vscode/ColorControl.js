import Hue from '../ui/control/VerticalHue';
import Opacity from '../ui/control/VerticalOpacity'
import UIElement from '../UIElement';

const source = 'mini-control';

export default class ColorControl extends UIElement {

    components () {
        return { Hue, Opacity }
    }
 
    template () {
        return /*html*/`
            <div class="control">
                <div target="Opacity" ></div>            
                <div target="Hue" ></div>
            </div>
        `
    }

    refresh () {
        this.setColorUI();
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
 