
import Color from '../../../util/Color'
import Event from '../../../util/Event'
import VerticalSlider from '../../VerticalSlider';

const source = 'chromedevtool-control-Opacity';

export default class Opacity extends VerticalSlider {

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
        this.setColorUI();
        this.setOpacityColorBar()
    }

    setOpacityColorBar() {
        var rgb = Object.assign({}, this.$store.rgb);
    
        rgb.a = 0;
        var start = Color.format(rgb, 'rgb');
    
        rgb.a = 1;
        var end = Color.format(rgb, 'rgb');
    
        this.refs.$colorbar.css('background',  'linear-gradient(to bottom, ' + start + ', ' + end + ')');
    }
    
    setOpacity(e) {
        var current = e ? Event.pos(e).pageY : this.getCurrent(this.$store.alpha);
        var dist = this.getDist(current);

        this.setColorUI(dist/100);

        this.$store.dispatch('/changeColor', {
            a: Math.floor(dist) / 100,
            source
        })

    }
 
    setColorUI(alpha) {
        alpha = alpha || this.$store.alpha

        if (alpha == 0) {
            this.refs.$bar.addClass('first').removeClass('last')
        } else if (alpha == 1) {
            this.refs.$bar.addClass('last').removeClass('first')
        } else {
            this.refs.$bar.removeClass('last').removeClass('first')
        }        

        var y = this.getMaxDist() * (alpha || 0);
        this.refs.$bar.css({ top : (y) + 'px' });
        this.pos = { y };
    }

    '@changeColor' (sourceType) {
        if (source != sourceType) {
            this.refresh()
        }
    }

    '@initColor' () { this.refresh() }    

    onDragMove (e) {
        this.setOpacity(e);
    }

    onDragStart (e) {
        this.setOpacity(e);
    }

}
