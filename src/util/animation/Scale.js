import { interpolateRGBObject } from "../functions/mixin";
import { rgb } from "../functions/formatter";

const ScaleFunctions = {
    'color': 'makeScaleFunctionForColor',
    'number': 'makeScaleFunctionForNumber',
    '%': 'makeScaleFunctionForPercent',
    'px': 'makeScaleFunctionForPx',
    'em': 'makeScaleFunctionForEm'
}

const Scale = {
    makeScaleFunctionForColor (start, end) {
        return function (currentPercent) {
            var rate = (currentPercent - start.percent) / (end.percent - start.percent);
        
            return interpolateRGBObject (start, end, rate); 
        }            
    },

    makeScaleFunctionForNumber (start, end) {
        return function (currentPercent) {
            var rate = (currentPercent - start.percent) / (end.percent - start.percent);

            return start.value + (end.value - start.value) * rate; 
        }            
    },

    makeScaleFunctionForPercent (start, end) {
        return this.makeScaleFunctionForNumber(start, end);
    },    

    makeScaleFunctionForPx (start, end) {
        return this.makeScaleFunctionForNumber(start, end);
    },    
    
    makeScaleFunctionForEm (start, end) {
        return this.makeScaleFunctionForNumber(start, end);
    },        

    makeScaleFunction (start, end, isLast) {
        var itemType = start.itemType || 'number';

        return this[ScaleFunctions[itemType]].call(this, start, end);
    },

    makeCheckFunction (start, end, isLast) {
        if (isLast) {
            return function (currentPercent) {
                return start.percent <= currentPercent && currentPercent <= end.percent;
            }   
        } else {
            return function (currentPercent) {
                return start.percent <= currentPercent && currentPercent < end.percent;
            }   
        }

    },

    makeSetupFunction (start, end, isLast) {
        var check = this.makeCheckFunction(start, end, isLast);
        var scale = this.makeScaleFunction(start, end, isLast);

        if (start.type == 'color') {
            return function (ani, progress) {
                if (check(progress)) {
                    ani.obj[start.key] = rgb(scale(ani.timing(progress, ani.duration, start, end)));
                }
            }
        } else {
            return function (ani, progress) {
                if (check(progress)) {   
                    ani.obj[start.key] = scale(ani.timing(progress, ani.duration, start.value, end.value)) + start.type;
                }
            }
        }
    }
}
export default Scale;