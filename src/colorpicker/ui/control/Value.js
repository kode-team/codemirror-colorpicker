
import Event from '../../../util/Event'
import BaseSlider from '../../BaseSlider';

const source = 'macos-control-Opacity';

export default class Value extends BaseSlider {

    template () {
        return `
            <div class="value">
                <div ref="$container" class="value-container">
                    <div ref="$bar" class="drag-bar"></div>
                </div>
            </div>
        `
    }

    setBackgroundColor () {
        this.refs.$container.css("background-color", this.$store.dispatch('/toRGB'));
    }


    refresh () {
        this.setColorUI();
        this.setBackgroundColor();
    }
 
    setColorUI(v) {
    
        v = v || (this.$store.hsv.v)

        if (v == 0) {
            this.refs.$bar.addClass('first').removeClass('last')
        } else if (v == 1) {
            this.refs.$bar.addClass('last').removeClass('first')            
        } else {
            this.refs.$bar.removeClass('last').removeClass('first')            
        }

        var valueX = this.state.get('$container.width') * v;

        this.refs.$bar.css({
            left : (valueX) + 'px'
        });
    
        this.pos = { x : valueX };
        
    }
        
    setValueForHSV(e) {

        if (!this.state.get('$container.width')) return;

        var current = e ? Event.pos(e).pageX : this.getCurrent(this.$store.hsv.v);
    
        var dist = this.getDist(current);

        this.setColorUI(dist/100)

        this.$store.dispatch('/changeColor', {
            type: 'hsv',
            v: dist/100,
            source
        })        
    }    

    '@changeColor' (sourceType) {
        if (source != sourceType) {
            this.refresh()
        }
    }

    '@initColor' () { this.refresh() }    

    onDragMove (e) {
        this.setValueForHSV(e);
    }

    onDragStart (e) {
        this.setValueForHSV(e);
    }
    
}
