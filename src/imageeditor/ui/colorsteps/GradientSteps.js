import Event from '../../../util/Event'
import UIElement from '../../../colorpicker/UIElement';

export default class GradientSteps extends UIElement {

    template () { 
        return `
            <div class='gradient-steps'>
                <div class="hue-container"></div>            
                <div class="hue" ref="$steps"></div>
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
    'load $steps' () {
        var list = this.read('/colorstep/list')
        return `<div class='step-list' ref="$stepList">
                    ${list.map( step => {
                        return `
                            <div 
                                class='drag-bar step ${step.selected ? 'selected' : ''}' 
                                data-color="${step.color}" 
                                data-percent="${step.percent}" 
                                style="left: ${this.getStepPosition(step.percent)}px; border-color: ${step.color};background-color: ${step.color};"
                            ></div>
                        `
                    }).join('')}
                </div>`
    }

    refresh () {
        if (!this.read('/image/isImageType')) {        
            this.load()         
            this.setColorUI()
        }
    }

    setColorUI() {
        this.setBackgroundColor()

        // this.$el.toggle(!this.read('/image/isImageType'))
    }

    setBackgroundColor() {
        this.refs.$stepList.css('background-image', this.read('/image/toLinearRight'))
    }

    getStepList () {
        return this.refs.$steps.$$('.step');
    }

    refreshStep() {
        var colorSteps = this.getStepList().map( $dom => {
            return { 
                color: $dom.attr('data-color'), 
                percent: +$dom.attr('data-percent'), 
                selected: $dom.hasClass('selected') 
            }
        })

        this.dispatch('/colorstep/setAll', colorSteps)
        this.setColorUI()
    }

    /* slide 영역 min,max 구하기  */
    getMinMax() {
        var min = this.state.get('$steps.offsetLeft'); 
        var width = this.state.get('$steps.width');
        var max = min + width;

        return {min, max, width}
    }

    /* 현재 위치 구하기  */ 
    getCurrent (e) {
        var {min, max} = this.getMinMax()
        var {x} = Event.posXY(e)
 
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
            this.currentStep.px('left', posX - this.state.get('$steps.offsetLeft'))

            var percent = Math.floor((current - min) / (max - min) * 100)

            this.currentStep.attr('data-percent', percent)
         
            this.refreshStep()
        }
    }

    '@changeColor' () {

        if (this.read('/image/isImageType')) return;
        if (this.read('/tool/colorSource') !=  this.read('/colorstep/colorSource')) return; 

        this.currentStep = this.currentStep || this.getStepList()[0]



        if (this.currentStep) {
            var rgb = this.read('/tool/get', 'color');
            this.currentStep.attr('data-color', rgb);
            this.currentStep.css('background-color', rgb);
            this.currentStep.css('border-color', rgb);
            this.refreshStep()
        }

    }    

    '@changeLayer' () {
        this.refresh()
    }

    '@initLayer' () { this.refresh() }

    'checkTarget' (e) {
        return this.refs.$stepList.is(e.target)
    }

    // 이미 선언된 메소드를 사용하여 메타 데이타로 쓴다. 
    // checkTarget 이라는 메소드가 true 를 리턴해줘야 아래 이벤트는 실행된다. 
    'click.checkTarget $steps' (e) {
        this.addStep(e);
    }

    removeStep (e) {
        e.$delegateTarget.remove()
        this.refreshStep()
    }

    addStep (e) {
        var {min, max} = this.getMinMax()

        var current = this.getCurrent(e)

        var percent = Math.floor((current - min) / (max - min) * 100)

        this.dispatch('/colorstep/add', percent)
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

    'click.Shift $steps .step' (e) {
        this.removeStep(e);
    }

    'click $steps .step' (e) {
        this.updateSelectedStep(e)
        this.initColor(this.currentStep.attr('data-color'))
    }


    // Event Bindings 
    'pointerend document' (e) { 
        this.onDragEnd(e);
    }

    'pointermove document' (e) {
        this.onDragMove(e);
    }

    'pointerstart $steps .step' (e) {
        e.preventDefault();
        if (!this.isDown) {
            this.onDragStart(e);
        }
    }

    onDragStart (e) {

        this.isDown = true; 
        this.currentStep = e.$delegateTarget;

        if (this.currentStep) {

            this.updateSelectedStep(e)
            this.initColor(this.currentStep.attr('data-color'))        
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
        this.refs.$stepList.removeClass('mode-drag')        
    }
}