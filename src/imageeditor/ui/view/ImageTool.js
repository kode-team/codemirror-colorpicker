import Event from '../../../util/Event'
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
        this.$el.toggle(this.read('/image/isImageType'))
    }

    '@changeLayer' () {
        this.refresh()
    }

    '@initLayer' () { this.refresh() }
}