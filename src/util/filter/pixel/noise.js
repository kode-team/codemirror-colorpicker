import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'

/**
 * 
 * @param {Number} amount 1..100
 */
export default function noise (amount = 1) {
    amount = parseParamNumber(amount)    
    return pack((pixels, i, xyIndex, r, g, b, a) => {
        const C = Math.abs(amount) * 5
        const min = -C
        const max = C 
        const noiseValue = Math.round(min + (Math.random() * (max - min)))

        fillColor(
            pixels,
            i,
            r + noiseValue,
            g + noiseValue,
            b + noiseValue 
        )
        
    })
}