import {
    parseParamNumber,
    pack
} from '../functions'

export default function gamma (amount = 1) {
    amount = parseParamNumber(amount)    
    return pack((pixels, i) => {
        pixels[i] = Math.pow(pixels[i] / 255, amount) * 255
        pixels[i+1] = Math.pow(pixels[i+1] / 255, amount) * 255
        pixels[i+2] = Math.pow(pixels[i+2] / 255, amount) * 255
    })
}