import Color from '../../Color'

import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'


export default function thresholdColor (scale = 200, amount = 100, hasColor = true) {
    scale = parseParamNumber(scale)    
    amount = parseParamNumber(amount)    
    const C = amount / 100;
    return pack((pixels, i, xyIndex, r, g, b, a) => {
        var v = (C * Color.brightness(r, g, b) ) >= scale ? 255 : 0;

        if (hasColor) {

            if (v == 0) {
                fillColor(pixels, i, 0, 0, 0)
            }
            
        } else {
            const value = Math.round(v)
            fillColor(pixels, i, value, value, value)
        }
        
    })
}
