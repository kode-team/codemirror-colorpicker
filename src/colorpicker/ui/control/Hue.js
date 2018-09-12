
import Event from '../../../util/Event'
import BaseSlider from '../../BaseSlider';

const source = 'chromedevtool-control-Hue';

export default class Hue extends BaseSlider {
    template () {
        return `
            <div class="hue">
                <div ref="$container" class="hue-container">
                    <div ref="$bar" class="drag-bar"></div>
                </div>
            </div>
        `
    }

    refresh () {
        this.setColorUI();
    }
 
    setColorUI(h) {
    
        h = h || this.$store.hsv.h; 

        if (h == 0) {
            this.refs.$bar.addClass('first').removeClass('last')
        } else if (h == 360) {
            this.refs.$bar.addClass('last').removeClass('first')
        } else {
            this.refs.$bar.removeClass('last').removeClass('first')
        }

        var x = this.state.get('$container.width') * ( h / 360);      

        this.refs.$bar.css({
            left : (x) + 'px'
        });
    
        this.pos = { x };
        
    }
        
    setHueColor(e) {

        if (!this.state.get('$container.width')) return;

        var current = e ? Event.pos(e).pageX : this.getCurrent(this.$store.hsv.h / 360);
        var dist = this.getDist(current);
    
        this.setColorUI(dist/100 * 360);

        this.$store.dispatch('/changeColor',{
            h: (dist/100) * 360,
            type: 'hsv',
            source
        })
    }     

    onDragStart (e) {
        this.setHueColor(e);
    }

    onDragMove (e) {
        this.setHueColor(e);
    }

    '@changeColor' (sourceType) {
        if (source != sourceType) {
            this.refresh()
        }
    }

    '@initColor' () { this.refresh() }    

}
