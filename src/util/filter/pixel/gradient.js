import Color from '../../Color'
import {
    clamp,
    pack  
} from '../functions'
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
        const res = Color.matches(arg)

        if (!res.length) {
            return { type: 'scale', value : arg }
        }

        return { type: 'param', value : arg }
    })

    let scale = params.filter(it => { return it.type == 'scale' })[0]
    scale = scale ? +scale.value : 256

    params = params.filter(it => { return it.type == 'param' }).map( it => {
        return it.value 
    }).join(',')

    let colors = Color.gradient(params, scale).map(c => { return Color.parse(c) })

    return pack((pixels, i) => {
        const colorIndex = clamp(Color.brightness(pixels[i] , pixels[i + 1] , pixels[i + 2]))
        const newColorIndex = clamp(Math.floor(colorIndex * (scale / 256)))
        const color = colors[newColorIndex]

        pixels[i] = color.r;
        pixels[i + 1] = color.g;
        pixels[i + 2] = color.b;
        pixels[i + 3] = clamp(Math.floor(color.a * 256));
    })
}