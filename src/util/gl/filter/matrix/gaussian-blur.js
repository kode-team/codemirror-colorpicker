import {
    parseParamNumber,
    convolution,
    weight
} from '../util'

/**
 * 
 * @param {Number} amount 0..1
 */
export default function gaussianBlur (amount = 1) {
    const C = parseParamNumber(amount) * (1/16) 

    return convolution(weight([
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ], C ));
}