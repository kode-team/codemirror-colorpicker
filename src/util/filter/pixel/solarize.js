import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'
/**
 * change the relative darkness of (a part of an image) by overexposure to light.
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 */
export default function solarize (redValue, greenValue, blueValue) {
    redValue = parseParamNumber(redValue)    
    greenValue = parseParamNumber(greenValue)    
    blueValue = parseParamNumber(blueValue)    
    return pack((pixels, i, xyIndex, r, g, b ,a) => {

        fillColor(
            pixels,
            i,
            (r < redValue) ? 255 - r: r,
            (g < greenValue) ? 255 - g: g,
            (b < blueValue) ? 255 - b: b
        )
    })

}
