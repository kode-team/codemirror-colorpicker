import Value from './control/Value';
import Opacity from './control/Opacity'
import UIElement from '../UIElement';

const source = 'macos-control';

export default class ColorControl extends UIElement {
    constructor (opt) {
        super(opt);
        this.initialize();        
    } 

    components () {
        return { Value, Opacity }
    }

    template () {
        return `
        <div class="control">
            <div target="Value" ></div>
            <div target="Opacity" ></div>
            <div ref="$controlPattern" class="empty"></div>
            <div ref="$controlColor" class="color"></div>
        </div>
        `
    }

    initialize () {

        this.$store.$ColorManager.on('change', (sourceType) => {
            if (source != sourceType) {
                this.refresh()
            }
        })
    }

    setBackgroundColor () {
        this.refs.$controlColor.css("background-color", this.$store.$ColorManager.toRGB());
    }

    refresh () {
        this.setColorUI();
        this.setBackgroundColor()
    }

    setColorUI() {
        this.Value.setColorUI()
        this.Opacity.setColorUI()
    }    

}
 