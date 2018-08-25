import { shader, parseParamNumber, toFloatString } from '../util';


/**
 * 
 * @param {Number} amount 0..1
 */
export default function noise (amount = 1) {

    const C = Math.abs( parseParamNumber(amount))
    const min = toFloatString( -C )
    const max = toFloatString( C ) 
    return shader(`
        float rnd = ${min} + random( pixelColor.st ) * (${max} - ${min});

        outColor = vec4(pixelColor.rgb + rnd, 1.0);
    `);
}