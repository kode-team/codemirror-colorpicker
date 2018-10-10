
import ColorPicker from '../../../../colorpicker/index'
import UIElement from '../../../../colorpicker/UIElement';

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
        var item = this.read('/item/current')

        if (!item) return; 

        if (this.read('/item/is/mode', 'layer')) {
            item.style['background-color'] = color; 
            this.dispatch('/item/set', item)
        } else if (this.read('/item/is/mode', 'image')) {
            
            if (this.read('/image/type/isStatic', item.type)) {
                item.color = color; 
                this.dispatch('/item/set', item)
            } else if (this.read('/image/type/isGradient',item.type)) {

                this.read('/item/each/children', item.id, (step) => {
                    if (step.selected) {
                        step.color = color; 
                        this.dispatch('/item/set', step);
                    }
                })
            }
        
        }

    }

    '@changeColor' () {
        this.colorPicker.initColorWithoutChangeEvent(this.read('/tool/get', 'color'));
    } 

    '@changeEditor' () {
        if (this.read('/item/is/mode', 'layer')) {
            this.read('/item/current/layer', (layer) => {
                this.colorPicker.initColorWithoutChangeEvent(layer.style['background-color']);
            })
        } else if (this.read('/item/is/mode', 'image')) {
            this.read('/item/current/image', (image) => {
                if (this.read('/image/type/isStatic', image.type)) {
                    this.colorPicker.initColorWithoutChangeEvent(image.color);
                } else if (this.read('/image/type/isGradient', image.type)) {
                    
                }
            })
        }
    }


}