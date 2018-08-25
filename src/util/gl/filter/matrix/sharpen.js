import {
    parseParamNumber,
    convolution
} from '../util'

export default function sharpen (amount = 100) {
    amount = parseParamNumber(amount)    
    return convolution([
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ]);
}