import Value from '../ui/control/Value';
import UIElement from '../UIElement';
import Opacity from '../ui/control/Opacity'

const source = 'macos-control';

export default class ColorControl extends UIElement {

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
 