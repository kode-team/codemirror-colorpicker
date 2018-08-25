import {
    shader,
    parseParamNumber    
} from '../util'

/**
 * 
 * @param {*} redTint  0..1
 * @param {*} greenTint 0..1
 * @param {*} blueTint 0..1
 */
export default function (redTint = 0, greenTint = 0, blueTint = 0) {
    const r = parseParamNumber(redTint)       
    const g = parseParamNumber(greenTint)       
    const b = parseParamNumber(blueTint)  

    return shader(`
        outColor = vec4(
            pixelColor.r += (1 - pixelColor.r) * ${r},
            pixelColor.g += (1 - pixelColor.g) * ${g},
            pixelColor.b += (1 - pixelColor.b) * ${b},
            pixelColor.a
        );
    `);
}
