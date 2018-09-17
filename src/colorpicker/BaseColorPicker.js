import Dom from '../util/Dom'
import ColorSetsList from './module/ColorSetsList'
import UIElement from './UIElement'
import ColorManager from './module/ColorManager';
import BaseStore from './BaseStore';

export default class BaseColorPicker extends UIElement {

    constructor (opt) {
        super(opt);

        this.isColorPickerShow = false;
        this.isShortCut = false;
        this.hideDelay = +(typeof this.opt.hideDeplay == 'undefined' ? 2000 : this.opt.hideDelay);
        this.timerCloseColorPicker;
        this.autoHide = this.opt.autoHide || true;
        this.outputFormat = this.opt.outputFormat
        this.$checkColorPickerClass = this.checkColorPickerClass.bind(this);

    }

    initialize () {
        this.$body = null;
        this.$root = null; 
        
        this.$store = new BaseStore({
            modules: [
                ColorManager,
                ColorSetsList
            ]
        });

        this.callbackChange = () => {
            this.callbackColorValue()
        }

        this.colorpickerShowCallback = function () { };
        this.colorpickerHideCallback = function () { };           


        this.$body = new Dom(this.getContainer());
        this.$root = new Dom('div', 'codemirror-colorpicker');

        //  append colorpicker to container (ex : body)
        if (this.opt.position == 'inline') {
            this.$body.append(this.$root);
        }

        if (this.opt.type) {    // to change css style
            this.$root.addClass(this.opt.type);
        }

        if (this.opt.hideInformation) {
            this.$root.addClass('hide-information')
        }

        if (this.opt.hideColorsets) {
            this.$root.addClass('hide-colorsets')
        }        

        this.$arrow = new Dom('div', 'arrow');
        
        this.$root.append(this.$arrow);

        this.$store.dispatch('/setUserPalette', this.opt.colorSets);

        this.render()

        this.$root.append(this.$el)

        this.initColorWithoutChangeEvent(this.opt.color);

        // 이벤트 연결 
        this.initializeEvent();           

    }

    initColorWithoutChangeEvent (color) {
        this.$store.dispatch('/initColor', color);
    }

    /** 
     * public method 
     * 
     */

    /**
     * 
     * show colorpicker with position  
     * 
     * @param {{left, top, hideDelay, isShortCut}} opt 
     * @param {String|Object} color  
     * @param {Function} showCallback  it is called when colorpicker is shown
     * @param {Function} hideCallback  it is called once when colorpicker is hidden
     */
    show(opt, color, showCallback, hideCallback) {

        // 매번 이벤트를 지우고 다시 생성할 필요가 없어서 초기화 코드는 지움. 
        // this.destroy();
        // this.initializeEvent();
        // define colorpicker callback
        this.colorpickerShowCallback = showCallback;
        this.colorpickerHideCallback = hideCallback;        
        this.$root.css(this.getInitalizePosition()).show();

        this.definePosition(opt);

        this.isColorPickerShow = true;
        this.isShortCut = opt.isShortCut || false;
        this.outputFormat = opt.outputFormat  

        // define hide delay
        this.hideDelay = +(typeof opt.hideDelay == 'undefined' ? 2000 : opt.hideDelay );
        if (this.hideDelay > 0) {
            this.setHideDelay(this.hideDelay);
        }        
        
        this.$root.appendTo(this.$body);

        this.initColorWithoutChangeEvent(color);
    }     

    /**
     * 
     * initialize color for colorpicker
     * 
     * @param {String|Object} newColor 
     * @param {String} format  hex, rgb, hsl
     */
    initColor(newColor, format) {
        this.$store.dispatch('/changeColor', newColor, format);
    }


    /**
     * hide colorpicker 
     * 
     */
    hide() {
        if (this.isColorPickerShow) {
            // this.destroy();
            this.$root.hide();
            this.$root.remove();  // not empty 
            this.isColorPickerShow = false;

            this.callbackHideColorValue()
        }
    }

    /**
     * set to colors in current sets that you see 
     * @param {Array} colors 
     */
    setColorsInPalette (colors = []) {
        this.$store.dispatch('/setCurrentColorAll', colors);
    }    

    /**
     * refresh all color palette 
     * 
     * @param {*} list 
     */
    setUserPalette (list = []) {
        this.$store.dispatch('/setUserPalette', list);
    }


    /**
     * private method 
     */

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
        return this.$store.dispatch('/toColor', type);
    }

    definePositionForArrow(opt, elementScreenLeft, elementScreenTop) {
        // console.log(arguments)
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

        // this.definePositionForArrow(opt, elementScreenLeft, elementScreenTop);
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

    callbackColorValue(color) {
        color = color || this.getCurrentColor();

        if (typeof this.opt.onChange == 'function') {
            this.opt.onChange.call(this, color);
        }

        if (typeof this.colorpickerShowCallback == 'function') {
            this.colorpickerShowCallback(color);
        }        
    }

    callbackHideColorValue(color) {
        color = color || this.getCurrentColor();
        if (typeof this.opt.onHide == 'function') {
            this.opt.onHide.call(this, color);
        }

        if (typeof this.colorpickerHideCallback == 'function') {
            this.colorpickerHideCallback(color);
        }        
    }    

    getCurrentColor() {
        return this.$store.dispatch('/toColor', this.outputFormat);
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

    initializeStoreEvent () {
        super.initializeStoreEvent()

        this.$store.on('changeColor', this.callbackChange)
        this.$store.on('changeFormat', this.callbackChange)        
    }
 
    destroy() {
        super.destroy();

        this.$store.off('changeColor', this.callbackChange);
        this.$store.off('changeFormat', this.callbackChange);

        this.callbackChange = undefined; 

        // remove color picker callback
        this.colorpickerShowCallback = undefined;
        this.colorpickerHideCallback = undefined;   
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