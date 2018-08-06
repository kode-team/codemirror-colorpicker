import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'
export default function invert (amount = 100) {
    amount = parseParamNumber(amount)    
    const C = amount / 100; 

    return pack((pixels, i, xyIndex, r, g, b) => {

        fillColor(
            pixels, i, 
            (255 - r) * C,
            (255 - g) * C,
            (255 - b) * C
        )
    })
}
