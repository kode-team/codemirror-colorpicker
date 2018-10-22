import BasePropertyItem from "./BasePropertyItem";
import { parseParamNumber } from "../../../../../util/filter/functions";

export default class Size extends BasePropertyItem {
    template () {
        return `
            <div class='property-item size show'>
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
                    <div>
                        <label>X</label>
                        <div>
                            <input type='number' ref="$x"> <span>px</span>
                        </div>
                        <label>Y</label>
                        <div>
                            <input type='number' ref="$y"> <span>px</span>
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
            this.refs.$width.val(parseParamNumber(item.style.width))
        }

        if (item.style.height) {
            this.refs.$height.val(parseParamNumber(item.style.height))
        }

        if (item.style.x) {
            this.refs.$x.val(parseParamNumber(item.style.x))
        }

        if (item.style.y) {
            this.refs.$y.val(parseParamNumber(item.style.y))
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
        this.read('/item/current/layer', (item) => {
            item.style.width = this.refs.$width.int() + 'px'
            this.dispatch('/item/set', item)
        })        
    }

    'input $height' () {
        this.read('/item/current/layer', (item) => {
            item.style.height = this.refs.$height.int() + 'px'
            this.dispatch('/item/set', item)
        })        
    }    


    'input $x' () {
        this.read('/item/current/layer', (item) => {
            item.style.x = this.refs.$x.int() + 'px'
            this.dispatch('/item/set', item)
        })
    }

    'input $y' () {
        this.read('/item/current/layer', (item) => {
            item.style.y = this.refs.$y.int() + 'px'
            this.dispatch('/item/set', item)
        })
    }        
}