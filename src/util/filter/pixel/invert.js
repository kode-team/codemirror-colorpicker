import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'
export default function invert (amount = 100) {
    amount = parseParamNumber(amount)    
    const C = amount / 100; 

    return pack((pixels, i) => {

        fillColor(
            pixels, i, 
            (255 - pixels[i]) * C,
            (255 - pixels[i + 1]) * C,
            (255 - pixels[i + 2]) * C
        )
    })
}
