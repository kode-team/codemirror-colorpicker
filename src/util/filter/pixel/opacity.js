import {
    parseParamNumber,
    pack
} from '../functions'


export default function opacity (amount = 100) {
    amount = parseParamNumber(amount)   
    const C = amount / 100; 

    return pack((pixels, i) => {
        pixels[i + 3] *= C;
    })
}