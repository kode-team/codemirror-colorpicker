import UIElement from "../../../../colorpicker/UIElement";

export default class GradientSampleList extends UIElement  {

    template () {

        var list = this.read('/gradient/list/sample');

        return `
        <div class="gradient-sample-list">
                 ${list.map((it, index) => {
                     return `<div class='gradient-sample-item' style='${this.read('/image/toString', it)}' data-index="${index}"></div>`
                 }).join('')}
        </div>
        `  
    }

    'click $el .gradient-sample-item' (e) {
        var index = +e.$delegateTarget.attr('data-index')

        this.dispatch('/gradient/select',  index );
    }


} 