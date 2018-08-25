//http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
import {
    shader,
    parseParamNumber,    
    toFloatString
} from '../util'

/*
 * @param {Number} amount  0..1  ,  (real value 0..360)
 */
export default function hue (amount = 1) {
    const C = toFloatString( parseParamNumber(amount))

    return shader(`
        vec3 hsv = rgb2hsv(pixelColor.rgb);
        hsv.x += ${C};
        outColor = vec4(hsv2rgb(hsv).rgb, pixelColor.a);
    `);
}