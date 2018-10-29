import { parseParamNumber } from "../filter/functions";
import Scale from "./Scale";
import ValueGenerator from "./ValueGenerator";

const KeyFrames = {
    parse (obj, ani) {
        var list = Object.keys(obj).map(key => {
            var originAttrs = obj[key];
            var attrs = Object.assign({}, originAttrs);
            var percent = 0; 
            if (key == 'from') {
                key = '0%';
            } else if (key == 'to') {
                key = '100%';
            }

            if (key.includes('%')) {
                percent = parseParamNumber(key) / 100; 
            } else {
                var newKey = +key; 

                if (newKey + '' == key) {
                    // 시간 초 단위 
                    percent = (newKey / ani.duration )
                }
            }

            return { 
                percent,
                attrs,
                originAttrs
            }
        })

        return this.parseTiming(...this.parseAttrs(...list));
    },

    parseTiming (...list) {
        var transitionProperties = {} 
        list.forEach(item => {
            Object.keys(item.attrs).forEach(property => {
                transitionProperties[property] = true; 
            });
        })

        var keyValueMapping = Object.keys(transitionProperties).map(property => {
            return list.filter(it => it.attrs[property]).map(it => it.attrs[property])
        }).filter(it => {
            return it.length; 
        })

        return keyValueMapping.map(transitionPropertyItem => {
            var functions = [];

            for(var i = 0, len = transitionPropertyItem.length -1 ; i < len; i++) {
                functions.push (Scale.makeSetupFunction(
                    transitionPropertyItem[i], 
                    transitionPropertyItem[i+1], 
                    (len - 1)  == i
                ))
            }

            return {
                functions,
                type: transitionPropertyItem[0].itemType || 'px',
                values: transitionPropertyItem
            }; 
        })
    },

    parseAttrs (...list) {
        list.sort((a, b) => {
            if (a.percent == b.percent) return 0; 
            return a.percent > b.percent ? 1 : -1; 
        })

        list = list.map ((item, index) => {
            Object.keys(item.attrs).forEach(key => {
                item.attrs[key] = ValueGenerator.make(key, item.percent, item.attrs[key]); 
            })

            return item;
        })

        return list; 
    }
}


export default KeyFrames;