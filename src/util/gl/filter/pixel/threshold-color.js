import {
    parseParamNumber,
    shader,
    toFloatString
} from '../util'

export default function thresholdColor (scale = 1) {
    scale = toFloatString( parseParamNumber(scale) )

    return shader(`
        float c = ( (pixelColor.r * 0.2126 + pixelColor.g * 0.7152 + pixelColor.b * 0.0722) ) >= ${scale} ? 1.0 : 0.0;

        outColor = vec4(c, c, c, pixelColor.a);
    `)
}
