import {
    parseParamNumber,
    shader
} from '../util'

export default function thresholdColor (scale = 200) {
    scale = parseParamNumber(scale) / 255 

    return shader(`
        float c = ( (pixelColor.r * 0.2126 + pixelColor.g * 0.7152 + pixelColor.b * 0.0722) ) >= ${scale} ? 1.0 : 0.0;

        outColor = vec4(c, c, c, pixelColor.a);
    `)
}
