import Color from '../../Color'

import {
    parseParamNumber,
    pack
} from '../functions'


export default function thresholdColor (scale = 200, amount = 100, hasColor = true) {
    scale = parseParamNumber(scale)    
    amount = parseParamNumber(amount)    
    const C = amount / 100;
    return pack((pixels, i) => {
        var v = (C * Color.brightness(pixels[i], pixels[i + 1], pixels[i + 2]) ) >= scale ? 255 : 0;

        if (hasColor) {

            if (v == 0) {
                pixels[i] = pixels[i + 1] = pixels[i + 2] = 0
            }
            
        } else {
            pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round(v)
        }
        
    })
}
