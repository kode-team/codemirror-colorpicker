import {
    createRandomCount,
    parseParamNumber,
    createRandRange,
    convolution
} from '../functions'

export default function random (amount = 10, count = createRandomCount()) {
    amount = parseParamNumber(amount)    
    return function (pixels, width, height) {
        var rand = createRandRange(-1, 5, count);
        return convolution(rand)(pixels, width, height);
    }
}
