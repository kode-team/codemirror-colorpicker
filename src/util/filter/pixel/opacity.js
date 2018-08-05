import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'


export default function opacity (amount = 100) {
    amount = parseParamNumber(amount)   
    const C = amount / 100; 

    return pack((pixels, i) => {
        fillColor(
            pixels,
            i,
            null,
            null,
            null,
            pixels[i+3] * C,   
        )
    })
}