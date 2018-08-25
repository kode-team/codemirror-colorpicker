import {
    shader,
    parseParamNumber,    
    toFloatString
} from '../util'

/*
 * @param {Number} amount  -1..1  ,  value < 0  is darken, value > 0 is brighten 
 */
export default function gamma (amount = 1) {
    const C = toFloatString( parseParamNumber(amount) )

    return shader(`
        outColor = vec4(pow(pixelColor.r, ${C}), pow(pixelColor.g, ${C}), pow(pixelColor.b, ${C}), pixelColor.a );
    `);
}