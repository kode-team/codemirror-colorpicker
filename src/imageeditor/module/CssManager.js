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
}