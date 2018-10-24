import UIElement from "../../../../colorpicker/UIElement";

export default class GradientInfo extends UIElement {

    template () { 
        return ` 
            <div class='gradient-info'>
                <div class="form-item" ref="$colorsteps">

                </div>
            </div>
        ` 
    }

    'load $colorsteps' () {

        var item = this.read('/item/current/image')

        if (!item) return '';

        var colorsteps = this.read('/item/map/children', item.id, (step) => step);

        return `<div class='step-list' ref="$stepList">
                    ${colorsteps.map( step => {
                        return `
                            <div class='color-step ${step.selected ? 'selected' : ''}' style="background-color: ${step.selected ? step.color : ''}" colorstep-id="${step.id}" >
                                <div class="color-view">
                                    <div class="color-view-item" style="background-color: ${step.color}" colorstep-id="${step.id}" ></div>
                                </div>
                                <div class="color-code">
                                    <input type="text" class="code" value='${step.color}'  colorstep-id="${step.id}"  />
                                </div>
                                <div class="color-percent">
                                    <input type="number" class="percent" min="0" max="100" step="0.1"  value="${step.percent}"   colorstep-id="${step.id}"  />%
                                </div>
                                <div class="tools">
                                    <button type="button" class='remove-step'  colorstep-id="${step.id}" >&times;</button>
                                </div>
                            </div>
                        `
                    }).join('')}
                </div>`
    }

    refresh () {
        this.load()
    }

    '@changeEditor' () {
        this.refresh()
    }

    initColor (color) {
        this.dispatch('/colorstep/initColor', color)        
    }

    selectStep (e) {
        var item = this.read('/item/get', e.$delegateTarget.attr('colorstep-id'));
            
        this.read('/item/each/children', item.parentId, (step) => {
            if (step.selected) step.selected = false; 
        })

        item.selected = true; 

        this.initColor(item.color)     
        this.dispatch('/item/set', item); 
        this.refresh();        
    }    

    'click $colorsteps .color-view-item' (e) {
        this.selectStep(e)
    }

    'input $colorsteps input.code' (e) {
        var item = this.read('/item/current/image')
        if (!item) return; 

        var color = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = this.read('/item/get', id)

        if (step) {
            step.color = color; 
            this.dispatch('/item/set', step)            
        }

    }

    'input $colorsteps input.percent' (e) {
        var item = this.read('/item/current/image')
        if (!item) return; 

        var percent = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = this.read('/item/get', id)

        if (step) {
            step.percent = percent; 
            this.dispatch('/item/set', step)            
        }
    }

    'click $colorsteps .remove-step' (e) {
        var item = this.read('/item/current/image')
        if (!item) return; 

        var id = e.$delegateTarget.attr('colorstep-id')
        
        this.dispatch('/colorstep/remove', id)
        this.refresh()

    }

}