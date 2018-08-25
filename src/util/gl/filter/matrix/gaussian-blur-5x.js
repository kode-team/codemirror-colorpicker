import {
    parseParamNumber,
    convolution,
    weight
} from '../util'

export default function gaussianBlur5x (amount = 100) {
    amount = parseParamNumber(amount)    
    const C = amount / 100;
    return convolution([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, 36, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ]);
}