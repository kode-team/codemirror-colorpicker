import {
    shader,
    parseParamNumber,
    toFloatString
} from '../util'

export default function chaos (amount = 10) {
    const C = toFloatString( parseParamNumber(amount) ); 

    return shader(`
        vec2 st = pixelColor.st;
        st *= ${C};
        
        vec2 ipos = floor(st);  // get the integer coords

        vec3 color = vec3(random( ipos ));

        outColor = vec4(color, pixelColor.a);
    `);
}
