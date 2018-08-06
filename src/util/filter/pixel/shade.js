import {
    parseParamNumber,
    pack,
    fillColor
} from '../functions'

export default function shade(redValue = 1, greenValue = 1, blueValue = 1) {
    redValue = parseParamNumber(redValue)        
    greenValue = parseParamNumber(greenValue)        
    blueValue = parseParamNumber(blueValue)        
    return pack((pixels, i, xyIndex, r, g, b, a) => {
        fillColor( pixels, i, r * redValue, g * greenValue, b * blueValue)
    })

}