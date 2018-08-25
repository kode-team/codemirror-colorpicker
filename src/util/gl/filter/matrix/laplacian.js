import {
    parseParamNumber,
    convolution
} from '../util'

export default function laplacian (amount = 100) {
    amount = parseParamNumber(amount)
    return convolution([
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1
    ]);
}