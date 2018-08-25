import {
    shader,
    toFloatString
} from '../util'

export default function matrix (
    $a = 0, $b = 0, $c = 0, $d = 0, 
    $e = 0, $f = 0, $g = 0, $h = 0, 
    $i = 0, $j = 0, $k = 0, $l = 0, 
    $m = 0, $n = 0, $o = 0, $p = 0
) {

    const matrix = [
        $a, $b, $c, $d, 
        $e, $f, $g, $h, 
        $i, $j, $k, $l, 
        $m, $n, $o, $p
    ].map(toFloatString)
    
    return shader(`

        outColor = vec4(
            ${matrix[0]} * pixelColor.r + ${matrix[1]} * pixelColor.g + ${matrix[2]} * pixelColor.b + ${matrix[3]} * pixelColor.a,
            ${matrix[4]} * pixelColor.r + ${matrix[5]} * pixelColor.g + ${matrix[6]} * pixelColor.b + ${matrix[7]} * pixelColor.a,
            ${matrix[8]} * pixelColor.r + ${matrix[9]} * pixelColor.g + ${matrix[10]} * pixelColor.b + ${matrix[11]} * pixelColor.a,
            ${matrix[12]} * pixelColor.r + ${matrix[13]} * pixelColor.g + ${matrix[14]} * pixelColor.b + ${matrix[15]} * pixelColor.a
        ); 
    `);
} 