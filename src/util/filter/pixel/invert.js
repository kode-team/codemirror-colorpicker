import {
    parseParamNumber,
    pack
} from '../functions'
export default function invert (amount = 100) {
    amount = parseParamNumber(amount)    
    const C = amount / 100; 

    return pack((pixels, i) => {

        pixels[i] = (255 - pixels[i]) * C ;
        pixels[i + 1] = (255 - pixels[i + 1]) * C;
        pixels[i + 2] = (255 - pixels[i + 2]) * C;

    })
}
