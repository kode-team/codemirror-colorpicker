import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'

/**
 * 
 * @param {Number} amount from 0 to 100 
 */
export default function clip (amount = 0) {
    amount = parseParamNumber(amount)    
    const C = Math.abs(amount) * 2.55

    return pack((pixels, i, xyIndex, r, g, b, a) => {

        fillColor(
            pixels, 
            i, 
            (r > 255 - C) ? 255 : 0, 
            (g > 255 - C) ? 255 : 0, 
            (b > 255 - C) ? 255 : 0
        )

    })
}