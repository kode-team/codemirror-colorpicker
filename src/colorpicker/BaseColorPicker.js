import Color from '../util/Color'
import Dom from '../util/Dom'
import EventMachin from '../util/EventMachin'
import ColorSetsList from './ColorSetsList'


export default class BaseColorPicker extends EventMachin {
    constructor(opt) {
        super();

        this.opt = opt || {};
        this.$body = null;
        this.$root = null; 

        this.format = 'rgb';
        this.currentA = 0;
        this.currentH = 0;
        this.currentS = 0;
        this.currentV = 0;
        
        this.colorSetsList = new ColorSetsList(this);
        this.colorpickerShowCallback = function () { };
        this.colorpickerHideCallback = function () { };

        this.isColorPickerShow = false;
        this.isShortCut = false;
        this.hideDelay = +(typeof this.opt.hideDeplay == 'undefined' ? 2000 : this.opt.hideDelay);
        this.timerCloseColorPicker;
        this.autoHide = this.opt.autoHide || true;

    }

    initialize () {

        this.$body = new Dom(this.getContainer());
        this.$root = new Dom('div', 'codemirror-colorpicker');

        //  append colorpicker to container (ex : body)
        if (this.opt.position == 'inline') {
            this.$body.append(this.$root);
        }

        if (this.opt.type) {    // to change css style
            this.$root.addClass(this.opt.type);
        }

        this.$arrow = new Dom('div', 'arrow');
        
        this.$root.append(this.$arrow);
    }

    getOption(key) {
        return this.opt[key];
    }

    setOption (key, value) {
        this.opt[key] = value; 
    }

    isType (key) {
        return this.getOption('type') == key;
    }

    isPaletteType() {
        return this.isType('palette');
    }

    isSketchType() {
        return this.isType('sketch');
    }

    getContainer () {
        return this.opt.container || document.body;
    }

    getColor(type) {
        this.caculateHSV();
        var rgb = this.convertRGB();

        if (type) {
            return Color.format(rgb, type);
        }

        return rgb;
    }

    definePositionForArrow(opt, elementScreenLeft, elementScreenTop) {
        //this.$arrow.css({})
    }

    definePosition(opt) {

        var width = this.$root.width();
        var height = this.$root.height();

        // set left position for color picker
        var elementScreenLeft = opt.left - this.$body.scrollLeft();
        if (width + elementScreenLeft > window.innerWidth) {
            elementScreenLeft -= (width + elementScreenLeft) - window.innerWidth;
        }
        if (elementScreenLeft < 0) { elementScreenLeft = 0; }

        // set top position for color picker
        var elementScreenTop = opt.top - this.$body.scrollTop();
        if (height + elementScreenTop > window.innerHeight) {
            elementScreenTop -= (height + elementScreenTop) - window.innerHeight;
        }
        if (elementScreenTop < 0) { elementScreenTop = 0; }

        // set position
        this.$root.css({
            left: (elementScreenLeft) + 'px',
            top: (elementScreenTop) + 'px'
        });
    }

    getInitalizePosition() {
        if (this.opt.position == 'inline') {
            return {
                position: 'relative',
                left: 'auto',
                top: 'auto',
                display: 'inline-block'
            }
        } else {
           return {
                position: 'fixed',  // color picker has fixed position
                left: '-10000px',
                top: '-10000px'
            }
        }
    }

    show(opt, color, showCallback, hideCallback) {
        this.destroy();
        this.initializeEvent();
        this.$root.appendTo(this.$body);

        this.$root.css(this.getInitalizePosition()).show();

        this.definePosition(opt);

        this.isColorPickerShow = true;

        this.isShortCut = opt.isShortCut || false;

        this.initColor(color);

        // define colorpicker callback
        this.colorpickerShowCallback = showCallback;
        this.colorpickerHideCallback = hideCallback;        

        // define hide delay
        this.hideDelay = +(typeof opt.hideDelay == 'undefined' ? 2000 : opt.hideDelay );
        if (this.hideDelay > 0) {
            this.setHideDelay(this.hideDelay);
        }

    }

    setHideDelay(delayTime) {
        delayTime = delayTime || 0;

        const hideCallback = this.hide.bind(this);

        this.$root.off('mouseenter');
        this.$root.off('mouseleave');

        this.$root.on('mouseenter', () => {
            clearTimeout(this.timerCloseColorPicker);
        });

        this.$root.on('mouseleave', () => {
            clearTimeout(this.timerCloseColorPicker);
            this.timerCloseColorPicker = setTimeout(hideCallback, delayTime);
        });

        clearTimeout(this.timerCloseColorPicker);
        // this.timerCloseColorPicker = setTimeout(hideCallback, delayTime);
    }

    hide() {
        if (this.isColorPickerShow) {
            this.destroy();
            this.$root.hide();
            this.$root.remove();  // not empty 
            this.isColorPickerShow = false;

            this.callbackHideColorValue()
        }
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


    callbackColorValue(color) {
        color = color || this.getCurrentColor();
        if (!isNaN(this.currentA)) {
            if (typeof this.opt.onChange == 'function') {
                this.opt.onChange.call(this, color);
            }
    
            if (typeof this.colorpickerShowCallback == 'function') {
                this.colorpickerShowCallback(color);
            }        

        }
    }

    callbackHideColorValue(color) {
        color = color || this.getCurrentColor();
        if (!isNaN(this.currentA)) {
            if (typeof this.opt.onHide == 'function') {
                this.opt.onHide.call(this, color);
            }
    
            if (typeof this.colorpickerHideCallback == 'function') {
                this.colorpickerHideCallback(color);
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

    checkColorPickerClass(el) {
        var hasColorView = new Dom(el).closest('codemirror-colorview');
        var hasColorPicker = new Dom(el).closest('codemirror-colorpicker');
        var hasCodeMirror = new Dom(el).closest('CodeMirror');
        var IsInHtml = el.nodeName == 'HTML';

        return !!(hasColorPicker || hasColorView || hasCodeMirror);
    }

    checkInHtml(el) {
        var IsInHtml = el.nodeName == 'HTML';

        return IsInHtml;
    }

    initializeEvent() {

        this.initializeEventMachin();

    }

    setColorSets(list) {
        this.colorSetsList.setUserList(list);
    }

    setColorsInPalette (colors = []) {
        this.colorSetsList.setCurrentColorAll(colors);
    }    

    destroy() {
        super.destroy();

        // remove color picker callback
        this.colorpickerShowCallback = undefined;

        this.colorpickerHideCallback = undefined;   
    }
    
}