import BasePropertyItem from "./BasePropertyItem";

export default class Name extends BasePropertyItem {
    template () {
        return `
            <div class='property-item name show'>
                <div class='title' ref="$title">Information</div>            
                <div class='items'>            
                    <div>
                        <label>Name</label>
                        <div>
                            <input type='text' ref="$name" class='full'> 
                        </div>
                    </div>
                    <div>
                        <label>ID</label>
                        <div>
                            <input type='text' ref="$id" class='full'> 
                        </div>
                    </div>                                        
                    <div>
                        <label>Class</label>
                        <div>
                            <input type='text' ref="$class" class='full'> 
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
        var idString = '';
        var className = ''; 
        if (item) {
            name = item.name ; 
            idString = item.idString || '';
            className = item.className || '';
        }

        this.refs.$name.val(name)
        this.refs.$id.val(idString)
        this.refs.$class.val(className)
    }

    'input $name' () {
        var item = this.read('/item/current');

        if (item) {
            item.name = this.refs.$name.val();
            this.dispatch('/item/set', item)
        }
    }

    'input $class' () {
        var item = this.read('/item/current');

        if (item) {
            item.className = this.refs.$class.val();
            this.dispatch('/item/set', item)
        }
    }    

    'input $id' () {
        var item = this.read('/item/current');

        if (item) {
            item.idString = this.refs.$id.val();
            this.dispatch('/item/set', item)
        }
    }        
}