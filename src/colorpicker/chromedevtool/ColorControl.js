import Hue from '../ui/control/Hue';
import Opacity from '../ui/control/Opacity'
import UIElement from '../UIElement';

const source = 'chromedevtool-control';

export default class ColorControl extends UIElement {

    components () {
        return { Hue, Opacity }
    }

    template () {
        return `
        <div class="control">
            <div target="Hue" ></div>
            <div target="Opacity" ></div>
            <div ref="$controlPattern" class="empty"></div>
            <div ref="$controlColor" class="color"></div>
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
 