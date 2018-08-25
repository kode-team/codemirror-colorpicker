import {
    shader,
    parseParamNumber,
    toFloatString
} from '../util'

export default function shade(redValue = 1, greenValue = 1, blueValue = 1) {
    const r = toFloatString(parseParamNumber(redValue) / 255)
    const g = toFloatString(parseParamNumber(greenValue) /255)
    const b = toFloatString(parseParamNumber(blueValue) /255)   

    return shader(`
        outColor = vec4(
            pixelColor.r * ${r},
            pixelColor.g * ${g},
            pixelColor.b * ${b},
            pixelColor.a
        );
    `);
}
