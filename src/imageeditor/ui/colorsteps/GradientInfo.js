import UIElement from '../../../colorpicker/UIElement';

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

        var colorsteps = this.read('/colorstep/list');

        if (this.read('/image/isImageType')) {
            colorsteps = [] 
        }

        return `<div class='step-list' ref="$stepList">
                    ${colorsteps.map( (step, index) => {
                        return `
                            <div class='color-step ${step.selected ? 'selected' : ''}' >
                                <div class="color-view">
                                    <div class="color-view-item" style="background-color: ${step.color}" ref="$colorStep${index}-background"></div>
                                </div>
                                <div class="color-code">
                                    <input type="text" class="code" value='${step.color}' data-index="${index}" ref="$colorStep${index}-code" />
                                </div>
                                <div class="color-percent">
                                    <input type="number" class="percent" value="${step.percent}"  data-index="${index}" ref="$colorStep${index}-percent" />%
                                </div>
                                <div class="tools">
                                    <button type="button" class='remove-step' data-index="${index}">&times;</button>
                                </div>
                            </div>
                        `
                    }).join('')}
                </div>`
    }

    refresh () {
        this.load()
    }

    '@changeLayer' () {
        this.updateStepInfo()
    }

    updateStepInfo () {
        var colorsteps = this.read('/colorstep/list');

        if (this.read('/image/isImageType')) {
            colorsteps = [] 
        }


        if (colorsteps.length != this.refs.$stepList.childLength()) {
            this.refresh()
        } else {
            colorsteps.forEach((step, index) => {
                this.refs[`$colorStep${index}-background`].css('background-color', step.color);
                this.refs[`$colorStep${index}-code`].val(step.color);
                this.refs[`$colorStep${index}-percent`].val(step.percent);
            });
        }

    }

    '@initLayer' () { this.refresh() }     

    'input $colorsteps input.code' (e) {
        var color = e.$delegateTarget.val()
        var index = e.$delegateTarget.attr('data-index')

        this.dispatch('/colorstep/setStep', color, undefined, index);
    }

    'input $colorsteps input.percent' (e) {
        var percent = e.$delegateTarget.val()
        var index = e.$delegateTarget.attr('data-index')

        this.dispatch('/colorstep/setStep', undefined, percent, index);
    }

    'click $colorsteps .remove-step' (e) {
        var index = e.$delegateTarget.attr('data-index')
        this.dispatch('/colorstep/remove', index);
        this.emit('initLayer')
    }

}