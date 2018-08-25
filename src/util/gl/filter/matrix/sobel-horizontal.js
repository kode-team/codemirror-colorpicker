import {
    convolution
} from '../util'

export default function sobelHorizontal () {
    return convolution([
        -1, -2, -1,
        0, 0, 0,
        1, 2, 1
    ]);
}
