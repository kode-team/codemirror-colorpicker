import {
    parseParamNumber,
    convolution
} from '../util'

export default function negative (amount = 100) {
    amount = parseParamNumber(amount)    
    return convolution([
        -1, 0, 0, 0, 0,
        0, -1, 0, 0, 0,
        0, 0, -1, 0, 0,
        0, 0, 0, 1, 0,
        1, 1, 1, 1, 1
    ]);
}
