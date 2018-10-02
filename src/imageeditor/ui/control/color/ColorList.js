import UIElement from "../../../../colorpicker/UIElement";

export default class ColorList extends UIElement {

    template () {

        var list = this.read('/color/list')
        return `
            <div class='color-list'>
                <div class='color-type'>
                    <div ref="$colorTypeList">
                    </div>
                </div>
                <div class='color-sample-list' ref="$colorSampleList">
                </div>
            </div>
        `
    }

    'load $colorTypeList' () {
        var colorTypeList = this.read('/color/list/type')
        var type = this.read('/color/get/type')
        return `<select ref="$colorType">
            ${colorTypeList.map(obj => {
                var selected = type == obj.id ? 'selected' : '' 
                return `<option value='${obj.id}' ${selected}>${obj.title}</option>`
            }).join('')}
            </select>`
    }

    'load $colorSampleList' () {
        var list = this.read('/color/list')
        return `<div>
                ${list.map(color => {
                    return `<div class='color-item' style='background-color: ${color}' data-color="${color}"></div>`
                }).join('')}
            </div>`
    }    

    refresh () {
        this.load()
    }

    '@changeColorType' () {
        this.refresh()
    }

    'change $colorType' (e) {
        var type = this.refs.$colorType.val()

        this.dispatch('/color/set/type', type)
        this.refresh()
    }

    'click $colorSampleList .color-item' (e) {
        var color = e.$delegateTarget.attr('data-color')

        this.dispatch('/image/change/color', color);
    }
}