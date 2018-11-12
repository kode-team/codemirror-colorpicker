import UIElement from "../../../../colorpicker/UIElement";
import { percent2px, parseParamNumber, px2percent, px2em, em2percent, percent2em, em2px } from "../../../../util/filter/functions";

export default class GradientInfo extends UIElement {

    template () { 
        return ` 
            <div class='gradient-info'>
                <div class="form-item" ref="$colorsteps">

                </div>
            </div>
        ` 
    }

    getUnitName (step) {
        var unit = step.unit || '%'

        if (['px', 'em'].includes(unit)) {
            return unit; 
        }

        return 'percent'
    }

    getUnitSelect (step) {

        var unit = step.unit || '%'

        if (['px', 'em'].includes(unit) == false) {
            unit = '%';
        }

        return `
        <select class='unit' colorstep-id="${step.id}">
            <option value='%' ${unit == '%' ? 'selected' : ''}>%</option>
            <option value='px' ${unit == 'px' ? 'selected' : ''}>px</option>
            <option value='em' ${unit == 'em' ? 'selected' : ''}>em</option>
        </select>
        `
    }

    getUnitValue (step) {

        if (step.unit == 'px') {
            return {
                px: step.px,
                percent: px2percent(step.px, this.getMaxValue()),
                em: px2em(step.px, this.getMaxValue())
            }
        } else if (step.unit == 'em') {
            return {
                em: step.em,
                percent: em2percent(step.em, this.getMaxValue()),
                px: em2px(step.em, this.getMaxValue())
            }
        }

        return {
            percent: step.percent,
            px: percent2px(step.percent, this.getMaxValue()),
            em: percent2em(step.percent, this.getMaxValue())
        }
    }

    'load $colorsteps' () {

        var item = this.read('/item/current/image')

        if (!item) return '';

        var colorsteps = this.read('/colorstep/sort/list', item.id);


        return `<div class='step-list' ref="$stepList">
                    ${colorsteps.map( step => {
                        var cut = step.cut ? 'cut' : '';      
                        var unitValue = this.getUnitValue(step);
                        return `
                            <div class='color-step ${step.selected ? 'selected' : ''}' colorstep-id="${step.id}" >
                                <div class="color-cut">
                                    <div class="guide-change ${cut}" colorstep-id="${step.id}"></div>
                                </div>                                
                                <div class="color-view">
                                    <div class="color-view-item" style="background-color: ${step.color}" colorstep-id="${step.id}" ></div>
                                </div>                            
                                <div class="color-code">
                                    <input type="text" class="code" value='${step.color}' colorstep-id="${step.id}"  />
                                </div>
                                <div class="color-unit ${this.getUnitName(step)}">
                                    <input type="number" class="percent" min="0" max="100" step="0.1"  value="${unitValue.percent}" colorstep-id="${step.id}"  />
                                    <input type="number" class="px" min="0" max="1000" step="1"  value="${unitValue.px}" colorstep-id="${step.id}"  />
                                    <input type="number" class="em" min="0" max="500" step="0.1"  value="${unitValue.em}" colorstep-id="${step.id}"  />
                                    ${this.getUnitSelect(step)}
                                </div>                       
                                <div class="tools">
                                    <button type="button" class='remove-step' colorstep-id="${step.id}" >&times;</button>
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

    getMaxValue (layer) {
        return this.$store.step.width;
    }

    'change $colorsteps select.unit' (e) {

        var unit = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = this.read('/item/get', id)

        console.log(id);

        if (step) {
            step.unit = unit; 
            this.dispatch('/item/set', step)            

            console.log(e.$delegateTarget);
            var $parent = e.$delegateTarget.parent();
            $parent.removeClass('percent', 'px', 'em').addClass(unit);
        }        
    }

    'input $colorsteps input.percent' (e) {
        var item = this.read('/item/current/image')
        if (!item) return; 

        var layer = this.read('/item/current/layer');

        var percent = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = this.read('/item/get', id)

        if (step) {
            step.percent = percent; 
            step.px = percent2px(percent, this.getMaxValue(layer) );
            step.em = percent2em(percent, this.getMaxValue(layer) );
            this.dispatch('/item/set', step)            
        }
    }

    'input $colorsteps input.px' (e) {
        var item = this.read('/item/current/image')
        if (!item) return; 

        var layer = this.read('/item/current/layer');

        var px = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = this.read('/item/get', id)

        if (step) {
            step.px = px; 
            step.percent = px2percent(px, this.getMaxValue(layer));
            step.em = px2em(px, this.getMaxValue(layer));
            this.dispatch('/item/set', step)            
        }
    }
    
    'input $colorsteps input.em' (e) {
        var item = this.read('/item/current/image')
        if (!item) return; 

        var layer = this.read('/item/current/layer');        

        var em = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('colorstep-id')
        
        var step = this.read('/item/get', id)

        if (step) {
            step.em = em; 
            step.percent = em2percent(em, this.getMaxValue(layer));
            step.px = em2px(em, this.getMaxValue(layer));            
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


    'click $colorsteps .guide-change' (e) {
        var id = e.$delegateTarget.attr('colorstep-id');
        var item = this.read('/item/get', id);

        if (item.id) {
            item.cut = !item.cut;
            this.dispatch('/item/set', item);
            this.refresh();
        }

    }    

}