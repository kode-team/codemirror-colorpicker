import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'

const color = ColorUtil.color;
const hue_color = ColorUtil.hue_color;

export default class ColorPallet {
    constructor (colorpicker) {

        this.colorpicker = colorpicker; 
        this.initialize();
    } 
    
    initialize () {
        this.$el = new Dom('div', 'color');
        this.$drag_pointer = new Dom('div', 'drag-pointer' );
        this.$value = new Dom( 'div', 'value' );
        this.$saturation = new Dom('div', 'saturation' );
    
        this.$value.append(this.$drag_pointer);
        this.$saturation.append(this.$value);
        this.$el.append(this.$saturation);

        this.$EventColorMouseDown = this.EventColorMouseDown.bind(this);
        this.$EventColorMouseUp = this.EventColorMouseUp.bind(this);        
    }

    setBackgroundColor (color) {
        this.$el.css("background-color", color);
    }

    refresh () {
        this.setColorUI();
    }

    caculateSV () {
        var pos = this.$drag_pointer.data('pos') || { x : 0, y : 0 };

        var width = this.$el.width();
        var height = this.$el.height();

        var s = (pos.x / width);
        var v = ((height - pos.y) / height);

        return { s , v, width, height }
    }

    setColorUI() {
        var  x = this.$el.width() * this.colorpicker.currentS, y = this.$el.height() * ( 1 - this.colorpicker.currentV );
    
        this.$drag_pointer.css({
            left : (x - 5) + "px",
            top : (y - 5) + "px"
        });
    
        this.$drag_pointer.data('pos', { x  : x, y : y });
    }


    setMainColor(e) {
        e.preventDefault();
        var pos = this.colorpicker.$root.position();         // position for screen
        var w = this.$el.width();
        var h = this.$el.height();
    
        var x = e.clientX - pos.left;
        var y = e.clientY - pos.top;
    
        if (x < 0) x = 0;
        else if (x > w) x = w;
    
        if (y < 0) y = 0;
        else if (y > h) y = h;
    
        this.$drag_pointer.css({
            left: (x - 5) + 'px',
            top: (y - 5) + 'px'
        });
    
        this.$drag_pointer.data('pos', { x: x, y : y});
    
        this.colorpicker.caculateHSV()
        this.colorpicker.setInputColor();
    }    


    EventDocumentMouseUp (e) {
        this.$el.data('isDown', false);    
    }


    EventColorMouseDown(e) {
        this.$el.data('isDown', true);
        this.setMainColor(e);
    }
    
    EventColorMouseUp(e) {
        this.$el.data('isDown', false);
    }


    EventDocumentMouseMove(e) {
        if (this.$el.data('isDown')) {
            this.setMainColor(e);
        }
    } 

    initializeEvent () {


        Event.addEvent(this.$el.el, 'mousedown', this.$EventColorMouseDown);
        Event.addEvent(this.$el.el, 'mouseup', this.$EventColorMouseUp);
    }

    destroy() {
        Event.removeEvent(this.$el.el, 'mousedown', this.$EventColorMouseDown);
        Event.removeEvent(this.$el.el, 'mouseup', this.$EventColorMouseUp);
    }
}
