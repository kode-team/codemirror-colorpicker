import UIElement from "../../../../colorpicker/UIElement";

export default class GradientSampleList extends UIElement  {
 
    initialize () {
        super.initialize();

        this.list = this.read('/gradient/list/sample', this.props.type); 
        this.dispatch('/storage/load/image')

    }

    template () {

        return `
        <div class="gradient-sample-list">
            ${this.list.map( (item, index) => {
                return `<div class='gradient-sample-item' style='${this.read('/image/toString', item)}' data-index="${index}"></div>`
            }).join('')}
            <div class='cached-list' ref="$cachedList"></div>
            <div class='tools'>
                <button type="button" class="add-current-image" title="Cache a image">+</button>
            </div>
        </div>
        `  
    }

    'load $cachedList' () {
        return this.read('/storage/images').map( (item, index) => {
            var newImage = Object.assign({}, item.image, { colorsteps: item.colorsteps })
            return `<div class='gradient-cached-item' style='${this.read('/image/toString', newImage)}' data-index="${index}"></div>`
        })
    }

    refresh () {
        this.load();
    }

    '@changeStorage' () {
        this.refresh()
    }

    'click $el .gradient-sample-item' (e) {
        var index = +e.$delegateTarget.attr('data-index')

        this.dispatch('/gradient/select', this.props.type,  index );
    }

    'click $el .gradient-cached-item' (e) {
        var index = +e.$delegateTarget.attr('data-index')
        var image = this.read('/storage/images', index);
        var newImage = Object.assign({}, image.image, { colorsteps: image.colorsteps })        

        this.dispatch('/gradient/image/select', newImage );
    }

    'click $el .add-current-image' (e) {
        this.read('/item/current/image', (image) => {
            var newImage = this.read('/item/collect/image/one', image.id)

            this.dispatch('/storage/add/image', newImage);
            this.refresh();
        })
        
    }

} 