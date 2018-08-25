import Color from '../../../Color'
import {
    shader,
    colorToVec4,
    toFloatString
} from '../util'
/**
 * F.gradient('red', 'blue', 'yellow', 'white', 10)
 * F.gradient('red, blue, yellow, white, 10')
 */
export default function gradient () {
    // 전체 매개변수 기준으로 파싱 
    // 색이 아닌 것 기준으로 scale 변수로 인식 

    let params = [...arguments];

    if (params.length === 1 && typeof params[0] === 'string') {
        params = Color.convertMatchesArray(params[0])
    } 

    params = params.map(arg => {
        return arg
    }).join(', ')

    let colors = Color.parseGradient(params);

    colors[0][1] = 0;
    colors[colors.length-1][1] = 1; 

    colors = colors.map(c => {
        const {r, g, b, a} = Color.parse(c[0])
        return [{r, g, b, a}, c[1]];
    })

    let temp = [] 

    for(var i = 0, len = colors.length; i < len - 1; i++) {
        const start = colors[i];
        const end = colors[i+1];

        const startColor = colorToVec4(start[0])
        const endColor = colorToVec4(end[0])

        const startRate = toFloatString (start[1]);
        const endRate = toFloatString (end[1]);

        temp.push(`
            if (${startRate} <= rate && rate < ${endRate}) {
                outColor = mix(${startColor}, ${endColor}, (rate - ${startRate})/(${endRate} - ${startRate}));
            }
        `)
    }

    return shader(`
        float rate = (pixelColor.r * 0.2126 + pixelColor.g * 0.7152 + pixelColor.b * 0.0722); 

        ${temp.join('\n')}        
    `)
}