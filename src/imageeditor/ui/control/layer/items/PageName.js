import UIElement from "../../../../../colorpicker/UIElement";

export default class PageName extends UIElement {
    template () {
        return `
            <div class='property-item name'>
                <div class='items no-padding'>            
                    <div>
                        <label>page name</label>
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
        this.read('/item/current/page', (item) => {
            var name = '';
            if (item) {
                name = item.name ; 
                
            }
    
            this.refs.$name.val(name)
        });
        

    }

    'input $name' () {
        this.read('/item/current/page', (item) => {
            item.name = this.refs.$name.val();
            this.dispatch('/item/set', item)
        });
    }
}