import UIElement from '../../../../colorpicker/UIElement';
import Dom from '../../../../util/Dom';
import { px2em, px2percent, percent2px, percent2em, em2percent, em2px } from '../../../../util/filter/functions';

export default class GradientSteps extends UIElement {

    template () { 
        return `
            <div class='gradient-steps'>
                <div class="hue-container" ref="$back"></div>            
                <div class="hue" ref="$steps">
                    <div class='step-list' ref="$stepList">
                    </div>
                </div>
            </div>
        ` 
    }

    getStepPosition (step) {
        var {min, max} = this.getMinMax() 
        
        var left = this.refs.$steps.offset().left

        min -= left;
        max -= left;

        if (step.unit == 'px') {
            return step.px;
        } 

        return min + (max - min) * (step.percent / 100);
    }

    '@step/position' (step, callback) {
        if (typeof callback == 'function') {
            callback (this.getStepPosition(step));
        }
    }


    getUnitName (step) {
        var unit = step.unit || 'percent'

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
        <select class='unit' data-colorstep-id="${step.id}">
            <option value='%' ${unit == '%' ? 'selected' : ''}>%</option>
            <option value='px' ${unit == 'px' ? 'selected' : ''}>px</option>
            <option value='em' ${unit == 'em' ? 'selected' : ''}>em</option>
        </select>
        `
    }

    getMaxValue () {
        return this.$store.step.width;
    }

    getUnitValue (step) {

        if (step.unit == 'px') {
            if (typeof step.px == 'undefined') {
                step.px = percent2px(step.percent, this.getMaxValue())
            }

            return {
                px:  step.px,
                percent: px2percent(step.px, this.getMaxValue()),
                em: px2em(step.px, this.getMaxValue())
            }
        } else if (step.unit == 'em') {
            if (typeof step.em == 'undefined') {
                step.em = percent2em(step.percent, this.getMaxValue())
            }            
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

    // load 후에 이벤트를 재설정 해야한다. 
    'load $stepList' () {
        var item = this.read('/item/current/image')

        if (!item) return '';

        return this.read('/item/map/children', item.id, (step) => {

            var cut = step.cut ? 'cut' : ''; 
            var unitValue = this.getUnitValue(step);
            return `
                <div 
                    class='drag-bar ${step.selected ? 'selected' : ''}' 
                    id="${step.id}"
                    style="left: ${this.getStepPosition(step)}px;"
                >   
                    <div class="guide-step step" style=" border-color: ${step.color};background-color: ${step.color};"></div>
                    <div class='guide-line' 
                        style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), ${step.color} 10%) ;"></div>
                    <div class="guide-change ${cut}" data-colorstep-id="${step.id}"></div>
                    <div class="guide-unit ${this.getUnitName(step)}">
                        <input type="number" class="percent" min="0" max="100" step="0.1"  value="${unitValue.percent}" data-colorstep-id="${step.id}"  />
                        <input type="number" class="px" min="0" max="1000" step="1"  value="${unitValue.px}" data-colorstep-id="${step.id}"  />
                        <input type="number" class="em" min="0" max="500" step="0.1"  value="${unitValue.em}" data-colorstep-id="${step.id}"  />
                        ${this.getUnitSelect(step)}
                    </div>       
                </div>
            `
        })
    }

    isShow() {

        var item = this.read('/item/current');

        if (!this.read('/image/type/isGradient', item.type)) {
            return false; 
        }

        if (!this.read('/item/is/mode', 'image')) {
            return false; 
        }

        return true; 
    }

    refresh () {

        this.$el.toggle(this.isShow())


        this.read('/item/current/image', item => {
            var type = item ? item.type : '' 
    
            if (this.read('/image/type/isGradient', type)) {
                this.load()
                this.setColorUI()
            }
        })
        
    }

    setColorUI() {
        this.setBackgroundColor()
    }

    setBackgroundColor() {

        this.refs.$stepList.css(
            'background-image', 
            this.read('/image/toLinearRight', this.read('/item/current/image'))
        )

    }

    /* slide 영역 min,max 구하기  */
    getMinMax() {
        var min = this.refs.$steps.offsetLeft(); 
        var width = this.refs.$steps.width();
        var max = min + width;

        return {min, max, width}
    }

    /* 현재 위치 구하기  */ 
    getCurrent (e) {
        var {min, max} = this.getMinMax()
        var {x} = e.xy
 
        var current = Math.min(Math.max(min, x), max)

        return current
    }

    /**
     * 마우스 이벤트로 현재 위치 및 percent 설정, 전체  gradient 리프레쉬 
     * 
     * @param {*} e 
     */
    refreshColorUI (e) {
        
        var {min, max} = this.getMinMax()

        var current = this.getCurrent(e)

        if (this.currentStep) {
            var posX = Math.max(min, current)
            var px = posX - this.refs.$steps.offsetLeft();

            if (e.ctrlKey) {
                px = Math.floor(px);    // control + drag is floor number 
            }
            this.currentStepBox.px('left', px)
            // var percent = Math.floor((current - min) / (max - min) * 100)

            var item = this.read('/item/get', this.currentStepBox.attr('id'));

            if (item) {

                item.px = px; 
                item.percent = Math.floor(px2percent(px, max - min));
                item.em = px2em(px, max- min);

                this.currentUnitPercent.val(item.percent);
                this.currentUnitPx.val(item.px);
                this.currentUnitEm.val(item.em);

                this.dispatch('/item/set', item);
                this.dispatch('/colorstep/sort', item.id, this.getSortedStepList());                
                this.setBackgroundColor();
            }
        }
    }

    '@changeColor' () {

        if (this.read('/image/isNotGradientType', this.read('/item/current/image'))) return;
        if (this.read('/tool/colorSource') !=  this.read('/colorstep/colorSource')) return; 

        if (this.currentStep) {

            var item = this.read('/item/get', this.currentStep.attr('id'))

            if (item) {
                var rgb = this.read('/tool/get', 'color');
                item.color = rgb ;

                this.dispatch('/item/set', item);
                this.refresh();
            }
        }

    }    

    '@changeEditor' () {
        this.refresh()
    }

    'checkTarget' (e) {
        return this.refs.$back.is(e.target)
    }

    // 이미 선언된 메소드를 사용하여 메타 데이타로 쓴다. 
    // checkTarget 이라는 메소드가 true 를 리턴해줘야 아래 이벤트는 실행된다. 
    'click $back' (e) {
        this.addStep(e);
    }

    removeStep (e) {

        var id = e.$delegateTarget.attr('id')

        this.dispatch('/colorstep/remove', id);
        this.refresh();
    }

    addStep (e) {
        var {min, max} = this.getMinMax()

        var current = this.getCurrent(e)

        var percent = Math.floor((current - min) / (max - min) * 100)

        var item = this.read('/item/current/image');

        if (!item) return; 

        this.dispatch('/colorstep/add', item, percent);
        this.refresh()
    }

    initColor (color) {
        this.dispatch('/colorstep/initColor', color)        
    }

    getSortedStepList () {
        var list = this.refs.$stepList.$$('.drag-bar').map(it => {
            return {id : it.attr('id'), x: it.cssFloat('left')}
        })

        list.sort((a, b) => {
            if (a.x == b.x) return 0; 
            return a.x > b.x ? 1: -1;
        })

        return list.map(it => it.id)
    }

    selectStep (e) {
        var item = this.read('/item/get', e.$delegateTarget.parent().attr('id'));
            
        this.read('/item/each/children', item.parentId, (step) => {
            if (step.selected) step.selected = false; 
        })

        item.selected = true; 

        this.initColor(item.color)     

        var $selected = this.refs.$stepList.$('.selected');
        if ($selected && !$selected.is(this.currentStepBox)) {
            $selected.removeClass('selected');
        }
        this.currentStepBox.addClass('selected')
        this.run ('/item/set', item); 
        this.dispatch('/colorstep/sort', item.id, this.getSortedStepList());
        this.setBackgroundColor();
    }

    'click.Shift $steps .step' (e) {
        this.removeStep(e);
    }

    'click $steps .step' (e) {
        this.selectStep(e)
    }

    'click $steps .guide-change' (e) {
        var id = e.$delegateTarget.attr('data-colorstep-id');
        var item = this.read('/item/get', id);

        if (item.id) {
            item.cut = !item.cut;
            this.dispatch('/item/set', item);
            this.refresh();
        }

    }

    'change $steps .guide-unit select.unit' (e) {

        var unit = e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('data-colorstep-id')
        
        var step = this.read('/item/get', id)

        if (step) {
            step.unit = unit;

            var unitValue = this.getUnitValue(step);
            Object.assign(step, unitValue);

            this.dispatch('/item/set', step)            

            var $parent = e.$delegateTarget.parent();
            $parent.removeClass('percent', 'px', 'em').addClass(this.getUnitName(step));
        }        
    }


    'input $steps input.percent' (e) {
        var item = this.read('/item/current/image')
        if (!item) return; 

        var layer = this.read('/item/current/layer');

        var percent = +e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('data-colorstep-id')
        
        var step = this.read('/item/get', id)

        if (step) {
            step.percent = percent; 
            step.px = percent2px(percent, this.getMaxValue(layer) );
            step.em = percent2em(percent, this.getMaxValue(layer) );

            this.currentStepBox.px('left', step.px)                
            // this.currentUnitPercent.val(item.percent);
            this.currentUnitPx.val(step.px);
            this.currentUnitEm.val(step.em);

            this.dispatch('/item/set', step)   
            this.setBackgroundColor();         
        }
    }

    'input $steps input.px' (e) {
        var item = this.read('/item/current/image')
        if (!item) return; 

        var layer = this.read('/item/current/layer');

        var px = +e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('data-colorstep-id')
        
        var step = this.read('/item/get', id)

        if (step) {
            step.px = px; 
            step.percent = px2percent(px, this.getMaxValue(layer));
            step.em = px2em(px, this.getMaxValue(layer));

            this.currentStepBox.px('left', step.px)                
            this.currentUnitPercent.val(step.percent);
            // this.currentUnitPx.val(item.px);
            this.currentUnitEm.val(step.em);

            this.dispatch('/item/set', step)    
            this.setBackgroundColor();                    
        }
    }
    
    'input $steps input.em' (e) {
        var item = this.read('/item/current/image')
        if (!item) return; 

        var layer = this.read('/item/current/layer');        

        var em = +e.$delegateTarget.val()
        var id = e.$delegateTarget.attr('data-colorstep-id')
        
        var step = this.read('/item/get', id)

        if (step) {
            step.em = em; 
            step.percent = em2percent(em, this.getMaxValue(layer));
            step.px = em2px(em, this.getMaxValue(layer));   
            
            this.currentStepBox.px('left', step.px)                
            this.currentUnitPercent.val(step.percent);
            this.currentUnitPx.val(step.px);
            // this.currentUnitEm.val(item.em);
        
            this.dispatch('/item/set', step)   
            this.setBackgroundColor();         
        }
    }        

    // Event Bindings 
    'pointerend document' (e) { 
        this.onDragEnd(e);
    }

    'pointermove document' (e) {
        this.onDragMove(e);
    }

    isStepElement (e) {
        return new Dom(e.target).hasClass('step');
    }

    'pointerstart $steps .step' (e) {

        e.preventDefault();
        if (this.isStepElement(e) && !this.isDown) {
            this.onDragStart(e);
        }
    }

    onDragStart (e) {

        this.isDown = true; 
        this.currentStep = e.$delegateTarget;
        this.currentStepBox = this.currentStep.parent();
        this.currentUnit = this.currentStepBox.$(".guide-unit")
        this.currentUnitPercent = this.currentUnit.$(".percent")
        this.currentUnitPx = this.currentUnit.$(".px")
        this.currentUnitEm = this.currentUnit.$(".em")

        if (this.currentStep) {
            this.selectStep(e)
        }

    }

    onDragMove (e) {
        if (this.isDown) {
            this.refreshColorUI(e);
            this.refs.$stepList.addClass('mode-drag')
        }
    } 

    /* called when mouse is ended move  */
    onDragEnd (e) {
        this.isDown = false         
        if (this.refs.$stepList) {
            this.refs.$stepList.removeClass('mode-drag')        
        }

    }
}