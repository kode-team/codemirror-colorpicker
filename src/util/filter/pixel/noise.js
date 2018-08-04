import {
    parseParamNumber,
    pack
} from '../functions'

/**
 * 
 * @param {Number} amount 1..100
 */
export default function noise (amount = 1) {
    amount = parseParamNumber(amount)    
    return pack((pixels, i) => {
        const C = Math.abs(amount) * 5
        const min = -C
        const max = C 
        const noiseValue = Math.round(min + (Math.random() * (max - min)))
        pixels[i] += noiseValue 
        pixels[i+1] += noiseValue 
        pixels[i+2] += noiseValue 
    })
}