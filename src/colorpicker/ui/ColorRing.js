import ColorWheel from './ColorWheel';
import { caculateAngle } from '../../util/functions/math';

export default class ColorRing extends ColorWheel {

    constructor (opt) {
        super(opt)

        this.width = 214;
        this.height = 214;
        this.thinkness = 16; 
        this.half_thinkness = this.thinkness / 2 
        this.source = 'colorring'
    }

    template () {
        return `
        <div class="wheel" data-type="ring">
            <canvas class="wheel-canvas" ref="$colorwheel" ></canvas>
            <div class="drag-pointer" ref="$drag_pointer"></div>
        </div>
        `
    }

    setColorUI(isEvent) {
        this.renderCanvas();        
        this.setHueColor(null, isEvent);
    }

    getDefaultValue () {
        return this.$store.hsv.h 
    }

    setHueColor (e, isEvent) {

        if (!this.state.get('$el.width')) return;

        var { minX, minY, radius,  centerX, centerY } = this.getRectangle()
        var { x , y } = this.getCurrentXY(
            e,  
            this.getDefaultValue(),
            radius, 
            centerX, 
            centerY
        )

        var rx = x - centerX, ry = y - centerY, hue = caculateAngle(rx, ry);

        {
            var { x, y } = this.getCurrentXY(null, hue, radius - this.half_thinkness, centerX, centerY);
        }
        

        // set drag pointer position 
        this.refs.$drag_pointer.css({
            left: (x - minX) + 'px',
            top: (y - minY) + 'px' 
        });

        if (!isEvent) {
            this.changeColor({
                type: 'hsv',
                h: hue
            })
        }
    } 
}
 