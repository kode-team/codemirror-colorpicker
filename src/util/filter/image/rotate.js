import {
    parseParamNumber,
    packXY,
    createBitmap
} from '../functions'

import rotateDegree from './rotateDegree'

export default function rotate (degree = 0) {
    degree = parseParamNumber(degree)     
    degree = degree % 360
    return function (bitmap) {

        if (degree == 0) return bitmap

        if (degree == 90 || degree == 270) {
            var newBitmap = createBitmap(bitmap.pixels.length, bitmap.height, bitmap.width)
        } else if (degree == 180) {
            var newBitmap = createBitmap(bitmap.pixels.length, bitmap.width, bitmap.height)
        } else {
            return rotateDegree(degree)(bitmap)
        }

        const width = bitmap.width 
        const height = bitmap.height 

        packXY((pixels, i, x, y) => {

            if (degree == 90) {
                var endIndex = (x * newBitmap.width + (newBitmap.width -1 - y) ) * 4 
            } else if (degree == 270) {
                var endIndex = ( (newBitmap.height -1 -x) * newBitmap.width + y ) * 4 
            } else if (degree == 180) {
                var endIndex = ((newBitmap.height -1 -y) * newBitmap.width + (newBitmap.width -1 -x)) * 4
            }

            newBitmap.pixels[endIndex] = bitmap.pixels[i]
            newBitmap.pixels[endIndex+1] = bitmap.pixels[i+1]
            newBitmap.pixels[endIndex+2] = bitmap.pixels[i+2]
            newBitmap.pixels[endIndex+3] = bitmap.pixels[i+3]

        })(bitmap)

        return newBitmap
    }
}