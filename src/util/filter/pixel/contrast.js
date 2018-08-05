import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'
/**
 * 
 * @param {*} amount   min = -128, max = 128 
 */
export default function contrast(amount = 0) {
    amount = parseParamNumber(amount)       
    const C = Math.max((128 + amount) / 128, 0);

    return pack((pixels, i) => {
        fillColor(pixels, i, pixels[i] * C, pixels[i+1] * C, pixels[i+2] * C)
    })
}