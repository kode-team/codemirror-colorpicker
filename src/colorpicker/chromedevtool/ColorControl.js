
import Color from '../../util/Color'
import EventMachin from '../../util/EventMachin'
import Hue from './control/Hue';
import Opacity from './control/Opacity'

export default class ColorControl extends EventMachin {
    constructor (colorpicker) {
        super();
        this.colorpicker = colorpicker; 
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

    setBackgroundColor (color) {
        this.refs.$controlColor.css("background-color", color);
    }

    refresh () {
        this.setColorUI();
    }

 
    setInputColor () {
        this.setBackgroundColor(this.colorpicker.getFormattedColor('rgb'));
        
        var rgb = this.colorpicker.convertRGB();
        var colorString = Color.format(rgb, 'rgb');
        this.Opacity.setOpacityColorBar(colorString);        
    }

    setColorUI() {
    
        this.Hue.setColorUI()
        this.Opacity.setColorUI()
    }

    caculateH() {
        return this.Hue.caculateH()
    }
    setControlColor (color) {
        this.refs.$controlColor.css('background-color', color);
    }
        
    setOnlyHueColor() {
        this.Hue.setOnlyHueColor()
    }       

}
 