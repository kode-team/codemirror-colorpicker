import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'

export default function gamma (amount = 1) {
    amount = parseParamNumber(amount)    
    return pack((pixels, i) => {
        fillColor(
            pixels, 
            i, 
            Math.pow(pixels[i] / 255, amount) * 255,
            Math.pow(pixels[i+1] / 255, amount) * 255,
            Math.pow(pixels[i+2] / 255, amount) * 255,
        )        
        
    })
}