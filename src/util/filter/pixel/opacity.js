import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'


export default function opacity (amount = 100) {
    amount = parseParamNumber(amount)   
    const C = amount / 100; 

    return pack((pixels, i, xyIndex, r, g, b, a) => {
        fillColor(
            pixels,
            i,
            null,
            null,
            null,
            a * C,   
        )
    })
}