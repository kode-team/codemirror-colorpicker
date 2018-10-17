import BasePropertyItem from "./BasePropertyItem";

export default class Size extends BasePropertyItem {
    template () {
        return `
            <div class='property-item size'>
                <div class='title' ref="$title">Dimesion</div>
                <div class='items'>
                    <div>
                        <label>fixed</label>
                        <div>
                            <button type="button" ref="$rect">like width</button>
                        </div>
                    </div>                   
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
        if (!item.style) return; 
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