import UIElement from "../../../../../colorpicker/UIElement";

export default class Radius extends UIElement {
    template () {
        return `
            <div class='property-item radius'>
                <div class='title'>Radius</div>
                <div class='items'>            
                    <div>
                        <label>Top Left</label>
                        <div>
                            <input type='number' ref="$topLeftRadius"> <span>px</span>
                        </div>
                    </div>
                    <div>
                        <label>Top Right</label>
                        <div>
                            <input type='number' ref="$topRightRadius"> <span>px</span>
                        </div>
                    </div>                
                    <div>
                        <label>Bottom Left</label>
                        <div>
                            <input type='number' ref="$bottomLeftRadius"> <span>px</span>
                        </div>
                    </div>
                    <div>
                        <label>Bottom Right</label>
                        <div>
                            <input type='number' ref="$bottomRightRadius"> <span>px</span>
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
            if (item.style['border-top-left-radius']) {
                this.refs.$topLeftRadius.val(item.style['border-top-left-radius'].replace('px', ''))
            }
    
            if (item.style['border-top-right-radius']) {
                this.refs.$topRightRadius.val(item.style['border-top-right-radius'].replace('px', ''))
            }

            if (item.style['border-bottom-left-radius']) {
                this.refs.$bottomLeftRadius.val(item.style['border-bottom-left-radius'].replace('px', ''))
            }

            if (item.style['border-bottom-right-radius']) {
                this.refs.$bottomRightRadius.val(item.style['border-bottom-right-radius'].replace('px', ''))
            }
        })
        
    }

    refreshValue (key, $el) {
        this.read('/item/current/layer', (item) => {
            item.style[key] = $el.int() + 'px'
            this.dispatch('/item/set', item)
        })
    }

    'input $topLeftRadius' () {
        this.refreshValue('border-top-left-radius', this.refs.$topLeftRadius);
    }

    'input $topRightRadius' () {
        this.refreshValue('border-top-right-radius', this.refs.$topRightRadius);
    }

    'input $bottomLeftRadius' () {
        this.refreshValue('border-bottom-left-radius', this.refs.$bottomLeftRadius);
    }

    'input $bottomRightRadius' () {
        this.refreshValue('border-bottom-right-radius', this.refs.$bottomRightRadius);
    }
}