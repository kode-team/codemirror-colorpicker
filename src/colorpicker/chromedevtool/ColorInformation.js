import Color from '../../util/Color'
import Dom from '../../util/Dom'
import Event from '../../util/Event'
import EventMachin from '../../util/EventMachin'

export default class ColorInformation extends EventMachin {

    constructor(colorpicker) {
        super();
        
        this.colorpicker = colorpicker;
        this.initialize()

    }

    initialize () {

        this.template(`
            <div class="information hex">
                <div ref="$informationChange" class="information-change">
                    <button ref="$formatChangeButton" type="button" class="format-change-button arrow-button"></button>
                </div>
                <div class="information-item hex">
                    <div class="input-field hex">
                        <input ref="$hexCode" class="input" type="text" />
                        <div class="title">HEX</div>
                    </div>
                </div>
                <div class="information-item rgb">
                    <div class="input-field rgb-r">
                        <input ref="$rgb_r" class="input" type="number" step="1" min="0" max="255" />
                        <div class="title">R</div>
                    </div>
                    <div class="input-field rgb-g">
                        <input ref="$rgb_g" class="input" type="number" step="1" min="0" max="255" />
                        <div class="title">G</div>
                    </div>
                    <div class="input-field rgb-b">
                        <input ref="$rgb_b" class="input" type="number" step="1" min="0" max="255" />
                        <div class="title">B</div>
                    </div>          
                    <div class="input-field rgb-a">
                        <input ref="$rgb_a" class="input" type="number" step="0.01" min="0" max="1" />
                        <div class="title">A</div>
                    </div>                                                            
                </div>
                <div class="information-item hsl">
                    <div class="input-field hsl-h">
                        <input ref="$hsl_h" class="input" type="number" step="1" min="0" max="360" />
                        <div class="title">H</div>
                    </div>
                    <div class="input-field hsl-s">
                        <input ref="$hsl_s" class="input" type="number" step="1" min="0" max="100" />
                        <div class="postfix">%</div>
                        <div class="title">H</div>
                    </div>
                    <div class="input-field hsl-l">
                        <input ref="$hsl_l" class="input" type="number" step="1" min="0" max="100" />
                        <div class="postfix">%</div>                        
                        <div class="title">L</div>
                    </div>
                    <div class="input-field hsl-a">
                        <input ref="$hsl_a" class="input" type="number" step="0.01" min="0" max="1" />
                        <div class="title">A</div>
                    </div>
                </div>
            </div>
        `)

        this.format = 'hex'; 
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

        this.setInputColor();
        this.colorpicker.changeInputColorAfterNextFormat();
    }
    


    setRGBInput(r, g, b) {
        this.refs.$rgb_r.val(r);
        this.refs.$rgb_g.val(g);
        this.refs.$rgb_b.val(b);
        this.refs.$rgb_a.val(this.colorpicker.currentA);
    }
    
    setHSLInput(h, s, l) {
        this.refs.$hsl_h.val(h);
        this.refs.$hsl_s.val(s);
        this.refs.$hsl_l.val(l);
        this.refs.$hsl_a.val(this.colorpicker.currentA);
    }
    
    getHexFormat() {
        return Color.format({
            r : this.refs.$rgb_r.int(),
            g : this.refs.$rgb_g.int(),
            b : this.refs.$rgb_b.int()
        }, 'hex', this.colorpicker.opt.color);
    }

    getRgbFormat() {
        return Color.format({
            r : this.refs.$rgb_r.int(),
            g : this.refs.$rgb_g.int(),
            b : this.refs.$rgb_b.int(),
            a : this.refs.$rgb_a.float()
        }, 'rgb', this.colorpicker.opt.color);
    }    

    getHslFormat() {
        return Color.format({
            h : this.refs.$hsl_h.val(),
            s : this.refs.$hsl_s.val(),
            l : this.refs.$hsl_l.val(),
            a : this.refs.$hsl_a.float()
        }, 'hsl', this.colorpicker.opt.color);
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
    
    getFormattedColor (format, fixed = false) {
        format = format || this.getFormat();
        if (format == 'hex') {
            return this.refs.$hexCode.val();
        } else if (format == 'rgb') {
            return this.getRgbFormat(fixed);
        } else if (format == 'hsl') {
            return this.getHslFormat(fixed);
        }
    }

    getFormat () {
        return this.format || 'hex';   
    }

    setInputColor() {
        var format = this.getFormat();

        var rgb = null;
        if (format == 'hex') {
            this.refs.$hexCode.val(this.convertHEX());
            var rgb = this.convertRGB();
            this.setRGBInput(rgb.r, rgb.g, rgb.b, rgb.a);            
        } else if (format == 'rgb') {
            var rgb = this.convertRGB();
            this.setRGBInput(rgb.r, rgb.g, rgb.b, rgb.a);
            this.refs.$hexCode.val(this.convertHEX());
        } else if (format == 'hsl') {
            var hsl = this.convertHSL();
            this.setHSLInput(hsl.h, hsl.s, hsl.l, hsl.a);
        }
    }
        

    checkNumberKey(e) {
        return Event.checkNumberKey(e);
    }    

    checkNotNumberKey(e) {
        return !Event.checkNumberKey(e);
    }        

    changeRgbColor () {
        this.colorpicker.changeInformationColor(this.getRgbFormat());
    }

    changeHslColor () {
        this.colorpicker.changeInformationColor(this.getHslFormat());
    }    

    'change $rgb_r' (e) {  this.changeRgbColor(); }
    'change $rgb_g' (e) {  this.changeRgbColor(); }
    'change $rgb_b' (e) {  this.changeRgbColor(); }
    'change $rgb_a' (e) {  this.changeRgbColor(); }  
    
    'change $hsl_h' (e) {  this.changeHslColor(); }
    'change $hsl_s' (e) {  this.changeHslColor(); }
    'change $hsl_l' (e) {  this.changeHslColor(); }
    'change $hsl_a' (e) {  this.changeHslColor(); }      

    'keydown $hexCode' (e) {
        if(e.which < 65 || e.which > 70) {
            return this.checkNumberKey(e);
        }
    }
    
    'keyup $hexCode' (e) {
        var code = this.refs.$hexCode.val();
    
        if(code.charAt(0) == '#' && code.length == 7) {
            this.colorpicker.changeInformationColor(code);
            this.setInputColor();
        }
    }
    
    'click $formatChangeButton' (e) {
        this.nextFormat();
    }

    refresh () {

    }
}
