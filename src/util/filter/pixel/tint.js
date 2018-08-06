import { fillColor } from "../functions";


F.tint = function (redTint = 1, greenTint = 1, blueTint = 1) {
    redTint = parseParamNumber(redTint)       
    greenTint = parseParamNumber(greenTint)       
    blueTint = parseParamNumber(blueTint)       
    return pack((pixels, i, xyIndex, r, g, b, a) => {
        fillColor(
            pixels,
            i,
            r + (255 - r) * redTint,
            g + (255 - g) * greenTint,
            b + (255 - b) * blueTint 
        )
    })

}