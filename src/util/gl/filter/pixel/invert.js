import {
    shader,
    parseParamNumber,
    toFloatString
} from '../util'

export default function invert (amount = 1) {
    const C = toFloatString( parseParamNumber(amount) ); 

    return shader(`
        outColor = vec4(
            (1.0 - pixelColor.r) * ${C},
            (1.0 - pixelColor.g) * ${C},
            (1.0 - pixelColor.b) * ${C},
            pixelColor.a
        );
    `);
}
