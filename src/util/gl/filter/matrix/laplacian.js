import {
    convolution
} from '../util'

export default function laplacian () {
    return convolution([
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1
    ]);
}