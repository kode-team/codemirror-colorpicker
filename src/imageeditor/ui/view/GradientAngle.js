import {getXYInCircle, caculateAngle} from '../../../util/functions/math'
import UIElement from '../../../colorpicker/UIElement';

export default class GradientAngle extends UIElement {

    template () {
        return `
            <div class='drag-angle-rect'>
                <div class="drag-angle" ref="$dragAngle">
                    <div ref="$angleText" class="angle-text"></div>
                    <div ref="$dragPointer" class="drag-pointer"></div>
                </div>
            </div>
        `
    }

    refresh () {

        if (this.isShow()) {
            this.$el.show();

            this.refreshUI()            
        } else {
            this.$el.hide();
        }
    }

    isShow () {
        if (!this.read('/item/is/mode', 'image')) return false; 

        var item = this.read('/item/current/image')

        if (!item) return false; 

        if (!this.read('/image/type/isLinear', item.type)) {
            return false; 
        }

        return this.read('/tool/get', 'guide.angle')
    }

    getCurrentXY(e, angle, radius, centerX, centerY) {
        return e ? e.xy : getXYInCircle(angle, radius, centerX, centerY)
    }

    getRectangle () {
        var width = this.refs.$dragAngle.width();  
        var height = this.refs.$dragAngle.height();  
        var radius = Math.floor(width/2 * 0.7); 
        var {left, top} = this.refs.$dragAngle.offset();
        var minX = left; 
        var minY = top; 
        var centerX = minX + width / 2;
        var centerY = minY + height / 2;

        return { minX, minY, width, height, radius,  centerX, centerY }
    }    

    getDefaultValue() {
        return this.read('/item/current/image').angle - 90
    }

    refreshAngleText (angleText) {
        this.refs.$angleText.text(angleText + ' °') 
    }

    refreshUI (e) {
        var { minX, minY, radius,  centerX, centerY } = this.getRectangle()
        var { x , y } = this.getCurrentXY(e, this.getDefaultValue(), radius, centerX, centerY)

        var rx = x - centerX, ry = y - centerY, angle = caculateAngle(rx, ry);

        {
            var { x, y } = this.getCurrentXY(null, angle, radius, centerX, centerY);
        }

        // set drag pointer position 
        this.refs.$dragPointer.px('left', x - minX);
        this.refs.$dragPointer.px('top', y - minY);

        var lastAngle = Math.round(angle + 90) % 360;

        this.refreshAngleText (lastAngle)

        if (e) {

            this.setAngle (lastAngle)
        }

    }

    setAngle (angle) {

        var item = this.read('/item/current/image')

        if (!item) return; 

        item.angle = angle; 

        this.dispatch('/item/set', item);

    }

    '@changeEditor' () {
        this.refresh()
    } 

    '@changeTool' () {
        this.$el.toggle(this.isShow())
    }

    // Event Bindings 
    'pointerend document' (e) {
        this.isDown = false ;
    }

    'pointermove document' (e) {
        if (this.isDown) {
            this.refreshUI(e);
        }
    }

    'pointerstart $drag_pointer' (e) {
        e.preventDefault();
        this.isDown = true; 
    }

    'pointerstart $el' (e) {
        this.isDown = true; 
        this.refreshUI(e);        
    }     

}