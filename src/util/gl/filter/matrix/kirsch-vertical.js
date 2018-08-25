import {
    convolution
} from '../util'

export default function kirschVertical () {
    return convolution([
        5, -3, -3,
        5, 0, -3,
        5, -3, -3
    ]);
}