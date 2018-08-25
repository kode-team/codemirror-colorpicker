import {
    shader,
    parseParamNumber,    
    toFloatString
} from '../util'

export default function solarize (redValue, greenValue, blueValue) {
    const r = toFloatString( parseParamNumber(redValue) )
    const g = toFloatString( parseParamNumber(greenValue) )
    const b = toFloatString( parseParamNumber(blueValue) )

    return shader(`
        outColor = vec4(
            (pixelColor.r < ${r}) ? 1.0 - pixelColor.r: pixelColor.r,
            (pixelColor.g < ${g}) ? 1.0 - pixelColor.g: pixelColor.g,
            (pixelColor.b < ${b}) ? 1.0 - pixelColor.b: pixelColor.b,
            pixelColor.a
        );
    `);
}

