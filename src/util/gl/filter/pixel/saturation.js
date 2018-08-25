import {
    parseParamNumber
} from '../util'
import matrix from './matrix'


/*
 * @param {Number} amount  0..1 
 */
export default function saturation (amount = 0) {
    const L = 1 - Math.abs(parseParamNumber(amount));

    return matrix(
        L, 0, 0, 0,
        0, L, 0, 0,
        0, 0, L, 0,
        0, 0, 0, L
    )

}