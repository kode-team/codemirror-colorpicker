import UIElement from '../../../colorpicker/UIElement';

export default class ImageTool extends UIElement {

    template () {
        return ` 
            <div class='image-tool'>

            </div>
        ` 
    }



    refresh () {    
        this.setColorUI()

    }

    setColorUI() {
        var item = this.read('/item/current/image');
        var type = item ? item.type : ''
        this.$el.toggle(this.read('/image/type/isImage', type))
    }

    '@changeEditor' () {
        this.refresh()
    }
}