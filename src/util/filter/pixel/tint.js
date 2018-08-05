import { fillColor } from "../functions";


F.tint = function (redTint = 1, greenTint = 1, blueTint = 1) {
    redTint = parseParamNumber(redTint)       
    greenTint = parseParamNumber(greenTint)       
    blueTint = parseParamNumber(blueTint)       
    return pack((pixels, i) => {
        fillColor(
            pixels,
            i,
            pixels[i] + (255 - pixels[i]) * redTint,
            pixels[i + 1] + (255 - pixels[i + 1]) * greenTint,
            pixels[i + 2] + (255 - pixels[i + 2]) * blueTint           
        )
    })

}