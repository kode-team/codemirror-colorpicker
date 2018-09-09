
import Color from '../../../util/Color'
import Event from '../../../util/Event'
import UIElement from '../../UIElement';

const source = 'chromedevtool-control-Opacity';

export default class Opacity extends UIElement {
    constructor (opt) {
        super(opt);
        this.initialize();
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
    
    initialize () {
        this.pos = {}    

        this.$store.$ColorManager.on('change', (sourceType) => {
            if (source != sourceType) {
                this.refresh()
            }
        })
    }

    refresh () {
        this.setColorUI();
        this.setOpacityColorBar()
    }

    setOpacityColorBar() {
        var rgb = Object.assign({}, this.$store.$ColorManager.rgb);
    
        rgb.a = 0;
        var start = Color.format(rgb, 'rgb');
    
        rgb.a = 1;
        var end = Color.format(rgb, 'rgb');
    
        this.refs.$colorbar.css('background',  'linear-gradient(to right, ' + start + ', ' + end + ')');
    }
    
    setOpacity(e) {
        var min = this.refs.$container.offset().left;
        var max = min + this.state.get('$container.width');
        var current = e ? Event.pos(e).pageX : min + (max - min) * (this.$store.$ColorManager.alpha);
        var dist;
    
        var dist;
        if (current < min) {
            dist = 0;
            this.refs.$bar.addClass('first').removeClass('last')
        } else if (current > max) {
            dist = 100;
            this.refs.$bar.addClass('last').removeClass('first')
        } else {
            dist = (current - min) / (max - min) * 100;
            this.refs.$bar.removeClass('first').removeClass('last')
        }  


    
        this.setColorUI(dist/100);

        this.$store.$ColorManager.changeColor({
            a: Math.floor(dist) / 100,
            source
        })

    }
 
    setColorUI(alpha) {
        alpha = alpha || this.$store.$ColorManager.alpha

        var x = this.state.get('$container.width') * (alpha || 0);
        this.refs.$bar.css({ left : (x) + 'px' });
        this.pos = { x };
    }

    // Event Bindings 
    'mouseup document' (e) {
        this.isDown = false;
    }

    'mousemove document' (e) {
        if (this.isDown) {
            this.setOpacity(e);
        }
    }
    
    'mousedown $bar' (e) {
        e.preventDefault();
        this.isDown = true; 
    }
    
    'mousedown $container' (e) {
        this.isDown = true; 
        this.setOpacity(e);
    }    
}
