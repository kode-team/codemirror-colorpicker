import BaseModule from "../../colorpicker/BaseModule";
import { parseParamNumber } from "../../util/gl/filter/util";

var ordering = {
    'position': 1,
    'left': 2,
    'top': 2,
    'right': 2,
    'bottom': 2,
    'width': 3,
    'height': 3,

    'background-image' : 100,
    'background-size' : 100,
    'background-position' : 100,

}

const MAX_ORDER = Number.MAX_SAFE_INTEGER;

export default class CssManager extends BaseModule {

    '*/css/filtering' ($store, style) {
        var newStyle = Object.assign({}, style);

        // delete unused css property 
        delete newStyle.x;
        delete newStyle.y;
        delete newStyle.rotate3dX;
        delete newStyle.rotate3dY;
        delete newStyle.rotate3dZ;
        delete newStyle.rotate3dA;
        delete newStyle.scale3dX;
        delete newStyle.scale3dY;
        delete newStyle.scale3dZ;
        delete newStyle.translate3dX;
        delete newStyle.translate3dY;
        delete newStyle.translate3dZ;

        if (newStyle['background-blend-mode'] == 'normal') {
            delete newStyle['background-blend-mode'];
        }

        if (newStyle['mix-blend-mode'] == 'normal') {
            delete newStyle['mix-blend-mode'];
        }        

        if (parseParamNumber(newStyle['left']) == 0) {
            delete newStyle['left'];
        }

        if (parseParamNumber(newStyle['top']) == 0) {
            delete newStyle['top'];
        }        

        if (newStyle['transform'] == 'none') {
            delete newStyle['transform'];
        }

        return newStyle; 
    }

    '*/css/sorting' ($store, style) {

        style = $store.read('/css/filtering', style);

        var keys = Object.keys(style);

        keys.sort( ( a, b ) => {
            var aN = ordering[a] || MAX_ORDER 
            var bN = ordering[b] || MAX_ORDER 

            if (aN == bN) return 0; 

            return aN < bN ? -1 : 1; 
        })

        var newStyle = {} 
        keys.forEach(key => {
            newStyle[key] = style[key]; 
        })

        return newStyle;
    }    

    '*/css/toString' ($store, style) {
        var newStyle = $store.read('/css/sorting', style);        

        return Object.keys(newStyle).map(key => {
            return `${key}: ${newStyle[key]}`
        }).join(';'); 
    }
}