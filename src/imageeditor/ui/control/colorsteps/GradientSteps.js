import UIElement from '../../../../colorpicker/UIElement';
import Dom from '../../../../util/Dom';

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

    getStepPosition (percent) {
        var {min, max} = this.getMinMax() 
        
        var left = this.refs.$steps.offset().left

        min -= left;
        max -= left;

        return min + (max - min) * (percent / 100);
    }

    // load 후에 이벤트를 재설정 해야한다. 
    'load $stepList' () {
        var item = this.read('/item/current/image')

        if (!item) return '';

        return this.read('/item/map/children', item.id, (step) => {

            var cut = step.cut ? 'cut' : ''; 

            return `
                <div 
                    class='drag-bar step ${step.selected ? 'selected' : ''}' 
                    id="${step.id}"
                    color="${step.color}" 
                    style="left: ${this.getStepPosition(step.percent)}px; border-color: ${step.color};background-color: ${step.color};"
                >
                    <div class='guide-line' 
                        style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), ${step.color} 10%) ;"></div>
                    <div class="guide-change ${cut}" data-colorstep-id="${step.id}"></div>
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
            this.currentStep.px('left', posX - this.refs.$steps.offsetLeft())

            var percent = Math.floor((current - min) / (max - min) * 100)

            var item = this.read('/item/get', this.currentStep.attr('id'));

            if (item) {
                item.percent = percent;
                this.dispatch('/item/set', item);
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

    updateSelectedStep (e) {

        var selectedUI = this.refs.$steps.$('.selected')

        if (selectedUI) {
            selectedUI.removeClass('selected')
        }

        this.currentStep = e.$delegateTarget
        this.currentStep.addClass('selected')
    }

    initColor (color) {
        this.dispatch('/colorstep/initColor', color)        
    }

    selectStep (e) {
        var item = this.read('/item/get', e.$delegateTarget.attr('id'));
            
        this.read('/item/each/children', item.parentId, (step) => {
            if (step.selected) step.selected = false; 
        })

        item.selected = true; 

        this.initColor(item.color)     

        var $selected = this.refs.$stepList.$('.selected');
        if ($selected && !$selected.is(this.currentStep)) {
            $selected.removeClass('selected');
        }
        this.currentStep.addClass('selected')
        this.dispatch('/item/set', item); 
        this.setBackgroundColor();
    }

    'click.Shift $steps .step' (e) {
        this.removeStep(e);
    }

    'click $steps .step' (e) {
        this.selectStep(e)
    }

    'click $steps .step .guide-change' (e) {
        var id = e.$delegateTarget.attr('data-colorstep-id');
        var item = this.read('/item/get', id);

        if (item.id) {
            item.cut = !item.cut;
            this.dispatch('/item/set', item);
            this.refresh();
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