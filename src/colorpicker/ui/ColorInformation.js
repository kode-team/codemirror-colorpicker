import Event from '../../util/Event'
import UIElement from '../UIElement';

const source = 'chromedevtool-information';

export default class ColorInformation extends UIElement {

    template () {
        return /*html*/`
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
                    <div class="title">S</div>
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
        `
    }
    
    setCurrentFormat (format) {
        this.format = format

        this.initFormat();
    }
    
    initFormat () {
        var current_format = this.format || 'hex';
    
        ['hex', 'rgb', 'hsl'].filter(it => it !== current_format).forEach(formatString => {
            this.$el.removeClass(formatString);
        })

        this.$el.addClass(current_format);
    }


    nextFormat() {
        var current_format = this.$store.format || 'hex';

        var next_format = 'hex';
        if (current_format == 'hex') {
            next_format = 'rgb';
        } else if (current_format == 'rgb') {
            next_format = 'hsl';
        } else if (current_format == 'hsl') {
            next_format = 'hex';
        }

        this.format = next_format;
        this.$store.dispatch('/changeFormat', next_format);
        this.$store.emit('lastUpdateColor')
        this.initFormat();
    }    

    goToFormat(to_format) {
        this.format = to_format;
        this.$store.dispatch('/changeFormat', this.format);
        this.$store.emit('lastUpdateColor')                
        this.initFormat();        
    }      
    
    getFormat () {
        return this.format || 'hex';   
    }

    checkNumberKey(e) {
        var code = e.which,
            isExcept = false;

        if(code == 37 || code == 39 || code == 8 || code == 46 || code == 9)
            isExcept = true;

        if(!isExcept && (code < 48 || code > 57))
            return false;

        return true;
    }

    checkNotNumberKey(e) {
        return !this.checkNumberKey(e);
    }        

    changeRgbColor () {
        this.$store.dispatch('/changeColor', {
            type: 'rgb',
            r : this.refs.$rgb_r.int(),
            g : this.refs.$rgb_g.int(),
            b : this.refs.$rgb_b.int(),
            a : this.refs.$rgb_a.float(),
            source
        })
        this.$store.emit('lastUpdateColor')        
    }

    changeHslColor () {
        this.$store.dispatch('/changeColor', {
            type: 'hsl',
            h : this.refs.$hsl_h.int(),
            s : this.refs.$hsl_s.int(),
            l : this.refs.$hsl_l.int(),
            a : this.refs.$hsl_a.float(),
            source
        })    
        this.$store.emit('lastUpdateColor')            
    }    

    '@changeColor' (sourceType) {
        if (source != sourceType) {
            this.refresh()
        }
    }

    '@initColor' () { this.refresh() }    

    'input $rgb_r' (e) {  this.changeRgbColor(); }
    'input $rgb_g' (e) {  this.changeRgbColor(); }
    'input $rgb_b' (e) {  this.changeRgbColor(); }
    'input $rgb_a' (e) {  this.changeRgbColor(); }  
    
    'input $hsl_h' (e) {  this.changeHslColor(); }
    'input $hsl_s' (e) {  this.changeHslColor(); }
    'input $hsl_l' (e) {  this.changeHslColor(); }
    'input $hsl_a' (e) {  this.changeHslColor(); }      
    
    'keyup $hexCode' (e) {
        var code = this.refs.$hexCode.val();
    
        if(code.charAt(0) == '#' && (code.length == 7 || code.length === 9)) {
            this.$store.dispatch('/changeColor', code, source)
            this.$store.emit('lastUpdateColor')            
        }
    }
    
    'click $formatChangeButton' (e) {
        this.nextFormat();
    }

    'click $el .information-item.hex .input-field .title' (e) {
        this.goToFormat('rgb');
    }    

    'click $el .information-item.rgb .input-field .title' (e) {
        this.goToFormat('hsl');
    }    

    'click $el .information-item.hsl .input-field .title' (e) {
        this.goToFormat('hex');
    }      

    setRGBInput() {
        this.refs.$rgb_r.val(this.$store.rgb.r);
        this.refs.$rgb_g.val(this.$store.rgb.g);
        this.refs.$rgb_b.val(this.$store.rgb.b);
        this.refs.$rgb_a.val(this.$store.alpha);
    }
    
    setHSLInput() {
        this.refs.$hsl_h.val(this.$store.hsl.h);
        this.refs.$hsl_s.val(this.$store.hsl.s);
        this.refs.$hsl_l.val(this.$store.hsl.l);
        this.refs.$hsl_a.val(this.$store.alpha);
    }    

    setHexInput () {
        this.refs.$hexCode.val(this.$store.dispatch('/toHEX'));
    }

    refresh () {
        this.setCurrentFormat(this.$store.format);
        this.setRGBInput();
        this.setHSLInput();
        this.setHexInput();
    }
}
