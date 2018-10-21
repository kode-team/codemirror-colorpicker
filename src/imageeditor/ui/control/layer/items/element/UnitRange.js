import UIElement from "../../../../../../colorpicker/UIElement";
import { 
    px2em, px2percent, 
    percent2em, percent2px, 
    em2percent, em2px 
} from "../../../../../../util/filter/functions";
import { parseParamNumber } from "../../../../../../util/gl/filter/util";

const unit_names = {
    'percent' : '%',
    'px' : 'px',
    'em': 'em'
}

export default class UnitRange extends UIElement {


    created () {
        this.min = this.props.min || 0; 
        this.max = this.props.max || 1000;
        this.step = this.props.step || 1;
        this.value = this.props.value || 0;
        this.unit = this.props.unit || 'px' 
        this.showClass = 'show'
        this.maxValueFunction = this.parent[this.props.maxvaluefunction].bind(this.parent);
        this.updateFunction = this.parent[this.props.updatefunction].bind(this.parent);
    }

    afterRender () {
        this.initializeRangeMax(this.unit);
    }
    
    template () {

        return `
            <div class='unit-range'>
                <div class='base-value'>
                    <input ref="$range" type="range" class='range' min="${this.min}" max="${this.max}" step="${this.step}" value="${this.value}" />
                    <input ref="$number" type="number" class='number' min="${this.min}" max="${this.max}" step="${this.step}" value="${this.value}"  />
                    <button ref="$unit" type="button" class='unit'>${this.unit}</button>
                </div>
                <div class="multi-value" ref="$multiValue">
                    <div ref="$px" class="px" unit='px'></div>
                    <div ref="$percent" class="percent" unit='percent'></div>
                    <div ref="$em" class="em" unit='em'></div>
                </div>
            </div>
        `
    } 

    'click $multiValue div' (e) {
        var unit = e.$delegateTarget.attr('unit');
        var value = e.$delegateTarget.attr('value');

        this.selectUnit(unit, value);
    }

    refresh (value = '') {
        value = value || '' 
        var unit = 'px' 
        if (value.includes('%')) {
            unit = 'percent'
        } else if (value.includes('em')) {
            unit = 'em'
        }

        this.selectUnit(unit, parseParamNumber(value));
    }
    
    initializeRangeMax (unit) {
        
        if (unit == 'percent') {
            this.refs.$range.attr('max', 300);
            this.refs.$range.attr('step', 0.01);
            this.refs.$number.attr('max', 300);
            this.refs.$number.attr('step', 0.01);
        } else if (unit == 'px') {
            this.refs.$range.attr('max', 1000);
            this.refs.$range.attr('step', 1);
            this.refs.$number.attr('max', 1000);
            this.refs.$number.attr('step', 1);
        } else if (unit == 'em') {
            this.refs.$range.attr('max', 300);
            this.refs.$range.attr('step', 0.01);
            this.refs.$number.attr('max', 300);
            this.refs.$number.attr('step', 0.01);            
        }
    }

    selectUnit (unit, value) {
        this.unit = unit;         
        this.value = value; 

        this.refs.$range.val(this.value);
        this.refs.$number.val(this.value);
        this.refs.$unit.text(unit_names[this.unit]);

        this.initializeRangeMax(this.unit);
    }
    'click $unit' (e) {
        this.$el.toggleClass(this.showClass);
        this.updateRange();
    }

    updateRange () {
        var unit = this.unit; 
        var px = unit == 'px' ? this.refs.$range.val() : undefined;
        var percent = unit == 'percent' ? this.refs.$range.val() : undefined;
        var em = unit == 'em' ? this.refs.$range.val() : undefined;
        var maxValue = this.maxValueFunction();

        if (px) { 
            this.refs.$px.text(px + ' px').attr('value', px);
            this.refs.$percent.text(px2percent(px, maxValue) + ' %').attr('value', px2percent(px, maxValue)) 
            this.refs.$em.text(px2em(px, maxValue) + ' em').attr('value', px2em(px, maxValue)) 
        } else if (percent) { 
            this.refs.$percent.text(percent + ' %').attr('value', percent)
            this.refs.$px.text(percent2px(percent, maxValue) + ' px').attr('value', percent2px(percent, maxValue))
            this.refs.$em.text(percent2em(percent, maxValue) + ' em').attr('value', percent2em(percent, maxValue))
        } else if (em) { 
            this.refs.$em.text(em + ' em').attr('value', em); 
            this.refs.$percent.text(em2percent(em, maxValue) + ' %').attr('value', em2percent(em, maxValue))
            this.refs.$px.text(em2px(em, maxValue) + ' px').attr('value', em2px(em, maxValue))            
        }
    }

    'input $range' (e) {
        this.refs.$number.val(this.refs.$range.val())
        this.updateRange();    
        this.updateFunction(this.refs.$range.val() + unit_names[this.unit]);    
    }

    'input $number' (e) {
        this.refs.$range.val(this.refs.$number.val())
        this.updateRange();        
        this.updateFunction(this.refs.$range.val() + unit_names[this.unit]);
    }    
}