import UIElement from "../../../../../colorpicker/UIElement";

export default class Name extends UIElement {
    template () {
        return `
            <div class='property-item name'>
                <div class='items'>            
                    <div>
                        <label>Name</label>
                        <div>
                            <input type='text' ref="$name" class='full'> 
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
        var item = this.read('/item/current');
        
        var name = '';
        if (item) {
            name = item.name ; 
            
        }

        this.refs.$name.val(name)
    }

    'input $name' () {
        var item = this.read('/item/current');

        if (item) {
            item.name = this.refs.$name.val();
            this.dispatch('/item/set', item)
        }
    }
}