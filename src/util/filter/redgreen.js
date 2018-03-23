import Color from '../Color'

export default function (rgb, opt = {scale : 0}) { 

    var lab = Color.RGBtoLAB({r: rgb[0], g : rgb[1], b: rgb[2]});

    lab.a = opt.scale;
    lab.b = 0;


    var {r, g, b} = Color.LABtoRGB(lab);

    return [r, g, b];
}