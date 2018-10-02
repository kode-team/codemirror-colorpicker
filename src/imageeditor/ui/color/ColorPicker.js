import UIElement from '../../../colorpicker/UIElement';
import ColorPicker from '../../../colorpicker/index'

export default class ColorPickerLayer extends UIElement {

    afterRender () {
        var defaultColor = this.read('/getSelectedColor')
        this.colorPicker = ColorPicker.create({
            type: 'ring',
            position: 'inline',
            container: this.$el.el,
            color: defaultColor,
            onChange: (c) => {
                this.changeColor(c);
            }
        })    

        setTimeout(() => {
            this.colorPicker.dispatch('/initColor', defaultColor)
        }, 100)
        
    }    

    template () { 
        return `<div class='colorpicker-layer'> </div>`
    }

    changeColor (color) {
        this.dispatch('/tool/changeColor', color);
    }

    '@changeColor' () {
        this.colorPicker.initColorWithoutChangeEvent(this.read('/tool/get', 'color'));
    }


}