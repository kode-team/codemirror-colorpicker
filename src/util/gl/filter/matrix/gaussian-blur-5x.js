import {
    parseParamNumber,
    convolution,
    weight
} from '../util'

export default function gaussianBlur5x () {
    return convolution([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, 36, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ]);
}