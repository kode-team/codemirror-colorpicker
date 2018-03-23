import Color from '../Color'

export default function (rgb, opt = {scale : 1}) { 

    var lab = Color.RGBtoLAB({r: rgb[0], g : rgb[1], b: rgb[2]});


    lab.l = lab.l * opt.scale;

    lab.a = 0;
    lab.b = 0; 

    var {r, g, b} = Color.LABtoRGB(lab);

    return [r, g, b];
}