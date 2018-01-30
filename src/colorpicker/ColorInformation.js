import ColorUtil from '../util/Color'
import Dom from '../util/Dom'
import Event from '../util/Event'
import EventMachin from '../util/EventMachin'

const color = ColorUtil.color;

export default class ColorInformation extends EventMachin {

    constructor(colorpicker) {
        super();
        
        this.colorpicker = colorpicker;
        this.initialize()

    }

    initialize () {
        this.$el = new Dom('div', 'information hex' );

        this.$informationChange = this.$el.createChild('div', 'information-change');

        this.$formatChangeButton = this.$informationChange.createChild('button', 'format-change-button arrow-button', { type : 'button'});
 
        this.$el.append(this.makeInputFieldHex());
        this.$el.append(this.makeInputFieldRgb());
        this.$el.append(this.makeInputFieldHsl());

        this.format = 'hex'; 
    }


    makeInputFieldHex () {
        var item = new Dom('div', 'information-item hex');
        var field = item.createChild('div', 'input-field hex');

        this.$hexCode = field.createChild('input', 'input', { type : 'text' });

        field.createChild('div', 'title').html('HEX');
    
        return item; 
    }

    makeInputFieldRgb () {
        var item = new Dom('div', 'information-item rgb');        

        var field = item.createChild('div', 'input-field rgb-r');
        this.$rgb_r = field.createChild('input', 'input', { type : 'text' });
        field.createChild('div', 'title').html('R');

        field = item.createChild('div', 'input-field rgb-g');
        this.$rgb_g = field.createChild('input', 'input', { type : 'text' });
        field.createChild('div', 'title').html('G');

        field = item.createChild('div', 'input-field rgb-b');
        this.$rgb_b = field.createChild('input', 'input', { type : 'text' });
        field.createChild('div', 'title').html('B');

        // rgba
        field = item.createChild('div', 'input-field rgb-a');
        this.$rgb_a = field.createChild('input', 'input', { type : 'text' });
        field.createChild('div', 'title').html('A');

        return item; 
    }

    makeInputFieldHsl () {
        var item = new Dom('div', 'information-item hsl');
        
        var field = item.createChild('div', 'input-field hsl-h');
        this.$hsl_h = field.createChild('input', 'input', { type : 'text' });
        field.createChild('div', 'title').html('H');

        field = item.createChild('div', 'input-field hsl-s');
        this.$hsl_s = field.createChild('input', 'input', { type : 'text' });
        field.createChild('div', 'title').html('S');

        field = item.createChild('div', 'input-field hsl-l');
        this.$hsl_l = field.createChild('input', 'input', { type : 'text' });
        field.createChild('div', 'title').html('L');

        // rgba
        field = item.createChild('div', 'input-field hsl-a');
        this.$hsl_a = field.createChild('input', 'input', { type : 'text' });
        field.createChild('div', 'title').html('A');

        return item;
    }

    currentFormat () {
        var current_format = this.format || 'hex';
        if (this.colorpicker.currentA < 1 && current_format == 'hex' ) {
            var next_format = 'rgb';
            this.$el.removeClass(current_format);
            this.$el.addClass(next_format);
            this.format = next_format;
    
            this.colorpicker.setInputColor();
        }
    }

    setCurrentFormat (format) {
        this.format = format
        this.initFormat();
    }
    
    initFormat () {
        var current_format = this.format || 'hex';
    
        this.$el.removeClass('hex');
        this.$el.removeClass('rgb');
        this.$el.removeClass('hsl');
        this.$el.addClass(current_format);
    }
    
    nextFormat() {
        var current_format = this.format || 'hex';

        var next_format = 'hex';
        if (current_format == 'hex') {
            next_format = 'rgb';
        } else if (current_format == 'rgb') {
            next_format = 'hsl';
        } else if (current_format == 'hsl') {
            if (this.colorpicker.currentA == 1) {
                next_format = 'hex';
            } else {
                next_format = 'rgb';
            }
        }

        this.$el.removeClass(current_format);
        this.$el.addClass(next_format);
        this.format = next_format;

        this.colorpicker.setInputColor();
    }
    
    setRGBtoHexColor(e) {
        var r = this.$rgb_r.val(),
            g = this.$rgb_g.val(),
            b = this.$rgb_b.val();

        if(r == "" || g == "" || b == "") return;

        if(parseInt(r) > 255) this.$rgb_r.val(255);
        else this.$rgb_r.val(parseInt(r));

        if(parseInt(g) > 255) this.$rgb_g.val(255);
        else this.$rgb_g.val(parseInt(g));

        if(parseInt(b) > 255) this.$rgb_b.val(255);
        else this.$rgb_b.val(parseInt(b));

        this.colorpicker.initColor(this.getHexFormat());
    }


    setRGBInput(r, g, b) {
        this.$rgb_r.val(r);
        this.$rgb_g.val(g);
        this.$rgb_b.val(b);
        this.$rgb_a.val(this.colorpicker.currentA);
    }
    
    setHSLInput(h, s, l) {
        this.$hsl_h.val(h);
        this.$hsl_s.val(s + '%');
        this.$hsl_l.val(l + '%');
        this.$hsl_a.val(this.colorpicker.currentA);
    }
    
    getHexFormat() {
        return color.format({
            r : this.$rgb_r.int(),
            g : this.$rgb_g.int(),
            b : this.$rgb_b.int()
        }, 'hex');
    }
    
    convertRGB() {
        return this.colorpicker.convertRGB();
    }
    
    convertHEX() {
        return this.colorpicker.convertHEX();
    }
    
    convertHSL() {
        return this.colorpicker.convertHSL();
    }
    
    getFormattedColor (format) {
        return this.colorpicker.getFormattedColor(format);
    }

    getFormat () {
        return this.format || 'hex';   
    }

    setInputColor() {
        var format = this.getFormat();

        var rgb = null;
        if (format == 'hex') {
            this.$hexCode.val(this.convertHEX());
        } else if (format == 'rgb') {
            var rgb = this.convertRGB();
            this.setRGBInput(rgb.r, rgb.g, rgb.b, rgb.a);
        } else if (format == 'hsl') {
            var hsl = this.convertHSL();
            this.setHSLInput(hsl.h, hsl.s, hsl.l, hsl.a);
        }
    }
        

    checkNumberKey(e) {
        return Event.checkNumberKey(e);
    }    

    'keydown $rgb_r' (e) { return this.checkNumberKey(e) }
    'keydown $rgb_g' (e) { return this.checkNumberKey(e) }
    'keydown $rgb_b' (e) { return this.checkNumberKey(e) }

    'keyup $rgb_r' (e) { return this.setRGBtoHexColor(e) }
    'keyup $rgb_g' (e) { return this.setRGBtoHexColor(e) }
    'keyup $rgb_b' (e) { return this.setRGBtoHexColor(e) }
    
    'keydown $hexCode' (e) {
        if(e.which < 65 || e.which > 70) {
            return this.checkNumberKey(e);
        }
    }
    
    'keyup $hexCode' (e) {
        var code = this.$hexCode.val();
    
        if(code.charAt(0) == '#' && code.length == 7) {
            this.colorpicker.initColor(code);
        }
    }
    
    'click $formatChangeButton' (e) {
        this.nextFormat();
    }

    refresh () {

    }
}
