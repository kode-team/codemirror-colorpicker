
import Color from '../../../util/Color'
import Event from '../../../util/Event'
import BaseSlider from '../../BaseSlider';

const source = 'chromedevtool-control-Opacity';

export default class Opacity extends BaseSlider {

    constructor (opt) {
        super(opt);

        this.minValue = 0;
        this.maxValue = 1; 
        this.source = 'opacity-control'
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
    
        this.setOpacityColorBarBackground(start, end);
    }

    setOpacityColorBarBackground(start, end) {
        this.refs.$colorbar.css('background',  'linear-gradient(to right, ' + start + ', ' + end + ')');
    }

    getDefaultValue () {
        return this.$store.alpha
    }
    
    refreshColorUI(e) {
        var dist = this.getCaculatedDist(e);

        this.setColorUI( (dist/100) * this.maxValue);

        this.changeColor({
            a: (Math.floor(dist) / 100) * this.maxValue
        })

    }

}
