import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'

export default function gamma (amount = 1) {
    amount = parseParamNumber(amount)    
    return pack((pixels, i, xyIndex, r, g, b) => {
        fillColor(
            pixels, 
            i, 
            Math.pow(r / 255, amount) * 255,
            Math.pow(g / 255, amount) * 255,
            Math.pow(b / 255, amount) * 255,
        )        
        
    })
}