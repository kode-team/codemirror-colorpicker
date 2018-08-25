import {
    parseParamNumber,
    convolution
} from '../util'

export default function transparency (amount = 100) {
    amount = parseParamNumber(amount)
    return convolution([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0.3, 0,
        0, 0, 0, 0, 1,
    ]);
}