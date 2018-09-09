import Color from '../util/Color'
import HueColor from '../util/HueColor'

export default class ColorManager {
    constructor (color) {
        this.color = color; 
        this.callbacks = [] 
        this.rgb = {}
        this.hsl = {}
        this.hsv = {}
        this.alpha = 1 
        this.initialize()
    }

    initialize () {        
        this.changeColor(this.color);
    }

    changeFormat (format) {
        this.format = format;

        this.emit('changeFormat');
    }

    isUndefined (v) {
        return typeof v == 'undefined' || v == null;  
    }

    changeColor (colorObj, source) {

        colorObj = colorObj || '#FF0000'

        if (typeof colorObj == 'string') {
            colorObj = Color.parse(colorObj);
        }

        colorObj.source = colorObj.source || source 

        console.log('set',colorObj, colorObj.a);

        this.alpha = this.isUndefined(colorObj.a) ? this.alpha : colorObj.a; 
        this.format = colorObj.type != 'hsv' ? (colorObj.type || this.format) : this.format;

        if (this.format == 'hex' && this.alpha < 1) {
            this.format = 'rgb';
        }

        if (colorObj.type == 'hsl') {
            this.hsl = Object.assign(this.hsl, colorObj); 
            this.rgb = Color.HSLtoRGB(this.hsl);
            this.hsv = Color.HSLtoHSV(colorObj);            
        } else if (colorObj.type == 'hex') {
            this.rgb = Object.assign(this.rgb, colorObj);
            this.hsl = Color.RGBtoHSL(this.rgb);
            this.hsv = Color.RGBtoHSV(colorObj);            
        } else if (colorObj.type == 'rgb') {
            this.rgb = Object.assign(this.rgb, colorObj);
            this.hsl = Color.RGBtoHSL(this.rgb);            
            this.hsv = Color.RGBtoHSV(colorObj);            
        } else if (colorObj.type == 'hsv') {
            this.hsv = Object.assign(this.hsv, colorObj);
            this.rgb = Color.HSVtoRGB(this.hsv);
            this.hsl = Color.HSVtoHSL(this.hsv);
        }

        console.log('alpha', this.alpha)

        this.emit('change', colorObj.source);
    }

    getHueColor () {
        return HueColor.checkHueColor(this.hsv.h/360);
    }

    toString (type) {
        type = type || this.format
        var colorObj = this[type] || this.rgb
        return Color.format(Object.assign({}, colorObj, {a: this.alpha} ), type);
    }

    toRGB () {
        return this.toString('rgb')
    }

    toHSL () {
        return this.toString('hsl')
    }

    toHEX () {
        return this.toString('hex')
    }

    on (event, callback) {
        this.callbacks.push({ event, callback })
    }

    off (event, callback) {

        if (arguments.length == 0) {
            this.callbacks = [] 
        } else if (arguments.length == 1) {
            this.callbacks = this.callbacks.filter(f => {
                return f.event != event 
            })
        } else if (arguments.length == 2) {
            this.callbacks = this.callbacks.filter(f => {
                return f.event != event && f.callback != callback 
            })
        }


    }

    emit () {
        var args = [...arguments];
        var event = args.shift();

        this.callbacks.filter(f => {
            return (f.event == event)
        }).forEach(f => {
            f.callback(...args);
        })
    }
}