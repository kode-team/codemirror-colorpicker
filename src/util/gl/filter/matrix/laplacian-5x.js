import {
    parseParamNumber,
    convolution
} from '../util'

export default function laplacian5x (amount = 100) {
    amount = parseParamNumber(amount)
    return convolution([
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, 24, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1
    ]);
}
