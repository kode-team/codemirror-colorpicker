import {
    shader, toFloatString, parseParamNumber
} from '../util'

/*
 * @param {Number} amount  -1..1  ,  value < 0  is darken, value > 0 is brighten 
 */
export default function brightness (amount = 1) {
    const C = toFloatString( parseParamNumber(amount) );

    return shader(`
        outColor = pixelColor + (${C});
    `);
}