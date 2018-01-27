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

        this.$informationChange = new Dom('div', 'information-change');

        this.$formatChangeButton = new Dom('button', 'format-change-button arrow-button', { type : 'button'});
        this.$informationChange.append(this.$formatChangeButton);
 
        this.$el.append(this.makeInputFieldHex());
        this.$el.append(this.makeInputFieldRgb());
        this.$el.append(this.makeInputFieldHsl());
        this.$el.append(this.$informationChange);     
    }


    makeInputFieldHex () {
        var item = new Dom('div', 'information-item hex');
        var field = new Dom('div', 'input-field hex');

        this.$hexCode = new Dom('input', 'input', { type : 'text' });

        field.append(this.$hexCode);
        field.append(new Dom('div', 'title').html('HEX'));

        item.append(field);
    
        return item; 
    }

    makeInputFieldRgb () {
        var item = new Dom('div', 'information-item rgb');        
        var field = new Dom('div', 'input-field rgb-r');
        this.$rgb_r = new Dom('input', 'input', { type : 'text' });

        field.append(this.$rgb_r);
        field.append(new Dom('div', 'title').html('R'));

        item.append(field);

        field = new Dom('div', 'input-field rgb-g');
        this.$rgb_g = new Dom('input', 'input', { type : 'text' });

        field.append(this.$rgb_g);
        field.append(new Dom('div', 'title').html('G'));

        item.append(field);

        field = new Dom('div', 'input-field rgb-b');
        this.$rgb_b = new Dom('input', 'input', { type : 'text' });

        field.append(this.$rgb_b);
        field.append(new Dom('div', 'title').html('B'));

        item.append(field);

        // rgba
        field = new Dom('div', 'input-field rgb-a');
        this.$rgb_a = new Dom('input', 'input', { type : 'text' });

        field.append(this.$rgb_a);
        field.append(new Dom('div', 'title').html('A'));

        item.append(field);

        return item; 
    }

    makeInputFieldHsl () {
        var item = new Dom('div', 'information-item hsl');
        var field = new Dom('div', 'input-field hsl-h');
        this.$hsl_h = new Dom('input', 'input', { type : 'text' });

        field.append(this.$hsl_h);
        field.append(new Dom('div', 'title').html('H'));

        item.append(field);

        field = new Dom('div', 'input-field hsl-s');
        this.$hsl_s = new Dom('input', 'input', { type : 'text' });

        field.append(this.$hsl_s);
        field.append(new Dom('div', 'title').html('S'));

        item.append(field);

        field = new Dom('div', 'input-field hsl-l');
        this.$hsl_l = new Dom('input', 'input', { type : 'text' });

        field.append(this.$hsl_l);
        field.append(new Dom('div', 'title').html('L'));

        item.append(field);

        // rgba
        field = new Dom('div', 'input-field hsl-a');
        this.$hsl_a = new Dom('input', 'input', { type : 'text' });

        field.append(this.$hsl_a);
        field.append(new Dom('div', 'title').html('A'));

        item.append(field);
        return item;
    }

    currentFormat () {
        var current_format = this.$el.data('format') || 'hex';
        if (this.colorpicker.currentA < 1 && current_format == 'hex' ) {
            var next_format = 'rgb';
            this.$el.removeClass(current_format);
            this.$el.addClass(next_format);
            this.$el.data('format', next_format);
    
            this.colorpicker.setInputColor();
        }
    }

    setCurrentFormat (format) {
        this.$el.data('format', format);
        this.initFormat();
    }
    
    initFormat () {
        var current_format = this.$el.data('format') || 'hex';
    
        this.$el.removeClass('hex');
        this.$el.removeClass('rgb');
        this.$el.removeClass('hsl');
        this.$el.addClass(current_format);
    }
    
    nextFormat() {
        var current_format = this.$el.data('format') || 'hex';

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
        this.$el.data('format', next_format);

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
        return this.$el.data('format') || 'hex';   
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

    initializeEvent() {
        this.initializeEventMachin();


        Event.addEvent(this.$hexCode.el, 'keydown', this.$EventHexCodeKeyDown);
        Event.addEvent(this.$hexCode.el, 'keyup', this.$EventHexCodeKeyUp);
    
        Event.addEvent(this.$rgb_r.el, 'keydown', this.$checkNumberKey);
        Event.addEvent(this.$rgb_r.el, 'keyup', this.$setRGBtoHexColor);
        Event.addEvent(this.$rgb_g.el, 'keydown', this.$checkNumberKey);
        Event.addEvent(this.$rgb_g.el, 'keyup', this.$setRGBtoHexColor);
        Event.addEvent(this.$rgb_b.el, 'keydown', this.$checkNumberKey);
        Event.addEvent(this.$rgb_b.el, 'keyup', this.$setRGBtoHexColor);
        
        Event.addEvent(this.$formatChangeButton.el, 'click', this.$EventFormatChangeClick)
    }

    destroy () {
        this.destroyEventMachin();

        Event.removeEvent(this.$hexCode.el, 'keydown', this.$EventHexCodeKeyDown);
        Event.removeEvent(this.$hexCode.el, 'keyup', this.$EventHexCodeKeyUp);
        Event.removeEvent(this.$rgb_r.el, 'keydown', this.$checkNumberKey);
        Event.removeEvent(this.$rgb_r.el, 'keyup', this.$setRGBtoHexColor);
        Event.removeEvent(this.$rgb_g.el, 'keydown', this.$checkNumberKey);
        Event.removeEvent(this.$rgb_g.el, 'keyup', this.$setRGBtoHexColor);
        Event.removeEvent(this.$rgb_b.el, 'keydown', this.$checkNumberKey);
        Event.removeEvent(this.$rgb_b.el, 'keyup', this.$setRGBtoHexColor);
        Event.removeEvent(this.$formatChangeButton.el, 'click', this.$EventFormatChangeClick);
    }

    refresh () {

    }
}
