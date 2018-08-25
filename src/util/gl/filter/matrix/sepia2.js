import {
    convolution
} from '../util'

export default function sepia2 () {
    return convolution([
        0.393, 0.349, 0.272, 0, 0,
        0.769, 0.686, 0.534, 0, 0,
        0.189, 0.168, 0.131, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ]);
}