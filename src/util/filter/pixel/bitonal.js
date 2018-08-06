import Color from '../../Color'
import { pack, fillColor  } from '../functions'


export default function bitonal(darkColor, lightColor, threshold = 100) {
    darkColor = Color.parse(darkColor);
    lightColor = Color.parse(lightColor);
    return pack((pixels, i, xyIndex, r, g, b) => {

        if (r + g + b <= threshold) {
            fillColor(pixels, i, darkColor);
        } else {
            fillColor(pixels, i, lightColor);            
        }
    })
}