import Color from '../../../Color'
import {
    shader,
    colorToVec4,
    toFloatString
} from '../util'

export default function bitonal(darkColor, lightColor, threshold = 0.5) {
    let checkVlue = toFloatString(threshold)
    let darkColorString = colorToVec4(Color.parse(darkColor))
    let lightColorString = colorToVec4(Color.parse(lightColor))

    return shader(`
        if ((pixelColor.r + pixelColor.g + pixelColor.b) > ${checkVlue}) {
            outColor = vec4(${lightColorString}.rgb, pixelColor.a);
        } else {
            outColor = vec4(${darkColorString}.rgb, pixelColor.a);
        }
    `);
}


