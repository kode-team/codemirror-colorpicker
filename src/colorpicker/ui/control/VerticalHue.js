import VerticalSlider from '../../VerticalSlider';

export default class VerticalHue extends VerticalSlider {

    constructor (opt) {
        super(opt)

        this.minValue = 0
        this.maxValue = 360 
        this.source = 'vertical-hue-control'
    }

    template () {
        return `
            <div class="hue">
                <div ref="$container" class="hue-container">
                    <div ref="$bar" class="drag-bar"></div>
                </div>
            </div>
        `
    }

    getDefaultValue () {
        return this.$store.hsv.h 
    }

    refreshColorUI(e) {

        var dist = this.getCaculatedDist(e)
    
        this.setColorUI( dist/100 * this.maxValue);

        this.changeColor({
            h: (dist/100) * this.maxValue,
            type: 'hsv'
        })
    }     

}
