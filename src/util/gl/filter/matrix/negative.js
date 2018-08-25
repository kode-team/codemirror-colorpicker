import {
    convolution
} from '../util'

export default function negative () {
    return convolution([
        -1, 0, 0, 0, 0,
        0, -1, 0, 0, 0,
        0, 0, -1, 0, 0,
        0, 0, 0, 1, 0,
        1, 1, 1, 1, 1
    ]);
}
