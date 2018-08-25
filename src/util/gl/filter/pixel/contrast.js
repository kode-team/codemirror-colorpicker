import {
    shader,
    parseParamNumber,
    toFloatString   
} from '../util'

/*
 * @param {Number} amount  0..1
 */
export default function contrast (amount = 1) {
    const C = toFloatString(parseParamNumber(amount));

    return shader(`
        outColor = pixelColor * ${C};
    `);
}