import BasePropertyItem from "./BasePropertyItem";

export default class Radius extends BasePropertyItem {
    template () {
        return `
            <div class='property-item radius show'>
                <div class='title' ref="$title">Radius 
                    <span>
                        <label><input type='checkbox' ref="$fixedRadius" /> fixed</label>
                    </span> 
                </div>
                <div class='items'>         
                    <div>
                        <label style="width:80px;">T Left</label>
                        <div>
                            <input type='number' ref="$topLeftRadius"> <span>px</span>
                        </div>
                        <label style="width:50px;">Right</label>
                        <div>
                            <input type='number' ref="$topRightRadius"> <span>px</span>
                        </div>
                    </div>          
                    <div>
                        <label style="width:80px;">B Left</label>
                        <div>
                            <input type='number' ref="$bottomLeftRadius"> <span>px</span>
                        </div>
                        <label style="width:50px;">Right</label>
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

            if (item.fixedRadius) {
                this.refs.$fixedRadius.el.checked = true; 
                var radius = item.style['border-radius'] || ''
                radius = radius.replace('px', '')
                this.refs.$topLeftRadius.val(radius)
                this.refs.$topRightRadius.val('')
                this.refs.$bottomLeftRadius.val('')
                this.refs.$bottomRightRadius.val('')

                // this.refs.$topLeftRadius.val(item.style['border-top-left-radius'].replace('px', ''))
                this.refs.$topRightRadius.el.disabled = true
                this.refs.$bottomLeftRadius.el.disabled = true
                this.refs.$bottomRightRadius.el.disabled = true

            } else {
                this.refs.$topRightRadius.el.disabled = false
                this.refs.$bottomLeftRadius.el.disabled = false
                this.refs.$bottomRightRadius.el.disabled = false

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
            }

        })
        
    }

    refreshValue (key, $el) {
        this.read('/item/current/layer', (item) => {
            item.style[key] = $el.int() + 'px'
            this.dispatch('/item/set', item)
        })
    }

    'click $fixedRadius' (e) {
        this.read('/item/current/layer', (item) => {
            item.fixedRadius = this.refs.$fixedRadius.el.checked; 
            this.dispatch('/item/set', item);
        })
    }

    'input $topLeftRadius' () {
        this.read('/item/current/layer', (item) => {
            if (item.fixedRadius) {
                this.refreshValue('border-radius', this.refs.$topLeftRadius);
            } else {
                this.refreshValue('border-top-left-radius', this.refs.$topLeftRadius);
            }
        })
        
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