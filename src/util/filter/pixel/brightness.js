import {
    parseParamNumber,
    pack
} from '../functions'

/*
 * @param {Number} amount  -100..100  ,  value < 0  is darken, value > 0 is brighten 
 */
export default function brightness (amount = 1) {
    amount = parseParamNumber(amount)    
    const C = Math.floor(255 * (amount / 100));

    return pack((pixels, i) => {
        pixels[i] += C;
        pixels[i + 1] += C;
        pixels[i + 2] += C;
    })
}