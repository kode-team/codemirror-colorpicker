import {
    parseParamNumber,
    pack
} from '../functions'

/**
 * 
 * @param {Number} amount from 0 to 100 
 */
export default function clip (amount = 0) {
    amount = parseParamNumber(amount)    
    const C = Math.abs(amount) * 2.55

    return pack((pixels, i) => {

        for(var start = i, end = i + 2; start <= end; start++) {
            if (pixels[start] > 255 - C) {
                pixels[start] = 255 
            } else if (pixels[start] < C) {
                pixels[start] = 0 
            }            
        }

    })
}