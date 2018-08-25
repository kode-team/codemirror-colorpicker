import {
    parseParamNumber
} from '../util'

import matrix from './matrix'

/**
 * 
 * @param {Number} amount 0..1
 */
export default function grayscale (amount = 1) { 
    let C = parseParamNumber(amount);

    if (C > 1) C = 1; 

    return matrix(
        (0.2126 + 0.7874 * (1 - C)), (0.7152 - 0.7152 * (1 - C)), (0.0722 - 0.0722 * (1 - C)), 0,
        (0.2126 - 0.2126 * (1 - C)), (0.7152 + 0.2848 * (1 - C)), (0.0722 - 0.0722 * (1 - C)), 0,
        (0.2126 - 0.2126 * (1 - C)), (0.7152 - 0.7152 * (1 - C)), (0.0722 + 0.9278 * (1 - C)), 0,
        0, 0, 0, 1
    );
} 