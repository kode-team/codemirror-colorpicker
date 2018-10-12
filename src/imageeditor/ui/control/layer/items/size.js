import UIElement from "../../../../../colorpicker/UIElement";

export default class Size extends UIElement {
    template () {
        return `
            <div class='property-item size'>
                <div class='title'>Dimesion
                    <span>
                        <button type="button" ref="$rect">rect</button>
                    </span>
                </div>
                <div class='items'>
                    <div>
                        <label>Width</label>
                        <div>
                            <input type='number' ref="$width"> <span>px</span>
                        </div>
                        <label>Height</label>
                        <div>
                            <input type='number' ref="$height"> <span>px</span>
                        </div>
                    </div>   
                                 
                </div>
            </div>
        `
    }

    '@changeEditor' () {
        this.refresh()
    }

    refresh() {
        var item = this.read('/item/current')

        if (!item) reutrn; 
        if (item.itemType == 'image') return; 

        if (item.style.width) {
            this.refs.$width.val(item.style.width.replace('px', ''))
        }

        if (item.style.height) {
            this.refs.$height.val(item.style.height.replace('px', ''))
        }
        
    }

    'click $rect' (e) {
        var item = this.read('/item/current')

        if (!item) reutrn; 
        if (item.itemType == 'image') return; 


        item.style.width = this.refs.$width.int() + 'px'
        item.style.height = item.style.width; 
        this.dispatch('/item/set', item)
    }

    'input $width' () {
        var item = this.read('/item/current')

        if (!item) reutrn; 
        if (item.itemType == 'image') return; 


        item.style.width = this.refs.$width.int() + 'px'
        this.dispatch('/item/set', item)
    }

    'input $height' () {
        var item = this.read('/item/current')

        if (!item) reutrn; 
        if (item.itemType == 'image') return; 


        item.style.height = this.refs.$height.int() + 'px'
        this.dispatch('/item/set', item)
    }    
}