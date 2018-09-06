import Color from '../../util/Color'

import BaseColorPicker from '../BaseColorPicker'
import Dom from '../../util/Dom';

export default class ColorPicker extends BaseColorPicker {
    constructor(opt) {
        super(opt);
        
        this.initialize();
    }

    template () {
        return `
            <div class='colorpicker-body'>
                <div class="colorwheel" style="padding:10px;">
                    <canvas ref="$colorwheel" width="204px" height="204px" style="border-radius:50%;"></canvas>
                </div>
            </div>
        `
    }

    components() {
        return { 

        }
    }

    initialize() {

        // root 만들기 
        super.initialize()

        this.render()

        this.$root.append(this.$el)

        // this.initColor(this.opt.color);


        // 이벤트 연결 
        this.initializeEvent();        

        this.renderCanvas()        
    }

    renderCanvas () {

        const $canvas = this.refs.$colorwheel
        // console.log($canvas);
        const context = $canvas.el.getContext('2d')

        const [width, height] = $canvas.size()

        // console.log(width, height);


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
                hue = (Math.atan2(ry, rx) * 180 / Math.PI);

                if (hue < 0) {   // 각도가 0보다 작으면 360 에서 반전시킨다. 
                    hue = 360 - Math.abs(hue)
                }
                var rgb = Color.HSVtoRGB(
                    hue,     // 0~360 hue 
                    Math.min(Math.sqrt(d) / radius, 1),     // 0..1 Saturation 
                    1  //  0..1 Value
                );

                var index = (y * width + x) * 4; 
                pixels[index + 0] = rgb.r;
                pixels[index + 1] = rgb.g;
                pixels[index + 2] = rgb.b;
                pixels[index + 3] = 255;
            }
        }


        context.putImageData(img,0, 0)

    }

    setColor(value, isDirect = false) {

        if (typeof (value) == "object") {
            if (!value.r || !value.g || !value.b)
                return;

            if (isDirect) {
                this.callbackColorValue(Color.format(value, "hex"));
            } else {
                this.initColor(Color.format(value, "hex"));
            }

        } else if (typeof (value) == "string") {

            if (isDirect) {
                this.callbackColorValue(value);
            } else {
                this.initColor(value);
            }



        }
    }

    getColor(type) {
        this.caculateHSV();
        var rgb = this.convertRGB();

        if (type) {
            return Color.format(rgb, type);
        }

        return rgb;
    }


    convertRGB() {
        return Color.HSVtoRGB(this.currentH, this.currentS, this.currentV);
    }

    convertHEX() {
        return Color.format(this.convertRGB(), 'hex');
    }

    convertHSL() {
        return Color.HSVtoHSL(this.currentH, this.currentS, this.currentV);
    }

    getFormattedColor(format) {
        format = format || 'hex';

        if (format == 'rgb') {
            var rgb = this.convertRGB();
            rgb.a = this.currentA;
            return Color.format(rgb, 'rgb');
        } else if (format == 'hsl') {
            var hsl = this.convertHSL();
            hsl.a = this.currentA;
            return Color.format(hsl, 'hsl');
        } else {
            var rgb = this.convertRGB();
            return Color.format(rgb, 'hex');
        }
    }



    setInputColor(isNoInputColor) {
        // this.information.setInputColor(isNoInputColor);
        // this.control.setInputColor(isNoInputColor);

        this.callbackColorValue();
    }

    changeInputColorAfterNextFormat() {
        // this.control.setInputColor();

        this.callbackColorValue();
    }

    callbackColorValue(color) {

        color = color || this.getCurrentColor();


        if (!isNaN(this.currentA)) {
            if (typeof this.opt.onChange == 'function') {
                this.opt.onChange.call(this, color);
            }
    
            if (typeof this.colorpickerCallback == 'function') {
                this.colorpickerCallback(color);
            }        

        }
    }

    setCurrentHSV(h, s, v, a) {
        this.currentA = a;
        this.currentH = h;
        this.currentS = s ;
        this.currentV = v;
    }


    setCurrentH(h) {
        this.currentH = h;
    }

    setCurrentA(a) {
        this.currentA = a;
    }

    getHSV(colorObj) {
        if (colorObj.type == 'hsl') {
            return Color.HSLtoHSV(colorObj);
        } else {
            return Color.RGBtoHSV(colorObj);
        }

    }

    initColor(newColor, format) {
        let c = newColor || "#FF0000", colorObj = Color.parse(c);
        format = format || colorObj.type;

        let hsv = this.getHSV(colorObj);
        this.setCurrentHSV(hsv.h, hsv.s, hsv.v, colorObj.a);
    }

    getColorSetsList() {
        return this.colorSetsList.getColorSetsList();
    }

    setCurrentColorSets(nameOrIndex) {
        this.colorSetsList.setCurrentColorSets(nameOrIndex);
        // this.currentColorSets.load();
    }

    setColorSets(list) {
        this.colorSetsList.setUserList(list);
    }

     // Event Bindings 
     'mouseup document' (e) {

        // when color picker clicked in outside
        if (this.checkInHtml(e.target)) {
            //this.setHideDelay(hideDelay);
        } else if (this.checkColorPickerClass(e.target) == false) {
            this.hide();
        }
    }

}