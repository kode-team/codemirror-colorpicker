import {
    convolution
} from '../util'

export default function sharpen () {
    return convolution([
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ]);
}