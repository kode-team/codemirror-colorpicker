import Hue from './control/Hue';
import Opacity from './control/Opacity'
import UIElement from '../UIElement';

const source = 'chromedevtool-control';

export default class ColorControl extends UIElement {
    constructor (opt) {
        super(opt);
        this.initialize();        
    } 

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

    initialize () {

        this.$store.on('changeColor', (sourceType) => {
            if (source != sourceType) {
                this.refresh()
            }
        })
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

}
 