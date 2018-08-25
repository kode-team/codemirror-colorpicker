import {
    parseParamNumber,
    convolution
} from '../util'

export default function grayscale2 (amount = 100) {
    amount = parseParamNumber(amount)    
    return convolution([
        0.3, 0.3, 0.3, 0, 0,
        0.59, 0.59, 0.59, 0, 0,
        0.11, 0.11, 0.11, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ]);
}