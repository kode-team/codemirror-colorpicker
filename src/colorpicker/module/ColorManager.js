import Color from '../../util/Color'
import HueColor from '../../util/HueColor'
import BaseModule from '../BaseModule';


function isUndefined (v) {
    return typeof v == 'undefined' || v == null;  
}

export default class ColorManager extends BaseModule {

    initialize () {        
        super.initialize()

        this.$store.rgb = {}
        this.$store.hsl = {}
        this.$store.hsv = {}
        this.$store.alpha = 1 
        this.$store.format = 'hex'

        // this.$store.dispatch('/changeColor');
    }

    '/changeFormat' ($store, format) {
        $store.format = format;

        $store.emit('changeFormat');
    }

    '/initColor' ($store, colorObj, source) {
        $store.dispatch('/changeColor', colorObj, source, true);
        $store.emit('initColor')
    }

    '/changeColor' ($store, colorObj, source, isNotEmit) {

        colorObj = colorObj || '#FF0000'

        if (typeof colorObj == 'string') {
            colorObj = Color.parse(colorObj);
        }

        colorObj.source = colorObj.source || source 

        $store.alpha = isUndefined(colorObj.a) ? $store.alpha : colorObj.a; 
        $store.format = colorObj.type != 'hsv' ? (colorObj.type || $store.format) : $store.format;

        if ($store.format == 'hex' && $store.alpha < 1) {
            $store.format = 'rgb';
        }

        if (colorObj.type == 'hsl') {
            $store.hsl = Object.assign($store.hsl, colorObj); 
            $store.rgb = Color.HSLtoRGB($store.hsl);
            $store.hsv = Color.HSLtoHSV(colorObj);            
        } else if (colorObj.type == 'hex') {
            $store.rgb = Object.assign($store.rgb, colorObj);
            $store.hsl = Color.RGBtoHSL($store.rgb);
            $store.hsv = Color.RGBtoHSV(colorObj);            
        } else if (colorObj.type == 'rgb') {
            $store.rgb = Object.assign($store.rgb, colorObj);
            $store.hsl = Color.RGBtoHSL($store.rgb);            
            $store.hsv = Color.RGBtoHSV(colorObj);            
        } else if (colorObj.type == 'hsv') {
            $store.hsv = Object.assign($store.hsv, colorObj);
            $store.rgb = Color.HSVtoRGB($store.hsv);
            $store.hsl = Color.HSVtoHSL($store.hsv);
        }

        if (!isNotEmit) {
            $store.emit('changeColor', colorObj.source);
        }

    }

    '/getHueColor' ($store) {
        return HueColor.checkHueColor($store.hsv.h/360);
    }

    '/toString' ($store, type) {
        type = type || $store.format
        var colorObj = $store[type] || $store.rgb
        return Color.format(Object.assign({}, colorObj, {a: $store.alpha} ), type);
    }

    '/toColor' ($store, type) {
        type = type || $store.format; 

        if (type == 'rgb') {
            return $store.dispatch('/toRGB')
        } else if (type == 'hsl') {
            return $store.dispatch('/toHSL')
        } else if (type == 'hex') {
            return $store.dispatch('/toHEX')            
        }

        return $store.dispatch('/toString', type);
    }

    '/toRGB' ($store) {
        return $store.dispatch('/toString', 'rgb')
    }

    '/toHSL' ($store) {
        return $store.dispatch('/toString', 'hsl')
    }

    '/toHEX' ($store) {
        return $store.dispatch('/toString', 'hex').toUpperCase()
    }

}