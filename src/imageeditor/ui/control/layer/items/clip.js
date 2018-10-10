import UIElement from "../../../../../colorpicker/UIElement";

export default class Clip extends UIElement {
    template () {
        return `
            <div class='property-item hidden'>
                <div class='items'>            
                    <div>
                        <label>Clip</label>
                        <div>
                            <input type='checkbox' ref="$check">
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
            this.refs.$check.el.checked = !!item.clip
        })        
    }

    'click $check' () {
        this.read('/item/current/page', (item) => {
            item.clip = this.refs.$check.el.checked; 
            this.dispatch('/item/set', item)
        })
    }
}