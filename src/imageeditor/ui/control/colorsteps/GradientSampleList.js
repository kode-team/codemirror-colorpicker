import UIElement from "../../../../colorpicker/UIElement";

export default class GradientSampleList extends UIElement  {
 
    initialize () {
        super.initialize();

        this.list = this.read('/gradient/list/sample'); 
    }

    template () {

        return `
        <div class="gradient-sample-list">
            ${this.list.map( (item, index) => {
                return `<div class='gradient-sample-item' style='${this.read('/image/toString', item)}' data-index="${index}"></div>`
            }).join('')}
        </div>
        `  
    }

    'click $el .gradient-sample-item' (e) {
        var index = +e.$delegateTarget.attr('data-index')

        this.dispatch('/gradient/select',  index );
    }


} 