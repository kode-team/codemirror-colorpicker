import UIElement from '../UIElement';
import Event from '../../util/Event'

export default class ColorPalette extends UIElement {

    template () {
        return `
        <div class="color">
            <div ref="$saturation" class="saturation">
                <div ref="$value" class="value">
                    <div ref="$drag_pointer" class="drag-pointer"></div>
                </div>
            </div>        
        </div>        
        `
    }

    setBackgroundColor (color) {
        this.$el.css("background-color", color);
    }

    refresh () {
        this.setColorUI();
    }

    caculateSV () {
        var pos = this.drag_pointer_pos || { x : 0, y : 0 };

        var width = this.$el.width();
        var height = this.$el.height();

        var s = (pos.x / width);
        var v = ((height - pos.y) / height);

        this.dispatch('/changeColor', {
            type: 'hsv',
            s,
            v
        })        
    }

    setColorUI() {
        var  x = this.state.get('$el.width') * this.$store.hsv.s, 
        y = this.state.get('$el.height') * ( 1 - this.$store.hsv.v );
    
        this.refs.$drag_pointer.px('left', x);
        this.refs.$drag_pointer.px('top', y);
    
        this.drag_pointer_pos = { x , y };

        this.setBackgroundColor(this.read('/getHueColor'))
    }


    setMainColor(e) {
        // e.preventDefault();
        var pos = this.state.get('$el.offset')
        var w = this.state.get('$el.contentWidth');
        var h = this.state.get('$el.contentHeight');

        var x = Event.pos(e).pageX - pos.left;
        var y = Event.pos(e).pageY - pos.top;

        if (x < 0) x = 0;
        else if (x > w) x = w;
    
        if (y < 0) y = 0;
        else if (y > h) y = h;
    
        this.refs.$drag_pointer.px('left', x)
        this.refs.$drag_pointer.px('top', y)
    
        this.drag_pointer_pos = { x , y }

        this.caculateSV()
    }    

    '@changeColor' () {
        this.refresh()
    }

    '@initColor' () { this.refresh() }    

    'pointerend document' (e) {
        this.isDown = false; 
    }    

    'pointermove document' (e) {
        if (this.isDown) {
            this.setMainColor(e);
        }
    }

    'pointerstart' (e) {
        this.isDown = true; 
        this.setMainColor(e);
    }
    
    'pointerend' (e) {
        this.isDown = false; 
    }

}
