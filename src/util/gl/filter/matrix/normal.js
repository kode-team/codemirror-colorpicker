import { convolution } from '../util'
export default function () {
    return convolution([
        0, 0, 0,
        0, 1, 0, 
        0, 0, 0
    ])
}