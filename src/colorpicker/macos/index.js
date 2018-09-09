import Color from '../../util/Color'
import BaseColorPicker from '../BaseColorPicker'

import ColorWheel from './ColorWheel'
import ColorControl from './ColorControl'

import ColorInformation from '../chromedevtool/ColorInformation'
import ColorSetsChooser from '../chromedevtool/ColorSetsChooser'
import CurrentColorSets from '../chromedevtool/CurrentColorSets'
import CurrentColorSetsContextMenu from '../chromedevtool/CurrentColorSetsContextMenu'

export default class MacOSColorPicker extends BaseColorPicker {
    constructor(opt) {
        super(opt);
         
        this.initialize();
    }
 
    template () {
        return `
            <div class='colorpicker-body'>
                <div target="colorwheel"></div>
                <div target="control"></div>
                <div target="information"></div>
                <div target="currentColorSets"></div>
                <div target="colorSetsChooser"></div>
                <div target="contextMenu"></div>                
            </div>
        `
    }

    components() {
        return { 
            colorwheel: ColorWheel,  
            control: ColorControl,
            information: ColorInformation,
            currentColorSets: CurrentColorSets,
            colorSetsChooser: ColorSetsChooser,
            contextMenu: CurrentColorSetsContextMenu
        }
    }

    initialize() {

        // root 만들기 
        super.initialize()

        this.render()

        this.$root.append(this.$el)

        this.$checkColorPickerClass = this.checkColorPickerClass.bind(this);

        this.initColor(this.opt.color);

        // 이벤트 연결 
        this.initializeEvent();        
    }


    showContextMenu(e, index) {
        this.contextMenu.show(e, index);
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

    toggleColorChooser() {
        this.colorSetsChooser.toggle();
    }

    refreshColorSetsChooser() {
        this.colorSetsChooser.load();
    }

    getColorSetsList() {
        return this.$store.$ColorSetsList.getColorSetsList();
    }

    setCurrentColorSets(nameOrIndex) {
        this.$store.$ColorSetsList.setCurrentColorSets(nameOrIndex);
        this.currentColorSets.load();
    }

    setColorSets(list) {
        this.$store.$ColorSetsList.setUserList(list);
    }

    setColorsInPalette (colors = []) {
        this.$store.$ColorSetsList.setCurrentColorAll(colors);
        this.currentColorSets.load()
        this.colorSetsChooser.load();
    }

    refreshValue () {
        this.colorwheel.renderValue()
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