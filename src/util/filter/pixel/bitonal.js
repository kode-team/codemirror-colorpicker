import Color from '../../Color'
import { pack  } from '../functions'


export default function bitonal(darkColor, lightColor, threshold = 100) {
    darkColor = Color.parse(darkColor);
    lightColor = Color.parse(lightColor);
    return pack((pixels, i) => {

        if (pixels[i] + pixels[i + 1] + pixels[i + 2] <= threshold) {
            pixels[i] = darkColor.r;
            pixels[i + 1] = darkColor.g;
            pixels[i + 2] = darkColor.b;
        } else {
            pixels[i] = lightColor.r;
            pixels[i + 1] = lightColor.g;
            pixels[i + 2] = lightColor.b;
        }
    })
}