import {
    shader,
    parseParamNumber,    
    toFloatString
} from '../util'

/**
 * 
 * @param {Number} amount 0..1
 */
export default function opacity (amount = 1) {
    const C = toFloatString( parseParamNumber(amount)); 

    return shader(`
        outColor = vec4(pixelColor.rgb, pixelColor.a * ${C});
    `);
}
