import {
    parseParamNumber,
    pack
} from '../functions'

export default function shade(r = 1, g = 1, b = 1) {
    r = parseParamNumber(r)        
    g = parseParamNumber(g)        
    b = parseParamNumber(b)        
    return pack((pixels, i) => {
        pixels[i] *= r;
        pixels[i + 1] *= g;
        pixels[i + 2] *= b;
    })

}