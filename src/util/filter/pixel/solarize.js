import {
    parseParamNumber,
    pack
} from '../functions'
/**
 * change the relative darkness of (a part of an image) by overexposure to light.
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 */
export default function solarize (r, g, b) {
    r = parseParamNumber(r)    
    g = parseParamNumber(g)    
    b = parseParamNumber(b)    
    return pack((pixels, i) => {
        if (pixels[i] < r) pixels[i] = 255 - pixels[i];
        if (pixels[i + 1] < g) pixels[i + 1] = 255 - pixels[i + 1];
        if (pixels[i + 2] < b) pixels[i + 2] = 255 - pixels[i + 2];
    })

}
