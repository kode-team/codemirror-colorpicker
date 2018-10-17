import BasePropertyItem from "./BasePropertyItem";

export default class Position extends BasePropertyItem {
    template () {
        return `
            <div class='property-item position'>
                <div class='title' ref="$title">Position</div>
                <div class='items'>            
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
        this.read('/item/current/layer', (item) => {
            if (item.style.x) {
                this.refs.$x.val(item.style.x.replace('px', ''))
            }
    
            if (item.style.y) {
                this.refs.$y.val(item.style.y.replace('px', ''))
            }
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