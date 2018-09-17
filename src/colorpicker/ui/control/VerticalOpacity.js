
import Color from '../../../util/Color'
import Event from '../../../util/Event'
import VerticalSlider from '../../VerticalSlider';

export default class Opacity extends VerticalSlider {

    constructor (opt) {
        super(opt)

        this.source = 'vertical-opacity-control'
    }

    template () {
        return `
        <div class="opacity">
            <div ref="$container" class="opacity-container">
                <div ref="$colorbar" class="color-bar"></div>
                <div ref="$bar" class="drag-bar2"></div>
            </div>
        </div>
        `
    }

    refresh () {
        super.refresh() 
        this.setOpacityColorBar()
    }

    setOpacityColorBar() {
        var rgb = Object.assign({}, this.$store.rgb);
    
        rgb.a = 0;
        var start = Color.format(rgb, 'rgb');
    
        rgb.a = 1;
        var end = Color.format(rgb, 'rgb');
    
        this.refs.$colorbar.css('background',  'linear-gradient(to top, ' + start + ', ' + end + ')');
    }

    getDefaultValue () {
        return this.$store.alpha
    }

    refreshColorUI(e) {
        var dist = this.getCaculatedDist(e)

        this.setColorUI(  ( dist/100 * this.maxValue) );

        this.changeColor({
            a: Math.floor(dist) / 100 * this.maxValue
        })
    }
}
