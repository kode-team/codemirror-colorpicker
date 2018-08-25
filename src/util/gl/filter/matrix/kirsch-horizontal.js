import {
    convolution
} from '../util'

export default function kirschHorizontal () {
    return convolution([
        5, 5, 5,
        -3, 0, -3,
        -3, -3, -3
    ]);
} 