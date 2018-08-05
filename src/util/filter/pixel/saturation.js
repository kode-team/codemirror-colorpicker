import {
    parseParamNumber,
    pack,
    colorMatrix
} from '../functions'

/*
 * @param {Number} amount  -100..100 
 */
export default function saturation (amount = 100) {
    amount = parseParamNumber(amount)    
    const C = amount / 100 
    const L = 1 - Math.abs(C);

    const matrix = [
        L, 0, 0, 0,
        0, L, 0, 0,
        0, 0, L, 0,
        0, 0, 0, L
    ]

    return pack((pixels, i) => {
        colorMatrix(pixels, i, matrix);
    })

}