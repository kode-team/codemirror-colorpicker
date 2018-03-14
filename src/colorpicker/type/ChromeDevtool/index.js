import Color from '../../../util/Color'
import Dom from '../../../util/Dom'
import Event from '../../../util/Event'
import EventMachin from '../../../util/EventMachin'

import ColorControl from './ChromeColorControl'
import ColorInformation from './ChromeColorInformation'
import ColorPalette from './ChromeColorPalette'
import ColorSetsChooser from './ChromeColorSetsChooser'
import ColorSetsList from './ChromeColorSetsList'
import CurrentColorSets from './ChromeCurrentColorSets'
import CurrentColorSetsContextMenu from './ChromeCurrentColorSetsContextMenu'

export default class ChromeDevtool extends EventMachin {
    constructor (opt) {
        super();

        this.opt = opt || {}; 
        this.$root = null;
        this.format = 'rgb';
        this.currentA = 0;
        this.currentH = 0;
        this.currentS = 0;
        this.currentV = 0;
        this.colorSetsList = new ColorSetsList(this);  
        this.colorpickerCallback = this.opt.onChange || (function () {});

        this.control = new ColorControl(this);
        this.palette = new ColorPalette(this);
        this.information = new ColorInformation(this);
        this.colorSetsChooser = new ColorSetsChooser(this);
        this.currentColorSets = new CurrentColorSets(this);
        this.contextMenu = new CurrentColorSetsContextMenu(this, this.currentColorSets);

        this.initialize();
    }

    getOption (key) {
        return this.opt[key];
    }

    initialize () {
        this.$root = new Dom('div', 'codemirror-colorpicker');

        this.$root.append(this.palette.$el);
        this.$root.append(this.control.$el);
        this.$root.append(this.information.$el);
        this.$root.append(this.currentColorSets.$el);
        this.$root.append(this.colorSetsChooser.$el);
        this.$root.append(this.contextMenu.$el);

        if (this.opt.target) {
            this.$root.appendTo(this.opt.target);
        }
        
                
        this.$checkColorPickerClass = this.checkColorPickerClass.bind(this);        

        this.initializeEvent();

        this.initColor(this.opt.color);        
    }

    showContextMenu (e, index) {
        this.contextMenu.show(e, index);
    }

    setColor(value) {
        if(typeof(value) == "object") {
            if(!value.r || !value.g || !value.b)
                return;

            this.initColor(Color.format(value, "hex"));
        } else if(typeof(value) == "string") {
            this.initColor(value); 
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

    definePositionForArrow (opt, elementScreenLeft, elementScreenTop) {
        //this.$arrow.css({})
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

    getCurrentColor () {
        return this.information.getFormattedColor();
    }

    getFormattedColor (format) {
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
        this.information.setInputColor(isNoInputColor);
        this.control.setInputColor(isNoInputColor);

        this.callbackColorValue();
    }    

    changeInputColorAfterNextFormat() {
        this.control.setInputColor();

        this.callbackColorValue();
    }        

    callbackColorValue () {
        if (typeof this.colorpickerCallback == 'function') {
            
            if (!isNaN(this.currentA)) {
                this.colorpickerCallback(this.getCurrentColor());
            }
    
        }
    }
    
    caculateHSV() {

        var obj = this.palette.caculateSV();
        var control = this.control.caculateH();

        var s = obj.s;
        var v = obj.v; 
        var h = control.h ;


        if (obj.width == 0) {
            h = 0;
            s = 0;
            v = 0;
        }

        this.currentH = h;
        this.currentS = s;
        this.currentV = v;
    }


    setColorUI() {        
        this.control.setColorUI()
        this.palette.setColorUI()
    }

    setCurrentHSV (h, s, v, a) {
        this.currentA = a;
        this.currentH = h;
        this.currentS = s;
        this.currentV = v;
    }    
        

    setCurrentH (h) {
        this.currentH = h;
    }

    setCurrentA ( a) {
        this.currentA = a;
    }

    setBackgroundColor (color) {
        this.palette.setBackgroundColor(color);
    }

    setCurrentFormat (format) {
        this.format = format; 
        this.information.setCurrentFormat(format);
    }

    getHSV (colorObj) {
        if (colorObj.type == 'hsl') {
            return Color.HSLtoHSV(colorObj.h, colorObj.s, colorObj.l);
        } else {
            return Color.RGBtoHSV(colorObj);
        } 

    }

    initColor(newColor, format) {
        let c = newColor || "#FF0000", colorObj = Color.parse(c);
        format = format || colorObj.type;

        console.log(colorObj);
    
        this.setCurrentFormat(format);

        let hsv = this.getHSV(colorObj);
        this.setCurrentHSV(hsv.h, hsv.s, hsv.v, colorObj.a);
        this.setColorUI();
        this.setHueColor();
        this.setInputColor(); 
    }    

    changeInformationColor(newColor) {
        let c = newColor || "#FF0000", colorObj = Color.parse(c);
    
        let hsv = this.getHSV(colorObj);
        this.setCurrentHSV(hsv.h, hsv.s, hsv.v, colorObj.a);
        this.setColorUI();
        this.setHueColor();
        this.control.setInputColor();
        this.callbackColorValue();
    }        

    setHueColor () {
        this.control.setOnlyHueColor();
    }

    checkColorPickerClass(el) {
        var hasColorView = new Dom(el).closest('codemirror-colorview');
        var hasColorPicker = new Dom(el).closest('codemirror-colorpicker');
        var hasCodeMirror = new Dom(el).closest('CodeMirror');
        var IsInHtml = el.nodeName == 'HTML';
    
        return !!(hasColorPicker || hasColorView || hasCodeMirror);
    }
    
    checkInHtml (el) {
        var IsInHtml = el.nodeName == 'HTML';
    
        return IsInHtml;
    }    

    // Event Bindings 
    'mouseup document' (e) {
        this.palette.EventDocumentMouseUp(e);
        this.control.EventDocumentMouseUp(e);
    }

    'mousemove document' (e) {
        this.palette.EventDocumentMouseMove(e);
        this.control.EventDocumentMouseMove(e);
    }    

    initializeEvent () {

        this.initializeEventMachin();

        this.palette.initializeEvent();
        this.control.initializeEvent();
        this.information.initializeEvent()
        this.currentColorSets.initializeEvent() 
        this.colorSetsChooser.initializeEvent();
        this.contextMenu.initializeEvent();
    
    }

    currentFormat () {
        this.information.currentFormat();
    }

    toggleColorChooser () {
        this.colorSetsChooser.toggle();
    }

    refreshColorSetsChooser() {
        this.colorSetsChooser.refresh();
    }

    getColorSetsList () {
        return this.colorSetsList.getColorSetsList();
    }

    setCurrentColorSets (nameOrIndex) {
        this.colorSetsList.setCurrentColorSets(nameOrIndex);
        this.currentColorSets.refresh();
    }

    setColorSets (list) {
        this.colorSetsList.setUserList(list);
    } 

    destroy() {
        super.destroy();

        this.control.destroy();
        this.palette.destroy();
        this.information.destroy();
        this.colorSetsChooser.destroy();
        this.colorSetsList.destroy();
        this.currentColorSets.destroy();
        this.contextMenu.destroy();

        // remove color picker callback
        this.colorpickerCallback = undefined;
    }
}