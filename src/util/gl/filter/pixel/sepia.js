import {
    parseParamNumber
} from '../util';
import matrix from "./matrix";

/*
 * @param {Number} amount  0..100 
 */
export default function sepia (amount = 1) {
    let C = parseParamNumber(amount);
    if (C > 1) C = 1; 

    return matrix(
        (0.393 + 0.607 * (1 - C)), (0.769 - 0.769 * (1 - C)), (0.189 - 0.189 * (1 - C)), 0,
        (0.349 - 0.349 * (1 - C)), (0.686 + 0.314 * (1 - C)), (0.168 - 0.168 * (1 - C)), 0,
        (0.272 - 0.272 * (1 - C)), (0.534 - 0.534 * (1 - C)), (0.131 + 0.869 * (1 - C)), 0,
        0, 0, 0, 1
    )
}