import UIElement from "../../../../../colorpicker/UIElement";

export default class Rotate extends UIElement {
    template () {
        return `
            <div class='property-item rotate'>
                <div>
                    <label>Rotate</label>
                    <div>
                        <input type='number' ref="$rotate"> <span>deg</span>
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
            if (item.style.rotate) {
                this.refs.$rotate.val(item.style.rotate)
            }
        })
        
    }

    'input $rotate' () {
        this.read('/item/current/layer', (item) => {
            item.style.rotate = this.refs.$rotate.int()
            this.dispatch('/item/set', item)
        })
    }
}