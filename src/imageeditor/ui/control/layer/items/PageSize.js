import UIElement from "../../../../../colorpicker/UIElement";

export default class PageSize extends UIElement {
    template () {
        return `
            <div class='property-item size'>
                <div class='title'>page size
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
        this.read('/item/current/page', (item) => {
            if (item.style && item.style.width) {
                this.refs.$width.val(item.style.width.replace('px', ''))
            }
    
            if (item.style && item.style.height) {
                this.refs.$height.val(item.style.height.replace('px', ''))
            }
    
        })
        
    }

    'click $rect' (e) {

        this.read('/item/current/page', (item) => {
            item.style.width = this.refs.$width.int() + 'px'
            item.style.height = item.style.width; 
            this.dispatch('/item/set', item)
    
        })
    }

    'input $width' () {

        this.read('/item/current/page', (item) => {
            item.style.width = this.refs.$width.int() + 'px'
            this.dispatch('/item/set', item)
        })
    }

    'input $height' () {

        this.read('/item/current/page', (item) => {
            item.style.height = item.style.width; 
            this.dispatch('/item/set', item)
    
        })
    }    
}