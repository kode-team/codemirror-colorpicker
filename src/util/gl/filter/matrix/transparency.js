import {
    convolution
} from '../util'

export default function transparency () {
    return convolution([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0.3, 0,
        0, 0, 0, 0, 1,
    ]);
}