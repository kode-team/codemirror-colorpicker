
import {
    shader, toFloatString, parseParamNumber
} from '../util'

/*
 * @param {Number} amount 0..1
 */
export default function clip (amount = 0) {
    const C = toFloatString(parseParamNumber(amount))

    return shader(`
        outColor = vec4(
            (pixelColor.r > 1.0 - ${C}) ? 1.0 : 0.0,
            (pixelColor.g > 1.0 - ${C}) ? 1.0 : 0.0,
            (pixelColor.b > 1.0 - ${C}) ? 1.0 : 0.0,
            pixelColor.a 
        );
    `);
}