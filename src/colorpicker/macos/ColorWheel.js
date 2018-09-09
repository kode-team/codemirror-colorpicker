
import Color from '../../util/Color'
import Event from '../../util/Event'
import UIElement from '../UIElement';

const source = 'macos-colorwheel'

export default class ColorWheel extends UIElement {
    constructor (opt) {
        super(opt);

        this.initialize()
    }  

    template () {
        return `
        <div class="wheel">
            <canvas class="wheel-canvas" ref="$colorwheel" ></canvas>
            <div class="wheel-canvas" ref="$valuewheel" ></div>
            <div class="drag-pointer" ref="$drag_pointer"></div>
        </div>
        `
    }

    initialize () {        
        this.$store.$ColorManager.on('change', (sourceType) => {
            if (source != sourceType) {
                this.refresh(true);
            }
        })      
    }

    refresh (isEvent) {
        this.setColorUI(isEvent);
    }

    setColorUI(isEvent) {
        this.renderCanvas();        
        this.renderValue()   
        this.setHueColor(null, isEvent);
    }


    renderValue () {
        var value = (1 - (this.$store.$ColorManager.hsv.v) );
        this.refs.$valuewheel.css({
            'background-color': `rgba(0, 0, 0, ${value})`
        })
    }

    renderCanvas () {
        
        // only once rendering 
        if (this.$store.createdWheelCanvas) return;


        const $canvas = this.refs.$colorwheel
        // console.log($canvas);
        const context = $canvas.el.getContext('2d')

        const [width, height] = $canvas.size()

        $canvas.el.width = width;
        $canvas.el.height = height;

        var img = context.getImageData(0, 0, width, height);
        var pixels = img.data;
        var half_width = Math.floor(width/2)
        var half_height = Math.floor(height/2)

        var radius = (width > height) ? half_height : half_width;
        var cx = half_width;
        var cy = half_height;

        for(var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var rx = x - cx + 1,
                ry = y - cy + 1,
                d = rx * rx + ry * ry,
                hue = this.radianToDegree(Math.atan2(ry, rx));

                var rgb = Color.HSVtoRGB(
                    hue,     // 0~360 hue 
                    Math.min(Math.sqrt(d) / radius, 1),     // 0..1 Saturation 
                    1  //  0..1 Value
                );

                var index = (y * width + x) * 4; 
                pixels[index] = rgb.r;
                pixels[index + 1] = rgb.g;
                pixels[index + 2] = rgb.b;
                pixels[index + 3] = 255;
            }
        }


        context.putImageData(img,0, 0)
        this.$store.createdWheelCanvas = true; 
    }


    degreeToRadian (angle) {
        return angle * Math.PI / 180;
    }

    /**
     * 
     * convert radian to degree 
     * 
     * @param {*} radian 
     * @returns {Number} 0..360
     */
    radianToDegree(radian) {
        var angle =  radian * 180 / Math.PI;


        if (angle < 0) {   // 각도가 0보다 작으면 360 에서 반전시킨다. 
            angle = 360 + angle
        }

        return angle; 
    }

    getX (angle, radius, centerX = 0) {
        return centerX + radius * Math.cos(this.degreeToRadian(angle))
    }

    getY (angle, radius, centerY = 0) {
        return centerY + radius * Math.sin(this.degreeToRadian(angle))
    }    

    setHueColor (e, isEvent) {

        if (!this.state.get('$el.width')) return;

        var width = this.state.get('$el.width');  
        var height = this.state.get('$el.height');  
        var radius = this.state.get('$colorwheel.width') / 2;  

        var minX = this.refs.$el.offset().left;
        var centerX = minX + width / 2;

        var minY = this.refs.$el.offset().top;
        var centerY = minY + height / 2;

        var x = e ? Event.pos(e).pageX : this.getX(this.$store.$ColorManager.hsv.h, this.$store.$ColorManager.hsv.s * radius, centerX)
        var y = e ? Event.pos(e).pageY : this.getY(this.$store.$ColorManager.hsv.h, this.$store.$ColorManager.hsv.s * radius, centerY)


        var rx = x - centerX,
        ry = y - centerY,
        d = rx * rx + ry * ry,
        hue = this.radianToDegree(Math.atan2(ry, rx));

        if (d > radius * radius) {
            x = this.getX(hue, radius, centerX);
            y = this.getY(hue, radius, centerY);
        }

        // saturation 을 
        var saturation = Math.min(Math.sqrt(d) / radius, 1)
        

        // set drag pointer position 
        this.refs.$drag_pointer.css({
            left: (x - minX) + 'px',
            top: (y - minY) + 'px' 
        });

        if (!isEvent) {
            this.$store.$ColorManager.changeColor({
                type: 'hsv',
                h: hue,
                s: saturation,
                source
            })
     
        }

    }


    // Event Bindings 
    'mouseup document' (e) {
        this.isDown = false ;
    }

    'mousemove document' (e) {
        if (this.isDown) {
            this.setHueColor(e);
        }
    }

    'mousedown $drag_pointer' (e) {
        e.preventDefault();
        this.isDown = true; 
    }

    'mousedown $el' (e) {
        this.isDown = true; 
        this.setHueColor(e);        
    }    
}
 