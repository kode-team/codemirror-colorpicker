(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('codemirror')) :
	typeof define === 'function' && define.amd ? define(['codemirror'], factory) :
	(global['codemirror-colorpicker'] = factory(global.CodeMirror));
}(this, (function (CodeMirror$1) { 'use strict';

CodeMirror$1 = CodeMirror$1 && CodeMirror$1.hasOwnProperty('default') ? CodeMirror$1['default'] : CodeMirror$1;

/**
 * @method format
 *
 * convert color to format string
 *
 *     // hex
 *     color.format({ r : 255, g : 255, b : 255 }, 'hex')  // #FFFFFF
 *
 *     // rgb
 *     color.format({ r : 255, g : 255, b : 255 }, 'rgb') // rgba(255, 255, 255, 0.5);
 *
 *     // rgba
 *     color.format({ r : 255, g : 255, b : 255, a : 0.5 }, 'rgb') // rgba(255, 255, 255, 0.5);
 *
 * @param {Object} obj  obj has r, g, b and a attributes
 * @param {"hex"/"rgb"} type  format string type
 * @returns {*}
 */
function format(obj, type) {
    var defaultColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgba(0, 0, 0, 0)';


    if (Array.isArray(obj)) {
        obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] };
    }

    if (type == 'hex') {
        return hex(obj);
    } else if (type == 'rgb') {
        return rgb(obj, defaultColor);
    } else if (type == 'hsl') {
        return hsl(obj);
    }

    return obj;
}

function hex(obj) {
    if (Array.isArray(obj)) {
        obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] };
    }

    var r = obj.r.toString(16);
    if (obj.r < 16) r = "0" + r;

    var g = obj.g.toString(16);
    if (obj.g < 16) g = "0" + g;

    var b = obj.b.toString(16);
    if (obj.b < 16) b = "0" + b;

    return '#' + r + g + b;
}

function rgb(obj) {
    var defaultColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'rgba(0, 0, 0, 0)';

    if (Array.isArray(obj)) {
        obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] };
    }

    if (typeof obj == 'undefined') {
        return undefined;
    }

    if (obj.a == 1 || typeof obj.a == 'undefined') {
        if (isNaN(obj.r)) {
            return defaultColor;
        }
        return 'rgb(' + obj.r + ',' + obj.g + ',' + obj.b + ')';
    } else {
        return 'rgba(' + obj.r + ',' + obj.g + ',' + obj.b + ',' + obj.a + ')';
    }
}

function hsl(obj) {
    if (Array.isArray(obj)) {
        obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] };
    }

    if (obj.a == 1 || typeof obj.a == 'undefined') {
        return 'hsl(' + obj.h + ',' + obj.s + '%,' + obj.l + '%)';
    } else {
        return 'hsla(' + obj.h + ',' + obj.s + '%,' + obj.l + '%,' + obj.a + ')';
    }
}

var formatter = {
    format: format,
    rgb: rgb,
    hsl: hsl,
    hex: hex
};

function round(n, k) {
    k = typeof k == 'undefined' ? 1 : k;
    return Math.round(n * k) / k;
}

function degreeToRadian(angle) {
    return angle * Math.PI / 180;
}

/**
 * 
 * convert radian to degree 
 * 
 * @param {*} radian 
 * @returns {Number} 0..360
 */
function radianToDegree(radian) {
    var angle = radian * 180 / Math.PI;

    if (angle < 0) {
        // 각도가 0보다 작으면 360 에서 반전시킨다. 
        angle = 360 + angle;
    }

    return angle;
}

function getXInCircle(angle, radius) {
    var centerX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    return centerX + radius * Math.cos(degreeToRadian(angle));
}

function getYInCircle(angle, radius) {
    var centerY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    return centerY + radius * Math.sin(degreeToRadian(angle));
}

function getXYInCircle(angle, radius) {
    var centerX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var centerY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    return {
        x: getXInCircle(angle, radius, centerX),
        y: getYInCircle(angle, radius, centerY)
    };
}

function caculateAngle(rx, ry) {
    return radianToDegree(Math.atan2(ry, rx));
}

function uuid() {
    var dt = new Date().getTime();
    var uuid = 'xxxxzxxx-xxxx-45xxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
}

var math = {
    round: round,
    uuid: uuid,
    radianToDegree: radianToDegree,
    degreeToRadian: degreeToRadian,
    getXInCircle: getXInCircle,
    getYInCircle: getYInCircle,
    caculateAngle: caculateAngle
};

/**
 * @method RGBtoHSV
 *
 * convert rgb to hsv
 *
 * 		color.RGBtoHSV(0, 0, 255) === { h : 240, s : 1, v : 1 } === '#FFFF00'
 *
 * @param {Number} R  red color value
 * @param {Number} G  green color value
 * @param {Number} B  blue color value
 * @return {Object}  hsv color code
 */
function RGBtoHSV(r, g, b) {

    if (arguments.length == 1) {
        var _arguments$ = arguments[0],
            r = _arguments$.r,
            g = _arguments$.g,
            b = _arguments$.b;
    }

    var R1 = r / 255;
    var G1 = g / 255;
    var B1 = b / 255;

    var MaxC = Math.max(R1, G1, B1);
    var MinC = Math.min(R1, G1, B1);

    var DeltaC = MaxC - MinC;

    var H = 0;

    if (DeltaC == 0) {
        H = 0;
    } else if (MaxC == R1) {
        H = 60 * ((G1 - B1) / DeltaC % 6);
    } else if (MaxC == G1) {
        H = 60 * ((B1 - R1) / DeltaC + 2);
    } else if (MaxC == B1) {
        H = 60 * ((R1 - G1) / DeltaC + 4);
    }

    if (H < 0) {
        H = 360 + H;
    }

    var S = 0;

    if (MaxC == 0) S = 0;else S = DeltaC / MaxC;

    var V = MaxC;

    return { h: H, s: S, v: V };
}

function RGBtoCMYK(r, g, b) {

    if (arguments.length == 1) {
        var _arguments$2 = arguments[0],
            r = _arguments$2.r,
            g = _arguments$2.g,
            b = _arguments$2.b;
    }

    var R1 = r / 255;
    var G1 = g / 255;
    var B1 = b / 255;

    var K = 1 - Math.max(R1, G1, B1);
    var C = (1 - R1 - K) / (1 - K);
    var M = (1 - G1 - K) / (1 - K);
    var Y = (1 - B1 - K) / (1 - K);

    return { c: C, m: M, y: Y, k: K };
}

function RGBtoHSL(r, g, b) {

    if (arguments.length == 1) {
        var _arguments$3 = arguments[0],
            r = _arguments$3.r,
            g = _arguments$3.g,
            b = _arguments$3.b;
    }

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);break;
            case g:
                h = (b - r) / d + 2;break;
            case b:
                h = (r - g) / d + 4;break;
        }
        h /= 6;
    }

    return { h: round(h * 360), s: round(s * 100), l: round(l * 100) };
}

function c(r, g, b) {

    if (arguments.length == 1) {
        var _arguments$4 = arguments[0],
            r = _arguments$4.r,
            g = _arguments$4.g,
            b = _arguments$4.b;
    }
    return gray((r + g + b) / 3 > 90 ? 0 : 255);
}

function gray(gray) {
    return { r: gray, g: gray, b: gray };
}

function RGBtoSimpleGray(r, g, b) {

    if (arguments.length == 1) {
        var _arguments$5 = arguments[0],
            r = _arguments$5.r,
            g = _arguments$5.g,
            b = _arguments$5.b;
    }
    return gray(Math.ceil((r + g + b) / 3));
}

function RGBtoGray(r, g, b) {

    if (arguments.length == 1) {
        var _arguments$6 = arguments[0],
            r = _arguments$6.r,
            g = _arguments$6.g,
            b = _arguments$6.b;
    }
    return gray(RGBtoYCrCb(r, g, b).y);
}

function brightness(r, g, b) {
    return Math.ceil(r * 0.2126 + g * 0.7152 + b * 0.0722);
}

function RGBtoYCrCb(r, g, b) {

    if (arguments.length == 1) {
        var _arguments$7 = arguments[0],
            r = _arguments$7.r,
            g = _arguments$7.g,
            b = _arguments$7.b;
    }
    var Y = brightness(r, g, b);
    var Cb = 0.564 * (b - Y);
    var Cr = 0.713 * (r - Y);

    return { y: Y, cr: Cr, cb: Cb };
}

function PivotRGB(n) {
    return (n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) * 100;
}

function RGBtoXYZ(r, g, b) {
    //sR, sG and sB (Standard RGB) input range = 0 ÷ 255
    //X, Y and Z output refer to a D65/2° standard illuminant.
    if (arguments.length == 1) {
        var _arguments$8 = arguments[0],
            r = _arguments$8.r,
            g = _arguments$8.g,
            b = _arguments$8.b;
    }

    var R = r / 255;
    var G = g / 255;
    var B = b / 255;

    R = PivotRGB(R);
    G = PivotRGB(G);
    B = PivotRGB(B);

    var x = R * 0.4124 + G * 0.3576 + B * 0.1805;
    var y = R * 0.2126 + G * 0.7152 + B * 0.0722;
    var z = R * 0.0193 + G * 0.1192 + B * 0.9505;

    return { x: x, y: y, z: z };
}

function RGBtoLAB(r, g, b) {
    if (arguments.length == 1) {
        var _arguments$9 = arguments[0],
            r = _arguments$9.r,
            g = _arguments$9.g,
            b = _arguments$9.b;
    }
    return XYZtoLAB(RGBtoXYZ(r, g, b));
}

var fromRGB = {
    RGBtoCMYK: RGBtoCMYK,
    RGBtoGray: RGBtoGray,
    RGBtoHSL: RGBtoHSL,
    RGBtoHSV: RGBtoHSV,
    RGBtoLAB: RGBtoLAB,
    RGBtoSimpleGray: RGBtoSimpleGray,
    RGBtoXYZ: RGBtoXYZ,
    RGBtoYCrCb: RGBtoYCrCb,
    c: c,
    brightness: brightness,
    gray: gray
};

function CMYKtoRGB(c, m, y, k) {

    if (arguments.length == 1) {
        var _arguments$ = arguments[0],
            c = _arguments$.c,
            m = _arguments$.m,
            y = _arguments$.y,
            k = _arguments$.k;
    }

    var R = 255 * (1 - c) * (1 - k);
    var G = 255 * (1 - m) * (1 - k);
    var B = 255 * (1 - y) * (1 - k);

    return { r: R, g: G, b: B };
}

var fromCMYK = {
    CMYKtoRGB: CMYKtoRGB
};

function ReverseXyz(n) {
    return Math.pow(n, 3) > 0.008856 ? Math.pow(n, 3) : (n - 16 / 116) / 7.787;
}

function ReverseRGB(n) {
    return n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : 12.92 * n;
}

function XYZtoRGB(x, y, z) {
    if (arguments.length == 1) {
        var _arguments$ = arguments[0],
            x = _arguments$.x,
            y = _arguments$.y,
            z = _arguments$.z;
    }
    //X, Y and Z input refer to a D65/2° standard illuminant.
    //sR, sG and sB (standard RGB) output range = 0 ÷ 255

    var X = x / 100.0;
    var Y = y / 100.0;
    var Z = z / 100.0;

    var R = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
    var G = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
    var B = X * 0.0557 + Y * -0.2040 + Z * 1.0570;

    R = ReverseRGB(R);
    G = ReverseRGB(G);
    B = ReverseRGB(B);

    var r = round(R * 255);
    var g = round(G * 255);
    var b = round(B * 255);

    return { r: r, g: g, b: b };
}

function LABtoXYZ(l, a, b) {
    if (arguments.length == 1) {
        var _arguments$2 = arguments[0],
            l = _arguments$2.l,
            a = _arguments$2.a,
            b = _arguments$2.b;
    }
    //Reference-X, Y and Z refer to specific illuminants and observers.
    //Common reference values are available below in this same page.

    var Y = (l + 16) / 116;
    var X = a / 500 + Y;
    var Z = Y - b / 200;

    Y = ReverseXyz(Y);
    X = ReverseXyz(X);
    Z = ReverseXyz(Z);

    var x = X * 95.047;
    var y = Y * 100.000;
    var z = Z * 108.883;

    return { x: x, y: y, z: z };
}





function LABtoRGB(l, a, b) {
    if (arguments.length == 1) {
        var _arguments$4 = arguments[0],
            l = _arguments$4.l,
            a = _arguments$4.a,
            b = _arguments$4.b;
    }
    return XYZtoRGB(LABtoXYZ(l, a, b));
}

var fromLAB = {
    XYZtoRGB: XYZtoRGB,
    LABtoRGB: LABtoRGB,
    LABtoXYZ: LABtoXYZ
};

/**
 * @method HSVtoRGB
 *
 * convert hsv to rgb
 *
 * 		color.HSVtoRGB(0,0,1) === #FFFFF === { r : 255, g : 0, b : 0 }
 *
 * @param {Number} H  hue color number  (min : 0, max : 360)
 * @param {Number} S  Saturation number  (min : 0, max : 1)
 * @param {Number} V  Value number 		(min : 0, max : 1 )
 * @returns {Object}
 */
function HSVtoRGB(h, s, v) {

    if (arguments.length == 1) {
        var _arguments$ = arguments[0],
            h = _arguments$.h,
            s = _arguments$.s,
            v = _arguments$.v;
    }

    var H = h;
    var S = s;
    var V = v;

    if (H >= 360) {
        H = 0;
    }

    var C = S * V;
    var X = C * (1 - Math.abs(H / 60 % 2 - 1));
    var m = V - C;

    var temp = [];

    if (0 <= H && H < 60) {
        temp = [C, X, 0];
    } else if (60 <= H && H < 120) {
        temp = [X, C, 0];
    } else if (120 <= H && H < 180) {
        temp = [0, C, X];
    } else if (180 <= H && H < 240) {
        temp = [0, X, C];
    } else if (240 <= H && H < 300) {
        temp = [X, 0, C];
    } else if (300 <= H && H < 360) {
        temp = [C, 0, X];
    }

    return {
        r: round((temp[0] + m) * 255),
        g: round((temp[1] + m) * 255),
        b: round((temp[2] + m) * 255)
    };
}

function HSVtoHSL(h, s, v) {

    if (arguments.length == 1) {
        var _arguments$2 = arguments[0],
            h = _arguments$2.h,
            s = _arguments$2.s,
            v = _arguments$2.v;
    }

    var rgb = HSVtoRGB(h, s, v);

    return RGBtoHSL(rgb.r, rgb.g, rgb.b);
}

var fromHSV = {
    HSVtoHSL: HSVtoHSL,
    HSVtoRGB: HSVtoRGB
};

function HUEtoRGB(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

function HSLtoHSV(h, s, l) {

    if (arguments.length == 1) {
        var _arguments$ = arguments[0],
            h = _arguments$.h,
            s = _arguments$.s,
            l = _arguments$.l;
    }
    var rgb = HSLtoRGB(h, s, l);

    return RGBtoHSV(rgb.r, rgb.g, rgb.b);
}

function HSLtoRGB(h, s, l) {

    if (arguments.length == 1) {
        var _arguments$2 = arguments[0],
            h = _arguments$2.h,
            s = _arguments$2.s,
            l = _arguments$2.l;
    }

    var r, g, b;

    h /= 360;
    s /= 100;
    l /= 100;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = HUEtoRGB(p, q, h + 1 / 3);
        g = HUEtoRGB(p, q, h);
        b = HUEtoRGB(p, q, h - 1 / 3);
    }

    return { r: round(r * 255), g: round(g * 255), b: round(b * 255) };
}

var fromHSL = {
    HUEtoRGB: HUEtoRGB,
    HSLtoHSV: HSLtoHSV,
    HSLtoRGB: HSLtoRGB
};

function YCrCbtoRGB(y, cr, cb, bit) {

    if (arguments.length == 1) {
        var _arguments$ = arguments[0],
            y = _arguments$.y,
            cr = _arguments$.cr,
            cb = _arguments$.cb,
            bit = _arguments$.bit;

        bit = bit || 0;
    }
    var R = y + 1.402 * (cr - bit);
    var G = y - 0.344 * (cb - bit) - 0.714 * (cr - bit);
    var B = y + 1.772 * (cb - bit);

    return { r: Math.ceil(R), g: Math.ceil(G), b: Math.ceil(B) };
}

var fromYCrCb = {
    YCrCbtoRGB: YCrCbtoRGB
};

var color_names = { aliceblue: "rgb(240, 248, 255)", antiquewhite: "rgb(250, 235, 215)", aqua: "rgb(0, 255, 255)", aquamarine: "rgb(127, 255, 212)", azure: "rgb(240, 255, 255)", beige: "rgb(245, 245, 220)", bisque: "rgb(255, 228, 196)", black: "rgb(0, 0, 0)", blanchedalmond: "rgb(255, 235, 205)", blue: "rgb(0, 0, 255)", blueviolet: "rgb(138, 43, 226)", brown: "rgb(165, 42, 42)", burlywood: "rgb(222, 184, 135)", cadetblue: "rgb(95, 158, 160)", chartreuse: "rgb(127, 255, 0)", chocolate: "rgb(210, 105, 30)", coral: "rgb(255, 127, 80)", cornflowerblue: "rgb(100, 149, 237)", cornsilk: "rgb(255, 248, 220)", crimson: "rgb(237, 20, 61)", cyan: "rgb(0, 255, 255)", darkblue: "rgb(0, 0, 139)", darkcyan: "rgb(0, 139, 139)", darkgoldenrod: "rgb(184, 134, 11)", darkgray: "rgb(169, 169, 169)", darkgrey: "rgb(169, 169, 169)", darkgreen: "rgb(0, 100, 0)", darkkhaki: "rgb(189, 183, 107)", darkmagenta: "rgb(139, 0, 139)", darkolivegreen: "rgb(85, 107, 47)", darkorange: "rgb(255, 140, 0)", darkorchid: "rgb(153, 50, 204)", darkred: "rgb(139, 0, 0)", darksalmon: "rgb(233, 150, 122)", darkseagreen: "rgb(143, 188, 143)", darkslateblue: "rgb(72, 61, 139)", darkslategray: "rgb(47, 79, 79)", darkslategrey: "rgb(47, 79, 79)", darkturquoise: "rgb(0, 206, 209)", darkviolet: "rgb(148, 0, 211)", deeppink: "rgb(255, 20, 147)", deepskyblue: "rgb(0, 191, 255)", dimgray: "rgb(105, 105, 105)", dimgrey: "rgb(105, 105, 105)", dodgerblue: "rgb(30, 144, 255)", firebrick: "rgb(178, 34, 34)", floralwhite: "rgb(255, 250, 240)", forestgreen: "rgb(34, 139, 34)", fuchsia: "rgb(255, 0, 255)", gainsboro: "rgb(220, 220, 220)", ghostwhite: "rgb(248, 248, 255)", gold: "rgb(255, 215, 0)", goldenrod: "rgb(218, 165, 32)", gray: "rgb(128, 128, 128)", grey: "rgb(128, 128, 128)", green: "rgb(0, 128, 0)", greenyellow: "rgb(173, 255, 47)", honeydew: "rgb(240, 255, 240)", hotpink: "rgb(255, 105, 180)", indianred: "rgb(205, 92, 92)", indigo: "rgb(75, 0, 130)", ivory: "rgb(255, 255, 240)", khaki: "rgb(240, 230, 140)", lavender: "rgb(230, 230, 250)", lavenderblush: "rgb(255, 240, 245)", lawngreen: "rgb(124, 252, 0)", lemonchiffon: "rgb(255, 250, 205)", lightblue: "rgb(173, 216, 230)", lightcoral: "rgb(240, 128, 128)", lightcyan: "rgb(224, 255, 255)", lightgoldenrodyellow: "rgb(250, 250, 210)", lightgreen: "rgb(144, 238, 144)", lightgray: "rgb(211, 211, 211)", lightgrey: "rgb(211, 211, 211)", lightpink: "rgb(255, 182, 193)", lightsalmon: "rgb(255, 160, 122)", lightseagreen: "rgb(32, 178, 170)", lightskyblue: "rgb(135, 206, 250)", lightslategray: "rgb(119, 136, 153)", lightslategrey: "rgb(119, 136, 153)", lightsteelblue: "rgb(176, 196, 222)", lightyellow: "rgb(255, 255, 224)", lime: "rgb(0, 255, 0)", limegreen: "rgb(50, 205, 50)", linen: "rgb(250, 240, 230)", magenta: "rgb(255, 0, 255)", maroon: "rgb(128, 0, 0)", mediumaquamarine: "rgb(102, 205, 170)", mediumblue: "rgb(0, 0, 205)", mediumorchid: "rgb(186, 85, 211)", mediumpurple: "rgb(147, 112, 219)", mediumseagreen: "rgb(60, 179, 113)", mediumslateblue: "rgb(123, 104, 238)", mediumspringgreen: "rgb(0, 250, 154)", mediumturquoise: "rgb(72, 209, 204)", mediumvioletred: "rgb(199, 21, 133)", midnightblue: "rgb(25, 25, 112)", mintcream: "rgb(245, 255, 250)", mistyrose: "rgb(255, 228, 225)", moccasin: "rgb(255, 228, 181)", navajowhite: "rgb(255, 222, 173)", navy: "rgb(0, 0, 128)", oldlace: "rgb(253, 245, 230)", olive: "rgb(128, 128, 0)", olivedrab: "rgb(107, 142, 35)", orange: "rgb(255, 165, 0)", orangered: "rgb(255, 69, 0)", orchid: "rgb(218, 112, 214)", palegoldenrod: "rgb(238, 232, 170)", palegreen: "rgb(152, 251, 152)", paleturquoise: "rgb(175, 238, 238)", palevioletred: "rgb(219, 112, 147)", papayawhip: "rgb(255, 239, 213)", peachpuff: "rgb(255, 218, 185)", peru: "rgb(205, 133, 63)", pink: "rgb(255, 192, 203)", plum: "rgb(221, 160, 221)", powderblue: "rgb(176, 224, 230)", purple: "rgb(128, 0, 128)", rebeccapurple: "rgb(102, 51, 153)", red: "rgb(255, 0, 0)", rosybrown: "rgb(188, 143, 143)", royalblue: "rgb(65, 105, 225)", saddlebrown: "rgb(139, 69, 19)", salmon: "rgb(250, 128, 114)", sandybrown: "rgb(244, 164, 96)", seagreen: "rgb(46, 139, 87)", seashell: "rgb(255, 245, 238)", sienna: "rgb(160, 82, 45)", silver: "rgb(192, 192, 192)", skyblue: "rgb(135, 206, 235)", slateblue: "rgb(106, 90, 205)", slategray: "rgb(112, 128, 144)", slategrey: "rgb(112, 128, 144)", snow: "rgb(255, 250, 250)", springgreen: "rgb(0, 255, 127)", steelblue: "rgb(70, 130, 180)", tan: "rgb(210, 180, 140)", teal: "rgb(0, 128, 128)", thistle: "rgb(216, 191, 216)", tomato: "rgb(255, 99, 71)", turquoise: "rgb(64, 224, 208)", violet: "rgb(238, 130, 238)", wheat: "rgb(245, 222, 179)", white: "rgb(255, 255, 255)", whitesmoke: "rgb(245, 245, 245)", yellow: "rgb(255, 255, 0)", yellowgreen: "rgb(154, 205, 50)", transparent: "rgba(0, 0, 0, 0)" };

function isColorName(name) {
    return !!color_names[name];
}

function getColorByName(name) {
    return color_names[name];
}

var ColorNames = {
    isColorName: isColorName,
    getColorByName: getColorByName
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var color_regexp = /(#(?:[\da-f]{3}){1,2}|rgb\((?:\s*\d{1,3},\s*){2}\d{1,3}\s*\)|rgba\((?:\s*\d{1,3},\s*){3}\d*\.?\d+\s*\)|hsl\(\s*\d{1,3}(?:,\s*\d{1,3}%){2}\s*\)|hsla\(\s*\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\s*\)|([\w_\-]+))/gi;
var color_split = ',';

function matches(str) {
    var matches = str.match(color_regexp);
    var result = [];

    if (!matches) {
        return result;
    }

    for (var i = 0, len = matches.length; i < len; i++) {

        if (matches[i].indexOf('#') > -1 || matches[i].indexOf('rgb') > -1 || matches[i].indexOf('hsl') > -1) {
            result.push({ color: matches[i] });
        } else {
            var nameColor = ColorNames.getColorByName(matches[i]);

            if (nameColor) {
                result.push({ color: matches[i], nameColor: nameColor });
            }
        }
    }

    var pos = { next: 0 };
    result.forEach(function (item) {
        var startIndex = str.indexOf(item.color, pos.next);

        item.startIndex = startIndex;
        item.endIndex = startIndex + item.color.length;

        pos.next = item.endIndex;
    });

    return result;
}

function convertMatches(str) {
    var m = matches(str);

    m.forEach(function (it, index) {
        str = str.replace(it.color, '@' + index);
    });

    return { str: str, matches: m };
}

function convertMatchesArray(str) {
    var splitStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';

    var ret = convertMatches(str);
    return ret.str.split(splitStr).map(function (it, index) {
        it = trim(it);

        if (ret.matches[index]) {
            it = it.replace('@' + index, ret.matches[index].color);
        }

        return it;
    });
}

function reverseMatches(str, matches) {
    matches.forEach(function (it, index) {
        str = str.replace('@' + index, it.color);
    });

    return str;
}

function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

/**
 * @method rgb
 *
 * parse string to rgb color
 *
 * 		color.parse("#FF0000") === { r : 255, g : 0, b : 0 }
 *
 * 		color.parse("rgb(255, 0, 0)") == { r : 255, g : 0, b :0 }
 * 		color.parse(0xff0000) == { r : 255, g : 0, b : 0 }
 * 		color.parse(0xff000000) == { r : 255, g : 0, b : 0, a: 0 }
 *
 * @param {String} str color string
 * @returns {Object}  rgb object
 */
function parse(str) {
    if (typeof str == 'string') {

        if (ColorNames.isColorName(str)) {
            str = ColorNames.getColorByName(str);
        }

        if (str.indexOf("rgb(") > -1) {
            var arr = str.replace("rgb(", "").replace(")", "").split(",");

            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i] = parseInt(trim(arr[i]), 10);
            }

            var obj = { type: 'rgb', r: arr[0], g: arr[1], b: arr[2], a: 1 };

            obj = Object.assign(obj, RGBtoHSL(obj));

            return obj;
        } else if (str.indexOf("rgba(") > -1) {
            var arr = str.replace("rgba(", "").replace(")", "").split(",");

            for (var i = 0, len = arr.length; i < len; i++) {

                if (len - 1 == i) {
                    arr[i] = parseFloat(trim(arr[i]));
                } else {
                    arr[i] = parseInt(trim(arr[i]), 10);
                }
            }

            var obj = { type: 'rgb', r: arr[0], g: arr[1], b: arr[2], a: arr[3] };

            obj = Object.assign(obj, RGBtoHSL(obj));

            return obj;
        } else if (str.indexOf("hsl(") > -1) {
            var arr = str.replace("hsl(", "").replace(")", "").split(",");

            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i] = parseFloat(trim(arr[i]));
            }

            var obj = { type: 'hsl', h: arr[0], s: arr[1], l: arr[2], a: 1 };

            obj = Object.assign(obj, HSLtoRGB(obj));

            return obj;
        } else if (str.indexOf("hsla(") > -1) {
            var arr = str.replace("hsla(", "").replace(")", "").split(",");

            for (var i = 0, len = arr.length; i < len; i++) {

                if (len - 1 == i) {
                    arr[i] = parseFloat(trim(arr[i]));
                } else {
                    arr[i] = parseInt(trim(arr[i]), 10);
                }
            }

            var obj = { type: 'hsl', h: arr[0], s: arr[1], l: arr[2], a: arr[3] };

            obj = Object.assign(obj, HSLtoRGB(obj));

            return obj;
        } else if (str.indexOf("#") == 0) {

            str = str.replace("#", "");

            var arr = [];
            if (str.length == 3) {
                for (var i = 0, len = str.length; i < len; i++) {
                    var char = str.substr(i, 1);
                    arr.push(parseInt(char + char, 16));
                }
            } else {
                for (var i = 0, len = str.length; i < len; i += 2) {
                    arr.push(parseInt(str.substr(i, 2), 16));
                }
            }

            var obj = { type: 'hex', r: arr[0], g: arr[1], b: arr[2], a: 1 };

            obj = Object.assign(obj, RGBtoHSL(obj));

            return obj;
        }
    } else if (typeof str == 'number') {
        if (0x000000 <= str && str <= 0xffffff) {
            var r = (str & 0xff0000) >> 16;
            var g = (str & 0x00ff00) >> 8;
            var b = (str & 0x0000ff) >> 0;

            var obj = { type: 'hex', r: r, g: g, b: b, a: 1 };
            obj = Object.assign(obj, RGBtoHSL(obj));
            return obj;
        } else if (0x00000000 <= str && str <= 0xffffffff) {
            var _r = (str & 0xff000000) >> 24;
            var _g = (str & 0x00ff0000) >> 16;
            var _b = (str & 0x0000ff00) >> 8;
            var a = (str & 0x000000ff) / 255;

            var obj = { type: 'hex', r: _r, g: _g, b: _b, a: a };
            obj = Object.assign(obj, RGBtoHSL(obj));

            return obj;
        }
    }

    return str;
}

function parseGradient(colors) {
    if (typeof colors == 'string') {
        colors = convertMatchesArray(colors);
    }

    colors = colors.map(function (it) {
        if (typeof it == 'string') {
            var ret = convertMatches(it);
            var arr = trim(ret.str).split(' ');

            if (arr[1]) {
                if (arr[1].includes('%')) {
                    arr[1] = parseFloat(arr[1].replace(/%/, '')) / 100;
                } else {
                    arr[1] = parseFloat(arr[1]);
                }
            } else {
                arr[1] = '*';
            }

            arr[0] = reverseMatches(arr[0], ret.matches);

            return arr;
        } else if (Array.isArray(it)) {

            if (!it[1]) {
                it[1] = '*';
            } else if (typeof it[1] == 'string') {
                if (it[1].includes('%')) {
                    it[1] = parseFloat(it[1].replace(/%/, '')) / 100;
                } else {
                    it[1] = +it[1];
                }
            }

            return [].concat(toConsumableArray(it));
        }
    });

    var count = colors.filter(function (it) {
        return it[1] === '*';
    }).length;

    if (count > 0) {
        var sum = colors.filter(function (it) {
            return it[1] != '*' && it[1] != 1;
        }).map(function (it) {
            return it[1];
        }).reduce(function (total, cur) {
            return total + cur;
        }, 0);

        var dist = (1 - sum) / count;
        colors.forEach(function (it, index) {
            if (it[1] == '*' && index > 0) {
                if (colors.length - 1 == index) {
                    // it[1] = 1 
                } else {
                    it[1] = dist;
                }
            }
        });
    }

    return colors;
}

var parser = {
    matches: matches,
    convertMatches: convertMatches,
    convertMatchesArray: convertMatchesArray,
    reverseMatches: reverseMatches,
    parse: parse,
    parseGradient: parseGradient,
    trim: trim,
    color_regexp: color_regexp,
    color_split: color_split
};

/**
 * @deprecated 
 * 
 * instead of this,  use blend function 
 *  
 * @param {*} startColor 
 * @param {*} endColor 
 * @param {*} t 
 */
function interpolateRGB(startColor, endColor) {
    var t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var exportFormat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

    var obj = {
        r: round(startColor.r + (endColor.r - startColor.r) * t),
        g: round(startColor.g + (endColor.g - startColor.g) * t),
        b: round(startColor.b + (endColor.b - startColor.b) * t),
        a: round(startColor.a + (endColor.a - startColor.a) * t, 100)
    };

    return format(obj, obj.a < 1 ? 'rgb' : exportFormat);
}

function scale(scale) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

    if (!scale) return [];

    if (typeof scale === 'string') {
        scale = convertMatchesArray(scale);
    }

    scale = scale || [];
    var len = scale.length;

    var colors = [];
    for (var i = 0; i < len - 1; i++) {
        for (var index = 0; index < count; index++) {
            colors.push(blend(scale[i], scale[i + 1], index / count));
        }
    }
    return colors;
}

function blend(startColor, endColor) {
    var ratio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var format$$1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

    var s = parse(startColor);
    var e = parse(endColor);

    return interpolateRGB(s, e, ratio, format$$1);
}

function mix(startcolor, endColor) {
    var ratio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var format$$1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

    return blend(startcolor, endColor, ratio, format$$1);
}

/**
 * 
 * @param {Color|String} c 
 */
function contrast(c$$1) {
    c$$1 = parse(c$$1);
    return (Math.round(c$$1.r * 299) + Math.round(c$$1.g * 587) + Math.round(c$$1.b * 114)) / 1000;
}

function contrastColor(c$$1) {
    return contrast(c$$1) >= 128 ? 'black' : 'white';
}

function gradient(colors) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    colors = parseGradient(colors);

    var newColors = [];
    var maxCount = count - (colors.length - 1);
    var allCount = maxCount;

    for (var i = 1, len = colors.length; i < len; i++) {

        var startColor = colors[i - 1][0];
        var endColor = colors[i][0];

        // if it is second color
        var rate = i == 1 ? colors[i][1] : colors[i][1] - colors[i - 1][1];

        // if it is last color 
        var colorCount = i == colors.length - 1 ? allCount : Math.floor(rate * maxCount);

        newColors = newColors.concat(scale([startColor, endColor], colorCount), [endColor]);

        allCount -= colorCount;
    }
    return newColors;
}

function scaleHSV(color) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'h';
    var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 9;
    var exportFormat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'rgb';
    var min = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var max = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
    var dist = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 100;

    var colorObj = parse(color);
    var hsv = RGBtoHSV(colorObj);
    var unit = (max - min) * dist / count;

    var results = [];
    for (var i = 1; i <= count; i++) {
        hsv[target] = Math.abs((dist - unit * i) / dist);
        results.push(format(HSVtoRGB(hsv), exportFormat));
    }

    return results;
}

function scaleH(color) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9;
    var exportFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgb';
    var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 360;

    return scaleHSV(color, 'h', count, exportFormat, min, max, 1);
}

function scaleS(color) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9;
    var exportFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgb';
    var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    return scaleHSV(color, 's', count, exportFormat, min, max, 100);
}

function scaleV(color) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9;
    var exportFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgb';
    var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    return scaleHSV(color, 'v', count, exportFormat, min, max, 100);
}

/* predefined scale colors */
scale.parula = function (count) {
    return scale(['#352a87', '#0f5cdd', '#00b5a6', '#ffc337', '#fdff00'], count);
};

scale.jet = function (count) {
    return scale(['#00008f', '#0020ff', '#00ffff', '#51ff77', '#fdff00', '#ff0000', '#800000'], count);
};

scale.hsv = function (count) {
    return scale(['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'], count);
};

scale.hot = function (count) {
    return scale(['#0b0000', '#ff0000', '#ffff00', '#ffffff'], count);
};
scale.pink = function (count) {
    return scale(['#1e0000', '#bd7b7b', '#e7e5b2', '#ffffff'], count);
};

scale.bone = function (count) {
    return scale(['#000000', '#4a4a68', '#a6c6c6', '#ffffff'], count);
};

scale.copper = function (count) {
    return scale(['#000000', '#3d2618', '#9d623e', '#ffa167', '#ffc77f'], count);
};

var mixin = {
    interpolateRGB: interpolateRGB,
    blend: blend,
    mix: mix,
    scale: scale,
    contrast: contrast,
    contrastColor: contrastColor,
    gradient: gradient,
    scaleHSV: scaleHSV,
    scaleH: scaleH,
    scaleS: scaleS,
    scaleV: scaleV
};

function array_equals(v1, v2) {
    if (v1.length !== v2.length) return false;
    for (var i = 0, len = v1.length; i < len; ++i) {
        if (v1[i] !== v2[i]) return false;
    }
    return true;
}

function euclidean(v1, v2) {
    var total = 0;

    for (var i = 0, len = v1.length; i < len; i++) {
        total += Math.pow(v2[i] - v1[i], 2);
    }

    return Math.sqrt(total);
}

function manhattan(v1, v2) {
    var total = 0;

    for (var i = 0, len = v1.length; i < len; i++) {
        total += Math.abs(v2[i] - v1[i]);
    }

    return total;
}

function max(v1, v2) {
    var max = 0;
    for (var i = 0, len = v1.length; i < len; i++) {
        max = Math.max(max, Math.abs(v2[i] - v1[i]));
    }

    return max;
}

var distances = {
    euclidean: euclidean,
    manhattan: manhattan,
    max: max
};

var create_random_number = {
    linear: function linear(num, count) {
        var centeroids = [];
        var start = Math.round(Math.random() * num);
        var dist = Math.floor(num / count);

        do {

            centeroids.push(start);

            start = (start + dist) % num;
        } while (centeroids.length < count);

        return centeroids;
    },

    shuffle: function shuffle(num, count) {
        var centeroids = [];

        while (centeroids.length < count) {

            var index = Math.round(Math.random() * num);

            if (centeroids.indexOf(index) == -1) {
                centeroids.push(index);
            }
        }

        return centeroids;
    }

};

function randomCentroids(points, k) {
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';


    var centeroids = create_random_number[method](points.length, k);

    return centeroids.map(function (i) {
        return points[i];
    });

    // var centeroids = points.slice(0);

    // centeroids.sort(function () {
    //     return (Math.round(Math.random()) - 0.5);
    // })

    // return centeroids.slice(0, k); 
}

function closestCenteroid(point, centeroids, distance) {
    var min = Infinity,
        kIndex = 0;

    centeroids.forEach(function (center, i) {
        var dist = distance(point, center);

        if (dist < min) {
            min = dist;
            kIndex = i;
        }
    });

    return kIndex;
}

function getCenteroid(assigned) {

    if (!assigned.length) return [];

    // initialize centeroid list 
    var centeroid = new Array(assigned[0].length);
    for (var i = 0, len = centeroid.length; i < len; i++) {
        centeroid[i] = 0;
    }

    for (var index = 0, len = assigned.length; index < len; index++) {
        var it = assigned[index];

        var last = index + 1;

        for (var j = 0, jLen = it.length; j < jLen; j++) {
            centeroid[j] += (it[j] - centeroid[j]) / last;
        }
    }

    centeroid = centeroid.map(function (it) {
        return Math.floor(it);
    });

    return centeroid;
}

function unique_array(arrays) {
    return arrays;
    var set = {};
    var count = arrays.length;
    var it = null;
    while (count--) {
        it = arrays[count];
        set[JSON.stringify(it)] = it;
    }

    return Object.values(set);
}

function splitK(k, points, centeroids, distance) {
    var assignment = new Array(k);

    for (var i = 0; i < k; i++) {
        assignment[i] = [];
    }

    for (var idx = 0, pointLength = points.length; idx < pointLength; idx++) {
        var point = points[idx];
        var index = closestCenteroid(point, centeroids, distance);
        assignment[index].push(point);
    }

    return assignment;
}

function setNewCenteroid(k, points, assignment, centeroids, movement, randomFunction) {

    for (var i = 0; i < k; i++) {
        var assigned = assignment[i];

        var centeroid = centeroids[i];
        var newCenteroid = new Array(centeroid.length);

        if (assigned.length > 0) {
            newCenteroid = getCenteroid(assigned);
        } else {
            var idx = Math.floor(randomFunction() * points.length);
            newCenteroid = points[idx];
        }

        if (array_equals(newCenteroid, centeroid)) {
            movement = false;
        } else {
            movement = true;
        }

        centeroids[i] = newCenteroid;
    }

    return movement;
}

function kmeans(points, k, distanceFunction) {
    var period = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
    var initialRandom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'linear';

    points = unique_array(points);

    k = k || Math.max(2, Math.ceil(Math.sqrt(points.length / 2)));

    var distance = distanceFunction || 'euclidean';
    if (typeof distance == 'string') {
        distance = distances[distance];
    }

    var rng_seed = 0;
    var random = function random() {
        rng_seed = (rng_seed * 9301 + 49297) % 233280;
        return rng_seed / 233280;
    };

    var centeroids = randomCentroids(points, k, initialRandom);

    var movement = true;
    var iterations = 0;
    while (movement) {
        var assignment = splitK(k, points, centeroids, distance);

        movement = setNewCenteroid(k, points, assignment, centeroids, false, random);

        iterations++;

        if (iterations % period == 0) {
            break;
        }
    }

    return centeroids;
}

function each(len, callback) {
    for (var i = 0; i < len; i += 4) {
        callback(i);
    }
}

function pack(bitmap, callback) {

    each(bitmap.pixels.length, function (i) {
        callback(bitmap.pixels, i);
    });
}

var Canvas = {
    create: function create(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width || 0;
        canvas.height = height || 0;

        return canvas;
    },
    drawPixels: function drawPixels(bitmap) {
        var canvas = this.create(bitmap.width, bitmap.height);

        var context = canvas.getContext('2d');
        var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

        imagedata.data.set(bitmap.pixels);

        context.putImageData(imagedata, 0, 0);

        return canvas;
    },
    createHistogram: function createHistogram(width, height, histogram, callback) {
        var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { black: true, red: false, green: false, blue: false };

        var canvas = this.create(width, height);
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);
        context.globalAlpha = 0.7;

        var omit = { black: false };
        if (opt.black) {
            omit.black = false;
        } else {
            omit.black = true;
        }
        if (opt.red) {
            omit.red = false;
        } else {
            omit.red = true;
        }
        if (opt.green) {
            omit.green = false;
        } else {
            omit.green = true;
        }
        if (opt.blue) {
            omit.blue = false;
        } else {
            omit.blue = true;
        }

        Object.keys(histogram).forEach(function (color) {

            if (!omit[color]) {

                var array = histogram[color];
                var ymax = Math.max.apply(Math, array);
                var unitWith = width / array.length;

                context.fillStyle = color;
                array.forEach(function (it, index) {
                    var currentHeight = height * (it / ymax);
                    var x = index * unitWith;

                    context.fillRect(x, height - currentHeight, unitWith, currentHeight);
                });
            }
        });

        if (typeof callback == 'function') callback(canvas);
    },
    getHistogram: function getHistogram(bitmap) {
        var black = new Array(256);
        var red = new Array(256);
        var green = new Array(256);
        var blue = new Array(256);
        for (var i = 0; i < 256; i++) {
            black[i] = 0;
            red[i] = 0;
            green[i] = 0;
            blue[i] = 0;
        }

        pack(bitmap, function (pixels, i) {
            // gray scale 
            var grayIndex = Math.round(Color$1.brightness(pixels[i], pixels[i + 1], pixels[i + 2]));
            black[grayIndex]++;

            red[pixels[i]]++;
            green[pixels[i + 1]]++;
            blue[pixels[i + 2]]++;
        });

        return { black: black, red: red, green: green, blue: blue };
    },
    getBitmap: function getBitmap(bitmap, area) {
        var canvas = this.drawPixels(bitmap);

        var context = canvas.getContext('2d');
        var pixels = context.getImageData(area.x || 0, area.y || 0, area.width || canvas.width, area.height || canvas.height).data;

        return { pixels: pixels, width: area.width, height: area.height };
    },
    putBitmap: function putBitmap(bitmap, subBitmap, area) {

        var canvas = this.drawPixels(bitmap);
        var subCanvas = this.drawPixels(subBitmap);

        var context = canvas.getContext('2d');
        context.drawImage(subCanvas, area.x, area.y);

        bitmap.pixels = context.getImageData(0, 0, bitmap.width, bitmap.height).data;

        return bitmap;
    }
};

var ImageLoader = function () {
    function ImageLoader(url) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, ImageLoader);

        this.isLoaded = false;
        this.imageUrl = url;
        this.opt = opt;
        this.initialize();
    }

    createClass(ImageLoader, [{
        key: 'initialize',
        value: function initialize() {
            this.canvas = this.createCanvas();
            this.context = this.canvas.getContext('2d');
        }
    }, {
        key: 'createCanvas',
        value: function createCanvas() {
            return document.createElement('canvas');
        }
    }, {
        key: 'load',
        value: function load(callback) {
            this.loadImage(callback);
        }
    }, {
        key: 'loadImage',
        value: function loadImage(callback) {
            var _this = this;

            this.getImage(function (img) {
                var ratio = img.height / img.width;

                if (_this.opt.canvasWidth && _this.opt.canvasHeight) {
                    _this.canvas.width = _this.opt.canvasWidth;
                    _this.canvas.height = _this.opt.canvasHeight;
                } else {
                    _this.canvas.width = _this.opt.maxWidth ? _this.opt.maxWidth : img.width;
                    _this.canvas.height = _this.canvas.width * ratio;
                }

                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, _this.canvas.width, _this.canvas.height);
                _this.isLoaded = true;
                callback && callback();
            });
        }
    }, {
        key: 'getImage',
        value: function getImage(callback) {
            var ctx = this.context;
            this.newImage = new Image();
            var img = this.newImage;
            img.onload = function () {
                callback && callback(img);
            };

            this.getImageUrl(function (url) {
                img.src = url;
            });
        }
    }, {
        key: 'load',
        value: function load(callback) {
            var _this2 = this;

            this.newImage = new Image();
            var img = this.newImage;
            img.onload = function () {
                _this2.isLoaded = true;
                callback && callback();
            };

            this.getImageUrl(function (url) {
                img.src = url;
            });
        }
    }, {
        key: 'getImageUrl',
        value: function getImageUrl(callback) {
            if (typeof this.imageUrl == 'string') {
                return callback(this.imageUrl);
            } else if (this.imageUrl instanceof Blob) {
                var reader = new FileReader();

                reader.onload = function (ev) {
                    callback(ev.target.result);
                };

                reader.readAsDataURL(this.imageUrl);
            }
        }
    }, {
        key: 'getRGBA',
        value: function getRGBA(r, g, b, a) {
            return [r, g, b, a];
        }
    }, {
        key: 'toArray',
        value: function toArray$$1(filter, callback) {
            var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var imagedata = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var width = imagedata.width;
            var height = imagedata.height;

            var pixels = new Uint8ClampedArray(imagedata.data);

            var bitmap = { pixels: pixels, width: width, height: height };

            if (!filter) {
                filter = function () {
                    return function (bitmap, done) {
                        done(bitmap);
                    };
                }();
            }

            filter(bitmap, function (newBitmap) {
                var tmpCanvas = Canvas.drawPixels(newBitmap);

                if (opt.returnTo == 'canvas') {
                    callback(tmpCanvas);
                } else {
                    callback(tmpCanvas.toDataURL(opt.outputFormat || 'image/png'));
                }
            }, opt);
        }
    }, {
        key: 'toHistogram',
        value: function toHistogram(opt) {
            var imagedata = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var width = imagedata.width;
            var height = imagedata.height;

            var pixels = new Uint8ClampedArray(imagedata.data);

            var bitmap = { pixels: pixels, width: width, height: height };

            return Canvas.getHistogram(bitmap);
        }
    }, {
        key: 'toRGB',
        value: function toRGB() {
            var imagedata = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            var rgba = imagedata.data;
            var results = [];
            for (var i = 0, len = rgba.length; i < len; i += 4) {
                results[results.length] = [rgba[i + 0], rgba[i + 1], rgba[i + 2], rgba[i + 3]];
            }

            return results;
        }
    }]);
    return ImageLoader;
}();

var CONSTANT = {
    identity: function identity() {
        return [1, 0, 0, 0, 1, 0, 0, 0, 1];
    },
    stretching: function stretching(k) {
        return [k, 0, 0, 0, 1, 0, 0, 0, 1];
    },
    squeezing: function squeezing(k) {
        return [k, 0, 0, 0, 1 / k, 0, 0, 0, 1];
    },
    scale: function scale() {
        var sx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var sy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        sx = sx || sx === 0 ? sx : 1;
        sy = sy || sy === 0 ? sy : 1;
        return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
    },
    scaleX: function scaleX(sx) {
        return this.scale(sx);
    },
    scaleY: function scaleY(sy) {
        return this.scale(1, sy);
    },
    translate: function translate(tx, ty) {
        return [1, 0, tx, 0, 1, ty, 0, 0, 1];
    },
    rotate: function rotate(angle) {
        var r = this.radian(angle);
        return [Math.cos(r), -Math.sin(r), 0, Math.sin(r), Math.cos(r), 0, 0, 0, 1];
    },
    rotate90: function rotate90() {
        return [0, -1, 0, 1, 0, 0, 0, 0, 1];
    },
    rotate180: function rotate180() {
        return [-1, 0, 0, 0, -1, 0, 0, 0, 1];
    },
    rotate270: function rotate270() {
        return [0, 1, 0, -1, 0, 0, 0, 0, 1];
    },
    radian: function radian(degree) {
        return degree * Math.PI / 180;
    },
    skew: function skew(degreeX, degreeY) {
        var radianX = this.radian(degreeX);
        var radianY = this.radian(degreeY);
        return [1, Math.tan(radianX), 0, Math.tan(radianY), 1, 0, 0, 0, 1];
    },
    skewX: function skewX(degreeX) {
        var radianX = this.radian(degreeX);

        return [1, Math.tan(radianX), 0, 0, 1, 0, 0, 0, 1];
    },
    skewY: function skewY(degreeY) {
        var radianY = this.radian(degreeY);

        return [1, 0, 0, Math.tan(radianY), 1, 0, 0, 0, 1];
    },
    shear1: function shear1(angle) {
        return [1, -Math.tan(this.radian(angle) / 2), 0, 0, 1, 0, 0, 0, 1];
    },
    shear2: function shear2(angle) {
        return [1, 0, 0, Math.sin(this.radian(angle)), 1, 0, 0, 0, 1];
    }
};

var Matrix = {
    CONSTANT: CONSTANT,

    radian: function radian(angle) {
        return CONSTANT.radian(angle);
    },
    multiply: function multiply(A, C) {
        // console.log(JSON.stringify(A), JSON.stringify(C))
        return [A[0] * C[0] + A[1] * C[1] + A[2] * C[2], A[3] * C[0] + A[4] * C[1] + A[5] * C[2], A[6] * C[0] + A[7] * C[1] + A[8] * C[2]];
    },
    identity: function identity(B) {
        return this.multiply(CONSTANT.identity(), B);
    },
    translate: function translate(x, y, B) {
        return this.multiply(CONSTANT.translate(x, y), B);
    },
    rotate: function rotate(angle, B) {
        return this.multiply(CONSTANT.rotate(angle), B);
    },
    shear1: function shear1(angle, B) {
        return this.multiply(CONSTANT.shear1(angle), B);
    },
    shear2: function shear2(angle, B) {
        return this.multiply(CONSTANT.shear2(angle), B);
    },
    rotateShear: function rotateShear(angle, B) {

        var arr = B;

        arr = this.shear1(angle, arr);
        arr = this.shear2(angle, arr);
        arr = this.shear1(angle, arr);

        return arr;
    }
};

function crop() {
    var startX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var startY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments[2];
    var height = arguments[3];


    var newBitmap = createBitmap(width * height * 4, width, height);

    return function (bitmap, done) {
        for (var y = startY, realY = 0; y < height; y++, realY++) {
            for (var x = startX, realX = 0; x < width; x++, realX++) {
                newBitmap.pixels[realY * width * realX] = bitmap.pixels[y * width * x];
            }
        }

        done(newBitmap);
    };
}

// Image manupulate 
function resize(dstWidth, dstHeight) {
    return function (bitmap, done) {
        var c = Canvas.drawPixels(bitmap);
        var context = c.getContext('2d');

        c.width = dstWidth;
        c.height = dstHeight;

        done({
            pixels: new Uint8ClampedArray(context.getImageData(0, 0, dstWidth, dstHeight).data),
            width: dstWidth,
            height: dstHeight
        });
    };
}

function flipV() {
    return function (bitmap, done) {
        var width = bitmap.width;
        var height = bitmap.height;
        var isCenter = height % 2 == 1 ? 1 : 0;

        var halfHeight = isCenter ? Math.floor(height / 2) : height / 2;

        for (var y = 0; y < halfHeight; y++) {
            for (var x = 0; x < width; x++) {

                var startIndex = y * width + x << 2;
                var endIndex = (height - 1 - y) * width + x << 2;
                swapColor(bitmap.pixels, startIndex, endIndex);
            }
        }

        done(bitmap);
    };
}

function flipH() {
    return function (bitmap, done) {
        var width = bitmap.width;
        var height = bitmap.height;
        var isCenter = width % 2 == 1 ? 1 : 0;

        var halfWidth = isCenter ? Math.floor(width / 2) : width / 2;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < halfWidth; x++) {

                var startIndex = y * width + x << 2;
                var endIndex = y * width + (width - 1 - x) << 2;
                swapColor(bitmap.pixels, startIndex, endIndex);
            }
        }

        done(bitmap);
    };
}

function rotateDegree(angle) {
    var cx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'center';
    var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'center';

    // const r = F.radian(angle)

    return function (bitmap, done) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var newBitmap = createBitmap(bitmap.pixels.length, bitmap.width, bitmap.height);
        var width = bitmap.width;
        var height = bitmap.height;

        if (cx == 'center') {
            cx = Math.floor(width / 2);
        }

        if (cy == 'center') {
            cy = Math.floor(height / 2);
        }

        var translateMatrix = Matrix.CONSTANT.translate(-cx, -cy);
        var translateMatrix2 = Matrix.CONSTANT.translate(cx, cy);
        var shear1Matrix = Matrix.CONSTANT.shear1(angle);
        var shear2Matrix = Matrix.CONSTANT.shear2(angle);

        packXY(function (pixels, i, x, y) {
            // console.log(x, y, i)
            var arr = Matrix.multiply(translateMatrix, [x, y, 1]);

            arr = Matrix.multiply(shear1Matrix, arr).map(Math.round);
            arr = Matrix.multiply(shear2Matrix, arr).map(Math.round);
            arr = Matrix.multiply(shear1Matrix, arr).map(Math.round);
            arr = Matrix.multiply(translateMatrix2, arr);

            var _arr = arr,
                _arr2 = slicedToArray(_arr, 2),
                x1 = _arr2[0],
                y1 = _arr2[1];

            if (x1 < 0) return;
            if (y1 < 0) return;
            if (x1 > width - 1) return;
            if (y1 > height - 1) return;

            var endIndex = y1 * width + x1 << 2; //  bit 2 shift is  * 4  

            fillPixelColor(pixels, endIndex, bitmap.pixels, i);
        })(newBitmap, function () {
            done(newBitmap);
        }, opt);
    };
}

function rotate() {
    var degree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    degree = parseParamNumber$1(degree);
    degree = degree % 360;
    return function (bitmap, done) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


        if (degree == 0) return bitmap;

        if (degree == 90 || degree == 270) {
            var newBitmap = createBitmap(bitmap.pixels.length, bitmap.height, bitmap.width);
        } else if (degree == 180) {
            var newBitmap = createBitmap(bitmap.pixels.length, bitmap.width, bitmap.height);
        } else {
            return rotateDegree(degree)(bitmap, done, opt);
        }
        packXY(function (pixels, i, x, y) {

            if (degree == 90) {
                var endIndex = x * newBitmap.width + (newBitmap.width - 1 - y) << 2; //  << 2 is equals to (multiply)* 4 
            } else if (degree == 270) {
                var endIndex = (newBitmap.height - 1 - x) * newBitmap.width + y << 2;
            } else if (degree == 180) {
                var endIndex = (newBitmap.height - 1 - y) * newBitmap.width + (newBitmap.width - 1 - x) << 2;
            }

            fillPixelColor(newBitmap.pixels, endIndex, bitmap.pixels, i);
        })(bitmap, function () {
            done(newBitmap);
        }, opt);
    };
}

function histogram$1() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'gray';
    var points = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var $realPoints = [];

    for (var i = 0; i < points.length - 1; i++) {
        var sp = points[i];
        var ep = points[i + 1];

        var distX = ep[0] - sp[0];
        var distY = ep[1] - sp[1];

        var rate = distY / distX;

        for (var realIndex = 0, start = sp[0]; realIndex < distX; realIndex++, start++) {
            $realPoints[start] = sp[1] + realIndex * rate;
        }
    }

    $realPoints[255] = 255;

    if (type === 'red') {
        return pixel(function () {
            $r = $realPoints[$r];
        }, {}, { $realPoints: $realPoints });
    } else if (type === 'green') {
        return pixel(function () {
            $g = $realPoints[$g];
        }, {}, { $realPoints: $realPoints });
    } else if (type === 'blue') {
        return pixel(function () {
            $b = $realPoints[$b];
        }, {}, { $realPoints: $realPoints });
    } else {
        return pixel(function () {

            var l = Color.RGBtoYCrCb($r, $g, $b);
            var c = Color.YCrCbtoRGB(clamp($realPoints[clamp(l.y)]), l.cr, l.cb, 0);
            $r = c.r;
            $g = c.g;
            $b = c.b;
        }, {}, { $realPoints: $realPoints });
    }
}

var image$1 = {
    crop: crop,
    resize: resize,
    flipH: flipH,
    flipV: flipV,
    rotate: rotate,
    rotateDegree: rotateDegree,
    histogram: histogram$1,
    'rotate-degree': rotateDegree
};

function bitonal(darkColor, lightColor) {
    var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

    var $darkColor = Color$1.parse(darkColor);
    var $lightColor = Color$1.parse(lightColor);
    var $threshold = threshold;

    return pixel(function () {
        var thresholdColor = $r + $g + $b <= $threshold ? $darkColor : $lightColor;

        $r = thresholdColor.r;
        $g = thresholdColor.g;
        $b = thresholdColor.b;
    }, {
        $threshold: $threshold
    }, {
        $darkColor: $darkColor,
        $lightColor: $lightColor
    });
}

/*
 * @param {Number} amount  -100..100  ,  value < 0  is darken, value > 0 is brighten 
 */
function brightness$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    amount = parseParamNumber$1(amount);
    var $C = Math.floor(255 * (amount / 100));

    return pixel(function () {
        $r += $C;
        $g += $C;
        $b += $C;
    }, { $C: $C });
}

function brownie() {

    var $matrix = [0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0, -0.037703249837783157, 0.8609577587992641, 0.15059552388459913, 0, 0.24113635128153335, -0.07441037908422492, 0.44972182064877153, 0, 0, 0, 0, 1];

    return pixel(function () {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a;
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a;
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a;
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a;
    }, {
        $matrix: $matrix
    });
}

/**
 * 
 * @param {Number} amount from 0 to 100 
 */
function clip() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    amount = parseParamNumber$1(amount);
    var $C = Math.abs(amount) * 2.55;

    return pixel(function () {

        $r = $r > 255 - $C ? 255 : 0;
        $g = $g > 255 - $C ? 255 : 0;
        $b = $b > 255 - $C ? 255 : 0;
    }, { $C: $C });
}

/**
 * 
 * @param {*} amount   min = -128, max = 128 
 */
function contrast$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    amount = parseParamNumber$1(amount);
    var $C = Math.max((128 + amount) / 128, 0);

    return pixel(function () {
        $r *= $C;
        $g *= $C;
        $b *= $C;
    }, { $C: $C });
}

function gamma() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var $C = parseParamNumber$1(amount);
    return pixel(function () {
        $r = Math.pow($r / 255, $C) * 255;
        $g = Math.pow($g / 255, $C) * 255;
        $b = Math.pow($b / 255, $C) * 255;
    }, { $C: $C });
}

/**
 * F.gradient('red', 'blue', 'yellow', 'white', 10)
 * F.gradient('red, blue, yellow, white, 10')
 */
function gradient$1() {
    // 전체 매개변수 기준으로 파싱 
    // 색이 아닌 것 기준으로 scale 변수로 인식 

    var params = [].concat(Array.prototype.slice.call(arguments));

    if (params.length === 1 && typeof params[0] === 'string') {
        params = Color$1.convertMatchesArray(params[0]);
    }

    params = params.map(function (arg) {
        var res = Color$1.matches(arg);

        if (!res.length) {
            return { type: 'scale', value: arg };
        }

        return { type: 'param', value: arg };
    });

    var $scale = params.filter(function (it) {
        return it.type == 'scale';
    })[0];
    $scale = $scale ? +$scale.value : 256;

    params = params.filter(function (it) {
        return it.type == 'param';
    }).map(function (it) {
        return it.value;
    }).join(',');

    var $colors = Color$1.gradient(params, $scale).map(function (c) {
        var _Color$parse = Color$1.parse(c),
            r = _Color$parse.r,
            g = _Color$parse.g,
            b = _Color$parse.b,
            a = _Color$parse.a;

        return { r: r, g: g, b: b, a: a };
    });

    return pixel(function () {
        var colorIndex = clamp(Math.ceil($r * 0.2126 + $g * 0.7152 + $b * 0.0722));
        var newColorIndex = clamp(Math.floor(colorIndex * ($scale / 256)));
        var color = $colors[newColorIndex];

        $r = color.r;
        $g = color.g;
        $b = color.b;
        $a = clamp(Math.floor(color.a * 256));
    }, {}, { $colors: $colors, $scale: $scale });
}

function grayscale(amount) {
    amount = parseParamNumber$1(amount);
    var C = amount / 100;

    if (C > 1) C = 1;

    var $matrix = [0.2126 + 0.7874 * (1 - C), 0.7152 - 0.7152 * (1 - C), 0.0722 - 0.0722 * (1 - C), 0, 0.2126 - 0.2126 * (1 - C), 0.7152 + 0.2848 * (1 - C), 0.0722 - 0.0722 * (1 - C), 0, 0.2126 - 0.2126 * (1 - C), 0.7152 - 0.7152 * (1 - C), 0.0722 + 0.9278 * (1 - C), 0, 0, 0, 0, 1];

    return pixel(function () {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a;
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a;
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a;
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a;
    }, {
        $matrix: $matrix
    });
}

/*
 * @param {Number} amount   0..360  
 */
function hue() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 360;

    var $C = parseParamNumber$1(amount);
    return pixel(function () {
        var hsv = Color.RGBtoHSV($r, $g, $b);

        // 0 ~ 360 
        var h = hsv.h;
        h += Math.abs($amount);
        h = h % 360;
        hsv.h = h;

        var rgb = Color.HSVtoRGB(hsv);

        $r = rgb.r;
        $g = rgb.g;
        $b = rgb.b;
    }, {
        $C: $C
    });
}

function invert() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    var $C = amount / 100;

    return pixel(function () {
        $r = (255 - $r) * $C;
        $g = (255 - $g) * $C;
        $b = (255 - $b) * $C;
    }, {
        $C: $C
    });
}

function kodachrome() {

    var $matrix = [1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 0, 0, 0, 1];

    return pixel(function () {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a;
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a;
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a;
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a;
    }, {
        $matrix: $matrix
    });
}

function matrix() {
    var $a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var $b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var $c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var $d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var $e = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var $f = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var $g = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var $h = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
    var $i = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
    var $j = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
    var $k = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 0;
    var $l = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : 0;
    var $m = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 0;
    var $n = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : 0;
    var $o = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : 0;
    var $p = arguments.length > 15 && arguments[15] !== undefined ? arguments[15] : 0;


    var $matrix = [$a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $o, $p];

    return pixel(function () {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a;
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a;
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a;
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a;
    }, {
        $matrix: $matrix
    });
}

/**
 * 
 * @param {Number} amount 1..100
 */
function noise() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var $C = parseParamNumber$1(amount);
    return pixel(function () {
        var C = Math.abs($C) * 5;
        var min = -C;
        var max = C;
        var noiseValue = Math.round(min + Math.random() * (max - min));

        $r += noiseValue;
        $g += noiseValue;
        $b += noiseValue;
    }, {
        $C: $C
    });
}

function opacity() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    var $C = amount / 100;

    return pixel(function () {
        $a *= $C;
    }, { $C: $C });
}

function polaroid() {

    var $matrix = [1.438, -0.062, -0.062, 0, -0.122, 1.378, -0.122, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 1];

    return pixel(function () {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a;
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a;
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a;
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a;
    }, {
        $matrix: $matrix
    });
}

/*
 * @param {Number} amount  -100..100 
 */
function saturation() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    var C = amount / 100;
    var L = 1 - Math.abs(C);

    var $matrix = [L, 0, 0, 0, 0, L, 0, 0, 0, 0, L, 0, 0, 0, 0, L];

    return pixel(function () {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a;
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a;
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a;
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a;
    }, {
        $matrix: $matrix
    });
}

/*
 * @param {Number} amount  0..1 
 */
function sepia() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = parseParamNumber$1(amount);
    if (C > 1) C = 1;

    var $matrix = [0.393 + 0.607 * (1 - C), 0.769 - 0.769 * (1 - C), 0.189 - 0.189 * (1 - C), 0, 0.349 - 0.349 * (1 - C), 0.686 + 0.314 * (1 - C), 0.168 - 0.168 * (1 - C), 0, 0.272 - 0.272 * (1 - C), 0.534 - 0.534 * (1 - C), 0.131 + 0.869 * (1 - C), 0, 0, 0, 0, 1];

    return pixel(function () {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a;
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a;
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a;
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a;
    }, {
        $matrix: $matrix
    });
}

function shade() {
    var redValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var greenValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var blueValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var $redValue = parseParamNumber$1(redValue);
    var $greenValue = parseParamNumber$1(greenValue);
    var $blueValue = parseParamNumber$1(blueValue);

    return pixel(function () {
        $r *= $redValue;
        $g *= $greenValue;
        $b *= $blueValue;
    }, {
        $redValue: $redValue,
        $greenValue: $greenValue,
        $blueValue: $blueValue
    });
}

function shift() {

    var $matrix = [1.438, -0.062, -0.062, 0, -0.122, 1.378, -0.122, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 1];

    return pixel(function () {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a;
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a;
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a;
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a;
    }, {
        $matrix: $matrix
    });
}

/**
 * change the relative darkness of (a part of an image) by overexposure to light.
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 */
function solarize(redValue, greenValue, blueValue) {
    var $redValue = parseParamNumber$1(redValue);
    var $greenValue = parseParamNumber$1(greenValue);
    var $blueValue = parseParamNumber$1(blueValue);
    return pixel(function () {
        $r = $r < $redValue ? 255 - $r : $r;
        $g = $g < $greenValue ? 255 - $g : $g;
        $b = $b < $blueValue ? 255 - $b : $b;
    }, {
        $redValue: $redValue, $greenValue: $greenValue, $blueValue: $blueValue
    });
}

function technicolor() {

    var $matrix = [1.9125277891456083, -0.8545344976951645, -0.09155508482755585, 0, -0.3087833385928097, 1.7658908555458428, -0.10601743074722245, 0, -0.231103377548616, -0.7501899197440212, 1.847597816108189, 0, 0, 0, 0, 1];

    return pixel(function () {
        $r = $matrix[0] * $r + $matrix[1] * $g + $matrix[2] * $b + $matrix[3] * $a;
        $g = $matrix[4] * $r + $matrix[5] * $g + $matrix[6] * $b + $matrix[7] * $a;
        $b = $matrix[8] * $r + $matrix[9] * $g + $matrix[10] * $b + $matrix[11] * $a;
        $a = $matrix[12] * $r + $matrix[13] * $g + $matrix[14] * $b + $matrix[15] * $a;
    }, {
        $matrix: $matrix
    });
}

function thresholdColor() {
    var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
    var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var hasColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var $scale = parseParamNumber$1(scale);
    amount = parseParamNumber$1(amount);
    var $C = amount / 100;
    var $hasColor = hasColor;

    return pixel(function () {
        // refer to Color.brightness 
        var v = $C * Math.ceil($r * 0.2126 + $g * 0.7152 + $b * 0.0722) >= $scale ? 255 : 0;

        if ($hasColor) {

            if (v == 0) {
                $r = 0;
                $g = 0;
                $b = 0;
            }
        } else {
            var value = Math.round(v);
            $r = value;
            $g = value;
            $b = value;
        }
    }, {
        $C: $C, $scale: $scale, $hasColor: $hasColor
    });
}

/*
 * @param {Number} amount  0..100 
 */
function threshold() {
  var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  return thresholdColor(scale, amount, false);
}

function tint () {
    var redTint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var greenTint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var blueTint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var $redTint = parseParamNumber(redTint);
    var $greenTint = parseParamNumber(greenTint);
    var $blueTint = parseParamNumber(blueTint);
    return pixel(function () {

        $r += (255 - $r) * $redTint;
        $g += (255 - $g) * $greenTint;
        $b += (255 - $b) * $blueTint;
    }, {
        $redTint: $redTint,
        $greenTint: $greenTint,
        $blueTint: $blueTint
    });
}

var pixel$1 = {
    bitonal: bitonal,
    brightness: brightness$1,
    brownie: brownie,
    clip: clip,
    contrast: contrast$1,
    gamma: gamma,
    gradient: gradient$1,
    grayscale: grayscale,
    hue: hue,
    invert: invert,
    kodachrome: kodachrome,
    matrix: matrix,
    noise: noise,
    opacity: opacity,
    polaroid: polaroid,
    saturation: saturation,
    sepia: sepia,
    shade: shade,
    shift: shift,
    solarize: solarize,
    technicolor: technicolor,
    threshold: threshold,
    'threshold-color': thresholdColor,
    tint: tint
};

function blur () {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    amount = parseParamNumber$1(amount);

    return convolution(createBlurMatrix(amount));
}

/*
 * carve, mold, or stamp a design on (a surface) so that it stands out in relief.
 * 
 * @param {Number} amount   0.0 .. 4.0 
 */
function emboss() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

    amount = parseParamNumber$1(amount);
    return convolution([amount * -2.0, -amount, 0.0, -amount, 1.0, amount, 0.0, amount, amount * 2.0]);
}

function gaussianBlur() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    var C = amount / 100;

    return convolution(weight([1, 2, 1, 2, 4, 2, 1, 2, 1], 1 / 16 * C));
}

function gaussianBlur5x() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    var C = amount / 100;
    return convolution(weight([1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, 36, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1], 1 / 256 * C));
}

function grayscale2() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    return convolution(weight([0.3, 0.3, 0.3, 0, 0, 0.59, 0.59, 0.59, 0, 0, 0.11, 0.11, 0.11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], amount / 100));
}

function identity() {
    return convolution([0, 0, 0, 0, 1, 0, 0, 0, 0]);
}

function kirschHorizontal() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    count = parseParamNumber$1(count);
    return convolution([5, 5, 5, -3, 0, -3, -3, -3, -3]);
}

function kirschVertical() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    count = parseParamNumber$1(count);
    return convolution([5, -3, -3, 5, 0, -3, 5, -3, -3]);
}

function laplacian() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    return convolution(weight([-1, -1, -1, -1, 8, -1, -1, -1, -1], amount / 100));
}

function laplacian5x() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    return convolution(weight([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 24, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], amount / 100));
}

function motionBlur() {
    return convolution(weight([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 1 / 9));
}

function motionBlur2() {
    return convolution(weight([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1], 1 / 9));
}

function motionBlur3() {
    return convolution(weight([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1], 1 / 9));
}

function negative() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    return convolution(weight([-1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1], amount / 100));
}

function sepia2() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    return convolution(weight([0.393, 0.349, 0.272, 0, 0, 0.769, 0.686, 0.534, 0, 0, 0.189, 0.168, 0.131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], amount / 100));
}

function sharpen() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    return convolution(weight([0, -1, 0, -1, 5, -1, 0, -1, 0], amount / 100));
}

function sobelHorizontal() {
    return convolution([-1, -2, -1, 0, 0, 0, 1, 2, 1]);
}

function sobelVertical() {
    return convolution([-1, 0, 1, -2, 0, 2, -1, 0, 1]);
}

/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];

var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}

function stackBlurImage(bitmap, radius, blurAlphaChannel) {

    if (blurAlphaChannel) return stackBlurCanvasRGBA(bitmap, 0, 0, radius);else return stackBlurCanvasRGB(bitmap, 0, 0, radius);
}

function stackBlurCanvasRGBA(bitmap, top_x, top_y, radius) {
    if (isNaN(radius) || radius < 1) return bitmap;
    radius |= 0;

    var pixels = bitmap.pixels,
        width = bitmap.width,
        height = bitmap.height;

    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;

    var div = radius + radius + 1;
    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

    var stackStart = new BlurStack();
    var stack = stackStart;
    for (i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i == radiusPlus1) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;

    yw = yi = 0;

    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];

    for (y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;

        stack = stackStart;

        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }

        for (i = 1; i < radiusPlus1; i++) {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[p + 3]) * rbs;

            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;

            stack = stack.next;
        }

        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++) {
            pixels[yi + 3] = pa = a_sum * mul_sum >> shg_sum;
            if (pa != 0) {
                pa = 255 / pa;
                pixels[yi] = (r_sum * mul_sum >> shg_sum) * pa;
                pixels[yi + 1] = (g_sum * mul_sum >> shg_sum) * pa;
                pixels[yi + 2] = (b_sum * mul_sum >> shg_sum) * pa;
            } else {
                pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
            }

            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;

            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;

            p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;

            r_in_sum += stackIn.r = pixels[p];
            g_in_sum += stackIn.g = pixels[p + 1];
            b_in_sum += stackIn.b = pixels[p + 2];
            a_in_sum += stackIn.a = pixels[p + 3];

            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            a_sum += a_in_sum;

            stackIn = stackIn.next;

            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;

            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;

            stackOut = stackOut.next;

            yi += 4;
        }
        yw += width;
    }

    for (x = 0; x < width; x++) {
        g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;

        stack = stackStart;

        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }

        yp = width;

        for (i = 1; i <= radius; i++) {
            yi = yp + x << 2;

            r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;

            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;

            stack = stack.next;

            if (i < heightMinus1) {
                yp += width;
            }
        }

        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++) {
            p = yi << 2;
            pixels[p + 3] = pa = a_sum * mul_sum >> shg_sum;
            if (pa > 0) {
                pa = 255 / pa;
                pixels[p] = (r_sum * mul_sum >> shg_sum) * pa;
                pixels[p + 1] = (g_sum * mul_sum >> shg_sum) * pa;
                pixels[p + 2] = (b_sum * mul_sum >> shg_sum) * pa;
            } else {
                pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
            }

            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;

            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;

            p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;

            r_sum += r_in_sum += stackIn.r = pixels[p];
            g_sum += g_in_sum += stackIn.g = pixels[p + 1];
            b_sum += b_in_sum += stackIn.b = pixels[p + 2];
            a_sum += a_in_sum += stackIn.a = pixels[p + 3];

            stackIn = stackIn.next;

            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;

            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;

            stackOut = stackOut.next;

            yi += width;
        }
    }

    return bitmap;
}

function stackBlurCanvasRGBA(bitmap, top_x, top_y, radius) {
    if (isNaN(radius) || radius < 1) return bitmap;
    radius |= 0;

    var pixels = bitmap.pixels,
        width = bitmap.width,
        height = bitmap.height;

    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, r_out_sum, g_out_sum, b_out_sum, r_in_sum, g_in_sum, b_in_sum, pr, pg, pb, rbs;

    var div = radius + radius + 1;
    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

    var stackStart = new BlurStack();
    var stack = stackStart;
    for (i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i == radiusPlus1) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;

    yw = yi = 0;

    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];

    for (y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;

        stack = stackStart;

        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }

        for (i = 1; i < radiusPlus1; i++) {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[p + 2]) * rbs;

            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;

            stack = stack.next;
        }

        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++) {
            pixels[yi] = r_sum * mul_sum >> shg_sum;
            pixels[yi + 1] = g_sum * mul_sum >> shg_sum;
            pixels[yi + 2] = b_sum * mul_sum >> shg_sum;

            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;

            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;

            p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;

            r_in_sum += stackIn.r = pixels[p];
            g_in_sum += stackIn.g = pixels[p + 1];
            b_in_sum += stackIn.b = pixels[p + 2];

            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;

            stackIn = stackIn.next;

            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;

            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;

            stackOut = stackOut.next;

            yi += 4;
        }
        yw += width;
    }

    for (x = 0; x < width; x++) {
        g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;

        stack = stackStart;

        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next;
        }

        yp = width;

        for (i = 1; i <= radius; i++) {
            yi = yp + x << 2;

            r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;

            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;

            stack = stack.next;

            if (i < heightMinus1) {
                yp += width;
            }
        }

        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++) {
            p = yi << 2;
            pixels[p] = r_sum * mul_sum >> shg_sum;
            pixels[p + 1] = g_sum * mul_sum >> shg_sum;
            pixels[p + 2] = b_sum * mul_sum >> shg_sum;

            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;

            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;

            p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;

            r_sum += r_in_sum += stackIn.r = pixels[p];
            g_sum += g_in_sum += stackIn.g = pixels[p + 1];
            b_sum += b_in_sum += stackIn.b = pixels[p + 2];

            stackIn = stackIn.next;

            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;

            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;

            stackOut = stackOut.next;

            yi += width;
        }
    }

    return bitmap;
}

function stackBlur () {
    var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var hasAlphaChannel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    radius = parseParamNumber$1(radius);

    return function (bitmap, done) {
        var newBitmap = stackBlurImage(bitmap, radius, hasAlphaChannel);

        done(newBitmap);
    };
}

function transparency() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    return convolution(weight([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 0, 1], amount / 100));
}

function unsharpMasking() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 256;

    amount = parseParamNumber$1(amount);
    return convolution(weight([1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, -476, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1], -1 / amount));
}

var matrix$1 = {
     blur: blur,
     emboss: emboss,
     gaussianBlur: gaussianBlur,
     'gaussian-blur': gaussianBlur,
     gaussianBlur5x: gaussianBlur5x,
     'gaussian-blur-5x': gaussianBlur5x,
     grayscale2: grayscale2,
     normal: identity,
     kirschHorizontal: kirschHorizontal,
     'kirsch-horizontal': kirschHorizontal,
     kirschVertical: kirschVertical,
     'kirsch-vertical': kirschVertical,
     laplacian: laplacian,
     laplacian5x: laplacian5x,
     'laplacian-5x': laplacian5x,
     motionBlur: motionBlur,
     'motion-blur': motionBlur,
     motionBlur2: motionBlur2,
     'motion-blur-2': motionBlur2,
     motionBlur3: motionBlur3,
     'motion-blur-3': motionBlur3,
     negative: negative,
     sepia2: sepia2,
     sharpen: sharpen,
     sobelHorizontal: sobelHorizontal,
     'sobel-horizontal': sobelHorizontal,
     sobelVertical: sobelVertical,
     'sobel-vertical': sobelVertical,
     stackBlur: stackBlur,
     'stack-blur': stackBlur,
     transparency: transparency,
     unsharpMasking: unsharpMasking,
     'unsharp-masking': unsharpMasking
};

function kirsch() {
    return filter$1('kirsch-horizontal kirsch-vertical');
}

function sobel() {
    return filter$1('sobel-horizontal sobel-vertical');
}

function vintage() {
    return filter$1('brightness(15) saturation(-20) gamma(1.8)');
}

var multi$2 = {
    kirsch: kirsch,
    sobel: sobel,
    vintage: vintage
};

var FilterList = _extends({}, image$1, pixel$1, matrix$1, multi$2);

var _functions;

var makeId = 0;

var functions$1 = (_functions = {
    partial: partial,
    multi: multi$1,
    merge: merge$1,
    weight: weight,
    repeat: repeat,
    colorMatrix: colorMatrix,
    each: each$1,
    eachXY: eachXY,
    createRandomCount: createRandomCount,
    createRandRange: createRandRange,
    createBitmap: createBitmap,
    createBlurMatrix: createBlurMatrix,
    pack: pack$1,
    packXY: packXY,
    pixel: pixel,
    getBitmap: getBitmap,
    putBitmap: putBitmap,
    radian: radian,
    convolution: convolution,
    parseParamNumber: parseParamNumber$1,
    px2em: px2em,
    px2percent: px2percent,
    em2percent: em2percent,
    em2px: em2px,
    percent2em: percent2em,
    percent2px: percent2px,
    filter: filter$1,
    clamp: clamp$1,
    fillColor: fillColor,
    fillPixelColor: fillPixelColor
}, defineProperty(_functions, 'multi', multi$1), defineProperty(_functions, 'merge', merge$1), defineProperty(_functions, 'matches', matches$1), defineProperty(_functions, 'parseFilter', parseFilter), defineProperty(_functions, 'partial', partial), _functions);

var LocalFilter = functions$1;

function weight(arr) {
    var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    return arr.map(function (i) {
        return i * num;
    });
}

function repeat(value, num) {
    var arr = new Array(num);
    for (var i = 0; i < num; i++) {
        arr[i] = value;
    }
    return arr;
}

function colorMatrix(pixels, i, matrix) {
    var r = pixels[i],
        g = pixels[i + 1],
        b = pixels[i + 2],
        a = pixels[i + 3];

    fillColor(pixels, i, matrix[0] * r + matrix[1] * g + matrix[2] * b + matrix[3] * a, matrix[4] * r + matrix[5] * g + matrix[6] * b + matrix[7] * a, matrix[8] * r + matrix[9] * g + matrix[10] * b + matrix[11] * a, matrix[12] * r + matrix[13] * g + matrix[14] * b + matrix[15] * a);
}

function makeFilter$1(filter) {

    if (typeof filter == 'function') {
        return filter;
    }

    if (typeof filter == 'string') {
        filter = [filter];
    }

    var filterName = filter.shift();

    if (typeof filterName == 'function') {
        return filterName;
    }

    var params = filter;

    var filterFunction = FilterList[filterName] || LocalFilter[filterName];

    if (!filterFunction) {
        throw new Error(filterName + ' is not filter. please check filter name.');
    }
    return filterFunction.apply(filterFunction, params);
}

function forLoop(max) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var callback = arguments[3];
    var done = arguments[4];
    var functionDumpCount = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 10000;
    var frameTimer = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'full';
    var loopCount = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 50;

    var runIndex = index;
    var timer = function timer(callback) {
        setTimeout(callback, 0);
    };

    if (frameTimer == 'requestAnimationFrame') {
        timer = requestAnimationFrame;
        functionDumpCount = 1000;
    }

    if (frameTimer == 'full') {
        /* only for loop  */
        timer = null;
        functionDumpCount = max;
    }

    function makeFunction() {
        var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;

        var arr = [].concat(toConsumableArray(Array(count)));

        var functionStrings = arr.map(function (countIndex) {
            return 'cri = ri + i * s; if (cri >= mx) return {currentRunIndex: cri, i: null}; c(cri); i++;';
        }).join('\n');

        var smallLoopFunction = new Function('ri', 'i', 's', 'mx', 'c', '\n            let cri = ri;\n            \n            ' + functionStrings + '\n            \n            return {currentRunIndex: cri, i: i} \n        ');

        return smallLoopFunction;
    }

    function runCallback() {

        var smallLoopFunction = makeFunction(loopCount); // loop is call  20 callbacks at once 

        var currentRunIndex = runIndex;
        var ret = {};
        var i = 0;
        while (i < functionDumpCount) {
            ret = smallLoopFunction(runIndex, i, step, max, callback);

            if (ret.i == null) {
                currentRunIndex = ret.currentRunIndex;
                break;
            }

            i = ret.i;
            currentRunIndex = ret.currentRunIndex;
        }

        nextCallback(currentRunIndex);
    }

    function nextCallback(currentRunIndex) {
        if (currentRunIndex) {
            runIndex = currentRunIndex;
        } else {
            runIndex += step;
        }

        if (runIndex >= max) {
            done();
            return;
        }

        if (timer) timer(runCallback);else runCallback();
    }

    runCallback();
}

function each$1(len, callback, done) {
    var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


    forLoop(len, 0, 4, function (i) {
        callback(i, i >> 2 /* xyIndex */);
    }, function () {
        done();
    }, opt.functionDumpCount, opt.frameTimer, opt.loopCount);
}

function eachXY(len, width, callback, done) {
    var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};


    forLoop(len, 0, 4, function (i) {
        var xyIndex = i >> 2;
        callback(i, xyIndex % width, Math.floor(xyIndex / width));
    }, function () {
        done();
    }, opt.functionDumpCount, opt.frameTimer, opt.loopCount);
}

function createRandRange(min, max, count) {
    var result = [];

    for (var i = 1; i <= count; i++) {
        var num = Math.random() * (max - min) + min;
        var sign = Math.floor(Math.random() * 10) % 2 == 0 ? -1 : 1;
        result.push(sign * num);
    }

    result.sort();

    var centerIndex = Math.floor(count >> 1);
    var a = result[centerIndex];
    result[centerIndex] = result[0];
    result[0] = a;

    return result;
}

function createRandomCount() {
    return [3 * 3, 4 * 4, 5 * 5, 6 * 6, 7 * 7, 8 * 8, 9 * 9, 10 * 10].sort(function (a, b) {
        return 0.5 - Math.random();
    })[0];
}

function createBitmap(length, width, height) {
    return { pixels: new Uint8ClampedArray(length), width: width, height: height };
}

function putPixel(dstBitmap, srcBitmap, startX, startY) {

    var len = srcBitmap.pixels.length / 4;
    var dstX = 0,
        dstY = 0,
        x = 0,
        y = 0,
        srcIndex = 0,
        dstIndex = 0;
    for (var i = 0; i < len; i++) {
        x = i % srcBitmap.width, y = Math.floor(i / srcBitmap.width);

        dstX = startX + x;
        dstY = startY + y;

        if (dstX > dstBitmap.width) continue;
        if (dstY > dstBitmap.height) continue;

        srcIndex = y * srcBitmap.width + x << 2;
        dstIndex = dstY * dstBitmap.width + dstX << 2;

        dstBitmap.pixels[dstIndex] = srcBitmap.pixels[srcIndex];
        dstBitmap.pixels[dstIndex + 1] = srcBitmap.pixels[srcIndex + 1];
        dstBitmap.pixels[dstIndex + 2] = srcBitmap.pixels[srcIndex + 2];
        dstBitmap.pixels[dstIndex + 3] = srcBitmap.pixels[srcIndex + 3];
    }
}

function getPixel(srcBitmap, dstBitmap, startX, startY) {
    var len = dstBitmap.pixels.length >> 2;
    var srcX = 0,
        srcY = 0,
        x = 0,
        y = 0,
        srcIndex = 0,
        dstIndex = 0;
    for (var i = 0; i < len; i++) {
        var x = i % dstBitmap.width,
            y = Math.floor(i / dstBitmap.width);

        srcX = startX + x;
        srcY = startY + y;

        if (srcX > srcBitmap.width) continue;
        if (srcY > srcBitmap.height) continue;

        srcIndex = srcY * srcBitmap.width + srcX << 2;
        dstIndex = y * dstBitmap.width + x << 2;

        dstBitmap.pixels[dstIndex] = srcBitmap.pixels[srcIndex];
        dstBitmap.pixels[dstIndex + 1] = srcBitmap.pixels[srcIndex + 1];
        dstBitmap.pixels[dstIndex + 2] = srcBitmap.pixels[srcIndex + 2];
        dstBitmap.pixels[dstIndex + 3] = srcBitmap.pixels[srcIndex + 3];
    }
}

function cloneBitmap(bitmap) {
    var padding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


    var width = bitmap.width + padding;
    var height = bitmap.height + padding;

    var newBitmap = { pixels: new Uint8ClampedArray(width * height * 4), width: width, height: height };

    return newBitmap;
}

function getBitmap(bitmap, area) {
    return Canvas.getBitmap(bitmap, area);
}

function putBitmap(bitmap, subBitmap, area) {
    return Canvas.putBitmap(bitmap, subBitmap, area);
}

function parseParamNumber$1(param, callback) {
    if (typeof param === 'string') {
        param = param.replace(/deg|px/g, '');
    }
    if (typeof callback == 'function') {
        return callback(+param);
    }
    return +param;
}

function px2percent(px, maxValue) {
    return round(px / maxValue * 100, 100);
}

function px2em(px, maxValue) {
    var fontSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;

    return round(px / fontSize, 100);
}

function em2px(em, maxValue) {
    var fontSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;

    return Math.floor(round(em * fontSize, 100));
}

function em2percent(em, maxValue) {
    return px2percent(em2px(em), maxValue);
}

function percent2px(percent, maxValue) {
    return Math.floor(round(maxValue * (percent / 100), 100));
}

function percent2em(percent, maxValue) {
    return px2em(percent2px(percent, maxValue), maxValue);
}

var filter_regexp = /(([\w_\-]+)(\(([^\)]*)\))?)+/gi;
function pack$1(callback) {
    return function (bitmap, done) {
        each$1(bitmap.pixels.length, function (i, xyIndex) {
            callback(bitmap.pixels, i, xyIndex, bitmap.pixels[i], bitmap.pixels[i + 1], bitmap.pixels[i + 2], bitmap.pixels[i + 3]);
        }, function () {
            done(bitmap);
        });
    };
}

function makePrebuildUserFilterList(arr) {

    var codeString = arr.map(function (it) {
        return ' \n            ' + it.userFunction.$preContext + '\n\n            ' + it.userFunction.$preCallbackString + '\n\n            $r = clamp($r); $g = clamp($g); $b = clamp($b); $a = clamp($a);\n        ';
    }).join('\n\n');

    var rootContextObject = { clamp: clamp$1, Color: Color$1 };
    arr.forEach(function (it) {
        Object.assign(rootContextObject, it.userFunction.rootContextObject);
    });

    var rootContextDefine = 'const ' + Object.keys(rootContextObject).map(function (key) {
        return ' ' + key + ' = $rc.' + key + ' ';
    }).join(',');

    var FunctionCode = ' \n    let $r = $p[$pi], $g = $p[$pi+1], $b = $p[$pi+2], $a = $p[$pi+3];\n    \n    ' + rootContextDefine + '\n\n    ' + codeString + '\n    \n    $p[$pi] = $r; $p[$pi+1] = $g; $p[$pi+2] = $b; $p[$pi+3] = $a;\n    ';

    var userFunction = new Function('$p', '$pi', '$rc', FunctionCode);

    return function ($pixels, $pixelIndex) {
        userFunction($pixels, $pixelIndex, rootContextObject);
    };
}

function makeUserFilterFunctionList(arr) {
    var rootContextObject = {};
    var list = arr.map(function (it) {
        var newKeys = [];

        Object.keys(it.context).forEach(function (key, i) {
            newKeys[key] = 'n$' + makeId++ + key + '$';
        });

        Object.keys(it.rootContext).forEach(function (key, i) {
            newKeys[key] = 'r$' + makeId++ + key + '$';

            rootContextObject[newKeys[key]] = it.rootContext[key];
        });

        var preContext = Object.keys(it.context).filter(function (key) {
            if (typeof it.context[key] === 'number' || typeof it.context[key] === 'string') {
                return false;
            } else if (Array.isArray(it.context[key])) {
                if (typeof it.context[key][0] == 'number' || typeof it.context[key][0] == 'string') {
                    return false;
                }
            }

            return true;
        }).map(function (key, i) {
            return [newKeys[key], JSON.stringify(it.context[key])].join(' = ');
        });

        var preCallbackString = it.callback.toString().split("{");

        preCallbackString.shift();
        preCallbackString = preCallbackString.join("{");
        preCallbackString = preCallbackString.split("}");
        preCallbackString.pop();
        preCallbackString = preCallbackString.join("}");

        Object.keys(newKeys).forEach(function (key) {
            var newKey = newKeys[key];

            if (typeof it.context[key] === 'number' || typeof it.context[key] === 'string') {
                preCallbackString = preCallbackString.replace(new RegExp("\\" + key, "g"), it.context[key]);
            } else if (Array.isArray(it.context[key])) {
                if (typeof it.context[key][0] == 'number' || typeof it.context[key][0] == 'string') {
                    it.context[key].forEach(function (item, index) {
                        preCallbackString = preCallbackString.replace(new RegExp("\\" + key + '\\[' + index + '\\]', "g"), item);
                    });
                } else {
                    preCallbackString = preCallbackString.replace(new RegExp("\\" + key, "g"), newKey);
                }
            } else {
                preCallbackString = preCallbackString.replace(new RegExp("\\" + key, "g"), newKey);
            }
        });

        return { preCallbackString: preCallbackString, preContext: preContext };
    });

    var preContext = list.map(function (it, i) {
        return it.preContext.length ? 'const ' + it.preContext + ';' : "";
    }).join('\n\n');

    var preCallbackString = list.map(function (it) {
        return it.preCallbackString;
    }).join('\n\n');

    var FunctionCode = ' \n    let $r = $pixels[$pixelIndex], $g = $pixels[$pixelIndex+1], $b = $pixels[$pixelIndex+2], $a = $pixels[$pixelIndex+3];\n\n    ' + preContext + '\n\n    ' + preCallbackString + '\n    \n    $pixels[$pixelIndex] = $r\n    $pixels[$pixelIndex+1] = $g \n    $pixels[$pixelIndex+2] = $b   \n    $pixels[$pixelIndex+3] = $a   \n    ';

    var userFunction = new Function('$pixels', '$pixelIndex', '$clamp', '$Color', FunctionCode);

    userFunction.$preCallbackString = preCallbackString;
    userFunction.$preContext = preContext;
    userFunction.rootContextObject = rootContextObject;

    return userFunction;
}

function makeUserFilterFunction(callback) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var rootContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return makeUserFilterFunctionList([{ callback: callback, context: context, rootContext: rootContext }]);
}

function pixel(callback) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var rootContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var userFunction = makeUserFilterFunction(callback, context, rootContext);

    var returnCallback = function returnCallback(bitmap, done) {};

    returnCallback.userFunction = userFunction;

    return returnCallback;
}

var ColorListIndex = [0, 1, 2, 3];

function swapColor(pixels, startIndex, endIndex) {

    ColorListIndex.forEach(function (i) {
        var temp = pixels[startIndex + i];
        pixels[startIndex + i] = pixels[endIndex + i];
        pixels[endIndex + i] = temp;
    });
}

function packXY(callback) {
    return function (bitmap, done) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        eachXY(bitmap.pixels.length, bitmap.width, function (i, x, y) {
            callback(bitmap.pixels, i, x, y);
        }, function () {
            done(bitmap);
        }, opt);
    };
}

function radian(degree) {
    return Matrix.CONSTANT.radian(degree);
}

function createBlurMatrix() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

    var count = Math.pow(amount, 2);
    var value = 1 / count;
    return repeat(value, count);
}

function fillColor(pixels, i, r, g, b, a) {
    if (arguments.length == 3) {
        var _arguments$ = arguments[2],
            r = _arguments$.r,
            g = _arguments$.g,
            b = _arguments$.b,
            a = _arguments$.a;
    }

    if (typeof r == 'number') {
        pixels[i] = r;
    }
    if (typeof g == 'number') {
        pixels[i + 1] = g;
    }
    if (typeof b == 'number') {
        pixels[i + 2] = b;
    }
    if (typeof a == 'number') {
        pixels[i + 3] = a;
    }
}

function fillPixelColor(targetPixels, targetIndex, sourcePixels, sourceIndex) {
    fillColor(targetPixels, targetIndex, sourcePixels[sourceIndex], sourcePixels[sourceIndex + 1], sourcePixels[sourceIndex + 2], sourcePixels[sourceIndex + 3]);
}



function createWeightTable(weights) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 255;

    var weightTable = [];

    weightTable = weights.map(function (w, i) {
        return [];
    });

    weights.forEach(function (w, i) {

        if (w != 0) {
            var data = weightTable[i];

            for (var i = min; i <= max; i++) {
                data[i] = w * i;
            }
        }
    });

    return weightTable;
}

function createSubPixelWeightFunction(weights, weightTable, width, height, opaque) {

    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var alphaFac = opaque ? 1 : 0;

    var FunctionCode = 'let r = 0, g = 0, b = 0, a = 0, scy = 0, scx =0, si = 0; ';
    var R = [];
    var G = [];
    var B = [];
    var A = [];
    weights.forEach(function (wt, index) {
        var cy = Math.floor(index / side);
        var cx = index % side;
        var distY = cy - halfSide;
        var distX = cx - halfSide;

        if (wt == 0) {
            return;
        }

        R.push('$t[' + index + '][$sp[(($sy + (' + distY + ')) * ' + width + ' + ($sx + (' + distX + '))) * 4]]');
        G.push('$t[' + index + '][$sp[(($sy + (' + distY + ')) * ' + width + ' + ($sx + (' + distX + '))) * 4 + 1]]');
        B.push('$t[' + index + '][$sp[(($sy + (' + distY + ')) * ' + width + ' + ($sx + (' + distX + '))) * 4 + 2]]');
        A.push('$t[' + index + '][$sp[(($sy + (' + distY + ')) * ' + width + ' + ($sx + (' + distX + '))) * 4 + 3]]');
    });

    FunctionCode += 'r = ' + R.join(' + ') + '; g = ' + G.join(' + ') + '; b = ' + B.join(' + ') + '; a = ' + A.join(' + ') + ';';
    FunctionCode += '$dp[$di] = r; $dp[$di+1] = g;$dp[$di+2] = b;$dp[$di+3] = a + (' + alphaFac + ')*(255-a); ';

    // console.log(FunctionCode)

    var subPixelFunction = new Function('$dp', '$sp', '$di', '$sx', '$sy', '$t', FunctionCode);

    return function ($dp, $sp, $di, $sx, $sy) {
        subPixelFunction($dp, $sp, $di, $sx, $sy, weightTable);
    };
}

function convolution(weights) {
    var opaque = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var weightTable = createWeightTable(weights);
    return function (bitmap, done) {
        var side = Math.round(Math.sqrt(weights.length));
        var padding = side * 2;

        // 원본 크기를 늘림 
        var sourceBitmap = cloneBitmap(bitmap, padding);

        // 원본 데이타 복사 
        putPixel(sourceBitmap, bitmap, side, side);

        // 최종 아웃풋 
        var newBitmap = createBitmap(sourceBitmap.pixels.length, sourceBitmap.width, sourceBitmap.height);

        // 마지막 원본 아웃풋 
        var returnBitmap = createBitmap(bitmap.pixels.length, bitmap.width, bitmap.height);

        var subPixelWeightFunction = createSubPixelWeightFunction(weights, weightTable, sourceBitmap.width, sourceBitmap.height, opaque);

        var len = bitmap.pixels.length / 4;
        for (var i = 0; i < len; i++) {
            var xyIndex = i,
                x = xyIndex % bitmap.width + side,
                y = Math.floor(xyIndex / bitmap.width) + side;

            subPixelWeightFunction(newBitmap.pixels, sourceBitmap.pixels, (y * sourceBitmap.width + x) * 4, x, y);
        }

        getPixel(newBitmap, returnBitmap, side, side);
        done(returnBitmap);
    };
}

function matches$1(str) {
    var ret = Color$1.convertMatches(str);
    var matches = ret.str.match(filter_regexp);
    var result = [];

    if (!matches) {
        return result;
    }

    result = matches.map(function (it) {
        return { filter: it, origin: Color$1.reverseMatches(it, ret.matches) };
    });

    var pos = { next: 0 };
    result = result.map(function (item) {

        var startIndex = str.indexOf(item.origin, pos.next);

        item.startIndex = startIndex;
        item.endIndex = startIndex + item.origin.length;

        item.arr = parseFilter(item.origin);

        pos.next = item.endIndex;

        return item;
    }).filter(function (it) {
        if (!it.arr.length) return false;
        return true;
    });

    return result;
}

/**
 * Filter Parser 
 * 
 * F.parseFilter('blur(30)') == ['blue', '30']
 * F.parseFilter('gradient(white, black, 3)') == ['gradient', 'white', 'black', '3']
 * 
 * @param {String} filterString 
 */
function parseFilter(filterString) {

    var ret = Color$1.convertMatches(filterString);
    var matches = ret.str.match(filter_regexp);

    if (!matches[0]) {
        return [];
    }

    var arr = matches[0].split('(');

    var filterName = arr.shift();
    var filterParams = [];

    if (arr.length) {
        filterParams = arr.shift().split(')')[0].split(',').map(function (f) {
            return Color$1.reverseMatches(f, ret.matches);
        });
    }

    var result = [filterName].concat(toConsumableArray(filterParams)).map(Color$1.trim);

    return result;
}

function clamp$1(num) {
    return Math.min(255, num);
}

function filter$1(str) {
    return merge$1(matches$1(str).map(function (it) {
        return it.arr;
    }));
}

function makeGroupedFilter$1() {
    var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var groupedFilter = [];
    var group = [];
    for (var i = 0, len = filters.length; i < len; i++) {
        var f = filters[i];

        if (f.userFunction) {
            group.push(f);
        } else {
            if (group.length) {
                groupedFilter.push([].concat(toConsumableArray(group)));
            }
            groupedFilter.push(f);
            group = [];
        }
    }

    if (group.length) {
        groupedFilter.push([].concat(toConsumableArray(group)));
    }

    groupedFilter.forEach(function (filter, index) {
        if (Array.isArray(filter)) {
            groupedFilter[index] = function () {
                var userFunction = makePrebuildUserFilterList(filter);
                // console.log(userFunction)
                return function (bitmap, done) {

                    for (var i = 0, len = bitmap.pixels.length; i < len; i += 4) {
                        userFunction(bitmap.pixels, i);
                    }

                    done(bitmap);
                    // forLoop(bitmap.pixels.length, 0, 4, function (i) {
                    //     userFunction(bitmap.pixels, i)
                    // }, function () {
                    //     done(bitmap)
                    // })
                };
            }();
        }
    });

    return groupedFilter;
}

/** 
 * 
 * multiply filters
 * 
 * ImageFilter.multi('blur', 'grayscale', 'sharpen', ['blur', 3], function (bitmap) {  return bitmap });
 * 
 */
function multi$1() {
    for (var _len = arguments.length, filters = Array(_len), _key = 0; _key < _len; _key++) {
        filters[_key] = arguments[_key];
    }

    filters = filters.map(function (filter) {
        return makeFilter$1(filter);
    }).filter(function (f) {
        return f;
    });

    filters = makeGroupedFilter$1(filters);

    var max = filters.length;

    return function (bitmap, done) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


        var currentBitmap = bitmap;
        var index = 0;

        function runFilter() {
            filters[index].call(null, currentBitmap, function (nextBitmap) {
                currentBitmap = nextBitmap;

                nextFilter();
            }, opt);
        }

        function nextFilter() {
            index++;

            if (index >= max) {
                done(currentBitmap);
                return;
            }

            runFilter();
        }

        runFilter();
    };
}

function merge$1(filters) {
    return multi$1.apply(undefined, toConsumableArray(filters));
}

/**
 * apply filter into special area
 * 
 * F.partial({x,y,width,height}, filter, filter, filter )
 * F.partial({x,y,width,height}, 'filter' )
 * 
 * @param {{x, y, width, height}} area 
 * @param {*} filters   
 */
function partial(area) {
    var allFilter = null;

    for (var _len2 = arguments.length, filters = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        filters[_key2 - 1] = arguments[_key2];
    }

    if (filters.length == 1 && typeof filters[0] === 'string') {
        allFilter = filter$1(filters[0]);
    } else {
        allFilter = merge$1(filters);
    }

    return function (bitmap, done) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        allFilter(getBitmap(bitmap, area), function (newBitmap) {
            done(putBitmap(bitmap, newBitmap, area));
        }, opt);
    };
}

function parseParamNumber$2(param) {
    if (typeof param === 'string') {
        param = param.replace(/deg/, '');
        param = param.replace(/px/, '');
        param = param.replace(/em/, '');
        param = param.replace(/%/, '');
    }
    return +param;
}

function weight$1(arr) {
    var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    return arr.map(function (i) {
        return i * num;
    });
}

var SHADER_INDEX = 0;

function convolutionString(count) {

    var width = Math.sqrt(count);
    var half = Math.floor(width / 2);

    return [].concat(toConsumableArray(Array(count))).map(function (it, index) {
        var y = Math.floor(index / width) - half;
        var x = index % width - half;

        return 'texture(u_image, v_texCoord + onePixel * vec2(' + x + ', ' + y + ')) * u_kernel' + count + '[' + index + ']';
    }).join(' + \n');
}

function multi$3(str) {
    return [].concat(Array.prototype.slice.call(arguments));
}

function convolution$1(arr) {

    return {
        type: 'convolution',
        length: arr.length,
        content: arr
    };
}

function makeShader(str, index) {
    return '\n        if (u_filterIndex == ' + index + '.0) {\n            ' + str + '\n        }\n    ';
}

function shader(str, options) {
    return {
        type: 'shader',
        index: SHADER_INDEX,
        options: options,
        content: makeShader(str, SHADER_INDEX++)
    };
}

function makeVertexShaderSource() {
    return '#version 300 es \n\n        in vec2 a_position;\n        in vec2 a_texCoord; \n\n        uniform vec2 u_resolution;\n        uniform float u_flipY;\n\n        out vec2 v_texCoord; \n\n        void main() {\n            vec2 zeroToOne = a_position / u_resolution;\n\n            vec2 zeroToTwo = zeroToOne * 2.0;\n\n            vec2 clipSpace = zeroToTwo - 1.0;\n\n            gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);\n\n            v_texCoord = a_texCoord;\n\n        }\n    ';
}

function makeConvolution(count) {

    return '\n    \n    if (u_kernelSelect == ' + count + '.0) {\n        vec4 colorSum = ' + convolutionString(count) + '; \n\n        outColor = vec4((colorSum / u_kernel' + count + 'Weight).rgb, 1);\n        \n    }\n    ';
}

function makeFragmentShaderSource(filterShaderList) {

    var filterContent = filterShaderList.filter(function (f) {
        return f.type == 'shader';
    }).map(function (f) {
        return f.content;
    }).join('\n\n');

    var weightTable = { '9': true };

    filterShaderList.filter(function (f) {
        return f.type == 'convolution';
    }).forEach(function (f) {
        weightTable[f.length] = true;
    });

    var convolutionString = Object.keys(weightTable).map(function (len) {
        return makeConvolution(+len);
    }).join('\n');

    return '#version 300 es\n\n    precision highp int;\n    precision mediump float;\n    \n    uniform sampler2D u_image;\n\n    // 3 is 3x3 matrix kernel \n    uniform float u_kernelSelect;\n    uniform float u_filterIndex;\n\n    uniform float u_kernel9[9];\n    uniform float u_kernel9Weight;\n    uniform float u_kernel25[25];\n    uniform float u_kernel25Weight;\n    uniform float u_kernel49[49];\n    uniform float u_kernel49Weight;\n    uniform float u_kernel81[81];\n    uniform float u_kernel81Weight;    \n\n    in vec2 v_texCoord;\n    \n    out vec4 outColor;\n\n    float random (vec2 st) {\n        return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);\n    } \n\n    // \n    vec3 rgb2hsv(vec3 c)\n    {\n        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n        vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);\n        vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);\n\n        float d = q.x - min(q.w, q.y);\n        float e = 1.0e-10;\n        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n    }\n\n    vec3 hsv2rgb(vec3 c)\n    {\n        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n    }\n    \n    void main() {\n        vec4 pixelColor = texture(u_image, v_texCoord);\n        vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));                \n\n        ' + filterContent + '\n\n        ' + convolutionString + '\n\n    }';
}

function colorToVec4(color) {
    color = [color.r / 255, color.g / 255, color.b / 255, color.a || 0].map(toFloatString);
    return 'vec4(' + color + ')';
}

function toFloatString(number) {
    if (number == Math.floor(number)) {
        return number + '.0';
    }

    return number;
}

function blur$1 () {
    return convolution$1([1, 1, 1, 1, 1, 1, 1, 1, 1]);
}

function normal () {
    return convolution$1([0, 0, 0, 0, 1, 0, 0, 0, 0]);
}

/*
 * carve, mold, or stamp a design on (a surface) so that it stands out in relief.
 * 
 * @param {Number} amount   0.0 .. 4.0 
 */
function emboss$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

    amount = parseParamNumber$2(amount);
    return convolution$1([amount * -2.0, -amount, 0.0, -amount, 1.0, amount, 0.0, amount, amount * 2.0]);
}

/**
 * 
 * @param {Number} amount 0..1
 */
function gaussianBlur$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = parseParamNumber$2(amount) * (1 / 16);

    return convolution$1(weight$1([1, 2, 1, 2, 4, 2, 1, 2, 1], C));
}

function gaussianBlur5x$1() {
    return convolution$1([1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, 36, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1]);
}

function grayscale2$1() {
    return convolution$1([0.3, 0.3, 0.3, 0, 0, 0.59, 0.59, 0.59, 0, 0, 0.11, 0.11, 0.11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

function kirschHorizontal$1() {
    return convolution$1([5, 5, 5, -3, 0, -3, -3, -3, -3]);
}

function kirschVertical$1() {
    return convolution$1([5, -3, -3, 5, 0, -3, 5, -3, -3]);
}

function laplacian$1() {
    return convolution$1([-1, -1, -1, -1, 8, -1, -1, -1, -1]);
}

function laplacian5x$1() {
    return convolution$1([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 24, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
}

function motionBlur$1() {
    return convolution$1([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
}

function motionBlur2$1() {
    return convolution$1([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1]);
}

function motionBlur3$1() {
    return convolution$1([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

function negative$1() {
    return convolution$1([-1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1]);
}

function sepia2$1() {
    return convolution$1([0.393, 0.349, 0.272, 0, 0, 0.769, 0.686, 0.534, 0, 0, 0.189, 0.168, 0.131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

function sharpen$1() {
    return convolution$1([0, -1, 0, -1, 5, -1, 0, -1, 0]);
}

function sobelHorizontal$1() {
    return convolution$1([-1, -2, -1, 0, 0, 0, 1, 2, 1]);
}

function sobelVertical$1() {
    return convolution$1([-1, 0, 1, -2, 0, 2, -1, 0, 1]);
}

function transparency$1() {
    return convolution$1([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 0, 1]);
}

function unsharpMasking$1() {
    return convolution$1(weight$1([1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, -476, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1], -1 / 256));
}

var matrix$2 = {
     blur: blur$1,
     normal: normal,
     emboss: emboss$1,
     gaussianBlur: gaussianBlur$1,
     'gaussian-blur': gaussianBlur$1,
     gaussianBlur5x: gaussianBlur5x$1,
     'gaussian-blur-5x': gaussianBlur5x$1,
     grayscale2: grayscale2$1,
     kirschHorizontal: kirschHorizontal$1,
     'kirsch-horizontal': kirschHorizontal$1,
     kirschVertical: kirschVertical$1,
     'kirsch-vertical': kirschVertical$1,
     laplacian: laplacian$1,
     laplacian5x: laplacian5x$1,
     'laplacian-5x': laplacian5x$1,
     motionBlur: motionBlur$1,
     'motion-blur': motionBlur$1,
     motionBlur2: motionBlur2$1,
     'motion-blur-2': motionBlur2$1,
     motionBlur3: motionBlur3$1,
     'motion-blur-3': motionBlur3$1,
     negative: negative$1,
     sepia2: sepia2$1,
     sharpen: sharpen$1,
     sobelHorizontal: sobelHorizontal$1,
     'sobel-horizontal': sobelHorizontal$1,
     sobelVertical: sobelVertical$1,
     'sobel-vertical': sobelVertical$1,
     transparency: transparency$1,
     unsharpMasking: unsharpMasking$1,
     'unsharp-masking': unsharpMasking$1
};

function bitonal$1(darkColor, lightColor) {
    var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;

    var checkVlue = toFloatString(threshold);
    var darkColorString = colorToVec4(Color$1.parse(darkColor));
    var lightColorString = colorToVec4(Color$1.parse(lightColor));

    return shader('\n        if ((pixelColor.r + pixelColor.g + pixelColor.b) > ' + checkVlue + ') {\n            outColor = vec4(' + lightColorString + '.rgb, pixelColor.a);\n        } else {\n            outColor = vec4(' + darkColorString + '.rgb, pixelColor.a);\n        }\n    ');
}

/*
 * @param {Number} amount  -1..1  ,  value < 0  is darken, value > 0 is brighten 
 */
function brightness$2() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = toFloatString(parseParamNumber$2(amount));

    return shader('\n        outColor = pixelColor + (' + C + ');\n    ');
}

function matrix$3() {
    var $a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var $b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var $c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var $d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var $e = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var $f = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var $g = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var $h = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
    var $i = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
    var $j = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
    var $k = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 0;
    var $l = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : 0;
    var $m = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 0;
    var $n = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : 0;
    var $o = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : 0;
    var $p = arguments.length > 15 && arguments[15] !== undefined ? arguments[15] : 0;


    var matrix = [$a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $o, $p].map(toFloatString);

    return shader('\n\n        outColor = vec4(\n            ' + matrix[0] + ' * pixelColor.r + ' + matrix[1] + ' * pixelColor.g + ' + matrix[2] + ' * pixelColor.b + ' + matrix[3] + ' * pixelColor.a,\n            ' + matrix[4] + ' * pixelColor.r + ' + matrix[5] + ' * pixelColor.g + ' + matrix[6] + ' * pixelColor.b + ' + matrix[7] + ' * pixelColor.a,\n            ' + matrix[8] + ' * pixelColor.r + ' + matrix[9] + ' * pixelColor.g + ' + matrix[10] + ' * pixelColor.b + ' + matrix[11] + ' * pixelColor.a,\n            ' + matrix[12] + ' * pixelColor.r + ' + matrix[13] + ' * pixelColor.g + ' + matrix[14] + ' * pixelColor.b + ' + matrix[15] + ' * pixelColor.a\n        ); \n    ');
}

function brownie$1() {

    return matrix$3(0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0, -0.037703249837783157, 0.8609577587992641, 0.15059552388459913, 0, 0.24113635128153335, -0.07441037908422492, 0.44972182064877153, 0, 0, 0, 0, 1);
}

/*
 * @param {Number} amount 0..1
 */
function clip$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var C = toFloatString(parseParamNumber$2(amount));

    return shader('\n        outColor = vec4(\n            (pixelColor.r > 1.0 - ' + C + ') ? 1.0 : 0.0,\n            (pixelColor.g > 1.0 - ' + C + ') ? 1.0 : 0.0,\n            (pixelColor.b > 1.0 - ' + C + ') ? 1.0 : 0.0,\n            pixelColor.a \n        );\n    ');
}

function chaos() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

    var C = toFloatString(parseParamNumber$2(amount));

    return shader('\n        vec2 st = pixelColor.st;\n        st *= ' + C + ';\n        \n        vec2 ipos = floor(st);  // get the integer coords\n\n        vec3 color = vec3(random( ipos ));\n\n        outColor = vec4(color, pixelColor.a);\n    ');
}

/*
 * @param {Number} amount  0..1
 */
function contrast$2() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = toFloatString(parseParamNumber$2(amount));

    return shader('\n        outColor = pixelColor * ' + C + ';\n    ');
}

/*
 * @param {Number} amount  -1..1  ,  value < 0  is darken, value > 0 is brighten 
 */
function gamma$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = toFloatString(parseParamNumber$2(amount));

    return shader('\n        outColor = vec4(pow(pixelColor.r, ' + C + '), pow(pixelColor.g, ' + C + '), pow(pixelColor.b, ' + C + '), pixelColor.a );\n    ');
}

/**
 * F.gradient('red', 'blue', 'yellow', 'white', 10)
 * F.gradient('red, blue, yellow, white, 10')
 */
function gradient$2() {
    // 전체 매개변수 기준으로 파싱 
    // 색이 아닌 것 기준으로 scale 변수로 인식 

    var params = [].concat(Array.prototype.slice.call(arguments));

    if (params.length === 1 && typeof params[0] === 'string') {
        params = Color$1.convertMatchesArray(params[0]);
    }

    params = params.map(function (arg) {
        return arg;
    }).join(', ');

    var colors = Color$1.parseGradient(params);

    colors[0][1] = 0;
    colors[colors.length - 1][1] = 1;

    colors = colors.map(function (c) {
        var _Color$parse = Color$1.parse(c[0]),
            r = _Color$parse.r,
            g = _Color$parse.g,
            b = _Color$parse.b,
            a = _Color$parse.a;

        return [{ r: r, g: g, b: b, a: a }, c[1]];
    });

    var temp = [];

    for (var i = 0, len = colors.length; i < len - 1; i++) {
        var start = colors[i];
        var end = colors[i + 1];

        var startColor = colorToVec4(start[0]);
        var endColor = colorToVec4(end[0]);

        var startRate = toFloatString(start[1]);
        var endRate = toFloatString(end[1]);

        temp.push('\n            if (' + startRate + ' <= rate && rate < ' + endRate + ') {\n                outColor = mix(' + startColor + ', ' + endColor + ', (rate - ' + startRate + ')/(' + endRate + ' - ' + startRate + '));\n            }\n        ');
    }

    return shader('\n        float rate = (pixelColor.r * 0.2126 + pixelColor.g * 0.7152 + pixelColor.b * 0.0722); \n\n        ' + temp.join('\n') + '        \n    ');
}

/**
 * 
 * @param {Number} amount 0..1
 */
function grayscale$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = parseParamNumber$2(amount);

    if (C > 1) C = 1;

    return matrix$3(0.2126 + 0.7874 * (1 - C), 0.7152 - 0.7152 * (1 - C), 0.0722 - 0.0722 * (1 - C), 0, 0.2126 - 0.2126 * (1 - C), 0.7152 + 0.2848 * (1 - C), 0.0722 - 0.0722 * (1 - C), 0, 0.2126 - 0.2126 * (1 - C), 0.7152 - 0.7152 * (1 - C), 0.0722 + 0.9278 * (1 - C), 0, 0, 0, 0, 1);
}

//http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
/*
 * @param {Number} amount  0..1  ,  (real value 0..360)
 */
function hue$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = toFloatString(parseParamNumber$2(amount));

    return shader('\n        vec3 hsv = rgb2hsv(pixelColor.rgb);\n        hsv.x += ' + C + ';\n        outColor = vec4(hsv2rgb(hsv).rgb, pixelColor.a);\n    ');
}

function invert$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = toFloatString(parseParamNumber$2(amount));

    return shader('\n        outColor = vec4(\n            (1.0 - pixelColor.r) * ' + C + ',\n            (1.0 - pixelColor.g) * ' + C + ',\n            (1.0 - pixelColor.b) * ' + C + ',\n            pixelColor.a\n        );\n    ');
}

function kodachrome$1() {

    return matrix$3(1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 0, 0, 0, 1);
}

/**
 * 
 * @param {Number} amount 0..1
 */
function noise$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;


    var C = Math.abs(parseParamNumber$2(amount));
    var min = toFloatString(-C);
    var max = toFloatString(C);
    return shader('\n        float rnd = ' + min + ' + random( pixelColor.st ) * (' + max + ' - ' + min + ');\n\n        outColor = vec4(pixelColor.rgb + rnd, 1.0);\n    ');
}

/**
 * 
 * @param {Number} amount 0..1
 */
function opacity$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = toFloatString(parseParamNumber$2(amount));

    return shader('\n        outColor = vec4(pixelColor.rgb, pixelColor.a * ' + C + ');\n    ');
}

function polaroid$1() {

    return matrix$3(1.438, -0.062, -0.062, 0, -0.122, 1.378, -0.122, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 1);
}

/*
 * @param {Number} amount  0..1 
 */
function saturation$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var L = 1 - Math.abs(parseParamNumber$2(amount));

    return matrix$3(L, 0, 0, 0, 0, L, 0, 0, 0, 0, L, 0, 0, 0, 0, L);
}

/*
 * @param {Number} amount  0..100 
 */
function sepia$1() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var C = parseParamNumber$2(amount);
    if (C > 1) C = 1;

    return matrix$3(0.393 + 0.607 * (1 - C), 0.769 - 0.769 * (1 - C), 0.189 - 0.189 * (1 - C), 0, 0.349 - 0.349 * (1 - C), 0.686 + 0.314 * (1 - C), 0.168 - 0.168 * (1 - C), 0, 0.272 - 0.272 * (1 - C), 0.534 - 0.534 * (1 - C), 0.131 + 0.869 * (1 - C), 0, 0, 0, 0, 1);
}

function shade$1() {
    var redValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var greenValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var blueValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var r = toFloatString(parseParamNumber$2(redValue) / 255);
    var g = toFloatString(parseParamNumber$2(greenValue) / 255);
    var b = toFloatString(parseParamNumber$2(blueValue) / 255);

    return shader('\n        outColor = vec4(\n            pixelColor.r * ' + r + ',\n            pixelColor.g * ' + g + ',\n            pixelColor.b * ' + b + ',\n            pixelColor.a\n        );\n    ');
}

function shift$1() {

    return matrix$3(1.438, -0.062, -0.062, 0, -0.122, 1.378, -0.122, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 1);
}

function solarize$1(redValue, greenValue, blueValue) {
    var r = toFloatString(parseParamNumber$2(redValue));
    var g = toFloatString(parseParamNumber$2(greenValue));
    var b = toFloatString(parseParamNumber$2(blueValue));

    return shader('\n        outColor = vec4(\n            (pixelColor.r < ' + r + ') ? 1.0 - pixelColor.r: pixelColor.r,\n            (pixelColor.g < ' + g + ') ? 1.0 - pixelColor.g: pixelColor.g,\n            (pixelColor.b < ' + b + ') ? 1.0 - pixelColor.b: pixelColor.b,\n            pixelColor.a\n        );\n    ');
}

function technicolor$1() {

    return matrix$3(1.9125277891456083, -0.8545344976951645, -0.09155508482755585, 0, -0.3087833385928097, 1.7658908555458428, -0.10601743074722245, 0, -0.231103377548616, -0.7501899197440212, 1.847597816108189, 0, 0, 0, 0, 1);
}

function thresholdColor$1() {
    var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    scale = toFloatString(parseParamNumber$2(scale));

    return shader('\n        float c = ( (pixelColor.r * 0.2126 + pixelColor.g * 0.7152 + pixelColor.b * 0.0722) ) >= ' + scale + ' ? 1.0 : 0.0;\n\n        outColor = vec4(c, c, c, pixelColor.a);\n    ');
}

/*
 * @param {Number} amount  0..100 
 */
function threshold$1() {
  var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  return thresholdColor$1(scale, amount, false);
}

/**
 * 
 * @param {*} redTint  0..1
 * @param {*} greenTint 0..1
 * @param {*} blueTint 0..1
 */
function tint$1 () {
    var redTint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var greenTint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var blueTint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var r = parseParamNumber$2(redTint);
    var g = parseParamNumber$2(greenTint);
    var b = parseParamNumber$2(blueTint);

    return shader('\n        outColor = vec4(\n            pixelColor.r += (1 - pixelColor.r) * ' + r + ',\n            pixelColor.g += (1 - pixelColor.g) * ' + g + ',\n            pixelColor.b += (1 - pixelColor.b) * ' + b + ',\n            pixelColor.a\n        );\n    ');
}

var pixel$2 = {
    bitonal: bitonal$1,
    brightness: brightness$2,
    brownie: brownie$1,
    clip: clip$1,
    chaos: chaos,
    contrast: contrast$2,
    gamma: gamma$1,
    gradient: gradient$2,
    grayscale: grayscale$1,
    hue: hue$1,
    invert: invert$1,
    kodachrome: kodachrome$1,
    matrix: matrix$3,
    noise: noise$1,
    opacity: opacity$1,
    polaroid: polaroid$1,
    saturation: saturation$1,
    sepia: sepia$1,
    shade: shade$1,
    shift: shift$1,
    solarize: solarize$1,
    technicolor: technicolor$1,
    threshold: threshold$1,
    'threshold-color': thresholdColor$1,
    tint: tint$1
};

function kirsch$1() {
    return multi$3('kirsch-horizontal kirsch-vertical');
}

function sobel$1() {
    return multi$3('sobel-horizontal sobel-vertical');
}

function vintage$1() {
    return multi$3('brightness(0.15) saturation(-0.2) gamma(1.8)');
}

var multi$4 = {
    kirsch: kirsch$1,
    sobel: sobel$1,
    vintage: vintage$1
};

var GLFilter = _extends({}, matrix$2, pixel$2, multi$4);

var TEXTURE_INDEX = 0;

var GLCanvas = function () {
    function GLCanvas() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
            width: '400px',
            height: '300px'
        };
        classCallCheck(this, GLCanvas);

        this.img = opt.img;
        this.width = parseFloat(this.img.width || opt.width || '400px');
        this.height = parseFloat(this.img.height || opt.height || '300px');
        this.init();
    }

    createClass(GLCanvas, [{
        key: 'resize',
        value: function resize() {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.width = this.width + 'px';
            this.canvas.style.height = this.height + 'px';

            this.viewport();
        }

        /* Canvas 비우기, 비울 때 색 지정하기  */

    }, {
        key: 'clear',
        value: function clear() {
            var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

            var gl = this.gl;

            gl.clearColor(r, g, b, a);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }

        /* viewport 설정, 기본적으로 canvas 의 크기로 고정  */

    }, {
        key: 'viewport',
        value: function viewport(x, y, width, height) {
            var gl = this.gl;

            gl.viewport(x || 0, y || 0, width || gl.canvas.width, height || gl.canvas.height);
        }

        // canvas 초기화 
        // gl context 구하기 

    }, {
        key: 'initCanvas',
        value: function initCanvas(vertexSource, fragmentSource) {
            this.canvas = document.createElement('canvas');

            this.gl = this.canvas.getContext('webgl2');

            if (!this.gl) {
                throw new Error("you need webgl2 support");
            }

            // program 생성 
            this.program = this.createProgram(vertexSource, fragmentSource);

            // this.clear()
            this.resize();

            // buffer 설정 
            this.initBuffer();
        }
    }, {
        key: 'draw',
        value: function draw() {
            var primitiveType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'TRIANGLES';
            var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 6;

            var gl = this.gl;

            gl.drawArrays(gl[primitiveType], offset, count);
        }
    }, {
        key: 'triangles',
        value: function triangles() {
            var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;

            this.draw('TRIANGLES', offset, count);
        }
    }, {
        key: 'uniform2f',
        value: function uniform2f() {
            var _gl;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var key = args.shift();

            (_gl = this.gl).uniform2f.apply(_gl, [this.locations[key]].concat(args));
        }
    }, {
        key: 'uniform1f',
        value: function uniform1f() {
            var _gl2;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var key = args.shift();

            (_gl2 = this.gl).uniform1f.apply(_gl2, [this.locations[key]].concat(args));
        }
    }, {
        key: 'uniform1fv',
        value: function uniform1fv() {
            var _gl3;

            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            var key = args.shift();

            (_gl3 = this.gl).uniform1fv.apply(_gl3, [this.locations[key]].concat(args));
        }
    }, {
        key: 'uniform1i',
        value: function uniform1i() {
            var _gl4;

            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            var key = args.shift();

            (_gl4 = this.gl).uniform1i.apply(_gl4, [this.locations[key]].concat(args));
        }
    }, {
        key: 'useProgram',
        value: function useProgram() {
            var gl = this.gl;

            gl.useProgram(this.program);
        }
    }, {
        key: 'bindBuffer',
        value: function bindBuffer(key, data) {
            var drawType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'STATIC_DRAW';

            var gl = this.gl;

            if (!this.buffers[key]) {
                this.buffers[key] = gl.createBuffer();
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[key]);

            if (data) {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl[drawType]);
            }
        }
    }, {
        key: 'enable',
        value: function enable(key) {
            var gl = this.gl;

            // array attribute 를 활성화 시킴 
            gl.enableVertexAttribArray(this.locations[key]);
        }
    }, {
        key: 'location',
        value: function location(key) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "attribute";

            if (type === 'attribute') {
                this.locations[key] = this.gl.getAttribLocation(this.program, key);
            } else if (type === 'uniform') {
                this.locations[key] = this.gl.getUniformLocation(this.program, key);
            }
        }
    }, {
        key: 'a',
        value: function a(key) {
            return this.location(key);
        }
    }, {
        key: 'u',
        value: function u(key) {
            return this.location(key, "uniform");
        }
    }, {
        key: 'pointer',
        value: function pointer(key) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'FLOAT';
            var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
            var normalize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            var stride = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var offset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

            var gl = this.gl;

            gl.vertexAttribPointer(this.locations[key], size, gl[type], normalize, stride, offset);
        }
    }, {
        key: 'bufferData',
        value: function bufferData() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var gl = this.gl;
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        }
    }, {
        key: 'isPowerOf2',
        value: function isPowerOf2(value) {
            return (value & value - 1) == 0;
        }
    }, {
        key: 'bindTexture',
        value: function bindTexture(key) {
            var img = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var mipLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var internalFormat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'RGBA';
            var srcFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'RGBA';
            var srcType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'UNSIGNED_BYTE';

            var gl = this.gl;

            if (arguments.length == 1) {
                gl.bindTexture(gl.TEXTURE_2D, this.textures[key]);
                return;
            }

            if (!this.textures[key]) {
                this.textures[key] = gl.createTexture();
            }

            this.textureIndex[key] = TEXTURE_INDEX++;
            // this.activeTexture(key)
            gl.bindTexture(gl.TEXTURE_2D, this.textures[key]);

            this.setTextureParameter();

            gl.texImage2D(gl.TEXTURE_2D, mipLevel, gl[internalFormat], gl[srcFormat], gl[srcType], img.newImage || img);
        }
    }, {
        key: 'bindColorTexture',
        value: function bindColorTexture(key, data) {
            var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 256;
            var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
            var mipLevel = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var internalFormat = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'RGBA';
            var srcFormat = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'RGBA';
            var srcType = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'UNSIGNED_BYTE';

            var gl = this.gl;

            if (!this.textures[key]) {
                this.textures[key] = gl.createTexture();
            }

            this.textureIndex[key] = TEXTURE_INDEX++;
            gl.bindTexture(gl.TEXTURE_2D, this.textures[key]);

            this.setTextureParameter();

            gl.texImage2D(gl.TEXTURE_2D, mipLevel, gl[internalFormat], width, height, 0, gl[srcFormat], gl[srcType], new Uint8Array(data));
        }
    }, {
        key: 'bindEmptyTexture',
        value: function bindEmptyTexture(key, width, height) {
            var mipLevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var internalFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'RGBA';
            var srcFormat = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'RGBA';
            var srcType = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'UNSIGNED_BYTE';

            var gl = this.gl;

            if (!this.textures[key]) {
                this.textures[key] = gl.createTexture();
            }

            this.textureIndex[key] = TEXTURE_INDEX++;
            gl.bindTexture(gl.TEXTURE_2D, this.textures[key]);

            this.setTextureParameter();

            var border = 0;
            var data = null;

            gl.texImage2D(gl.TEXTURE_2D, mipLevel, gl[internalFormat], width, height, border, gl[srcFormat], gl[srcType], data);
        }
    }, {
        key: 'setTextureParameter',
        value: function setTextureParameter() {
            var gl = this.gl;

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
    }, {
        key: 'bindFrameBufferWithTexture',
        value: function bindFrameBufferWithTexture(key, textureKey, width, height) {
            this.bindEmptyTexture(textureKey, width, height);
            this.bindFrameBuffer(key, textureKey);
        }
    }, {
        key: 'enumToString',
        value: function enumToString(value) {
            var gl = this.gl;

            if (value === 0) {
                return "NONE";
            }
            for (var key in gl) {
                if (gl[key] === value) {
                    return key;
                }
            }
            return "0x" + value.toString(16);
        }
    }, {
        key: 'bindFrameBuffer',
        value: function bindFrameBuffer(key) {
            var textureKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var gl = this.gl;

            if (arguments.length === 1) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, key == null ? null : this.framebuffers[key]);
                return;
            }

            if (!this.framebuffers[key]) {
                // 프레임버퍼 생성하기 
                this.framebuffers[key] = gl.createFramebuffer();
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[key]);

            // framebuffer 에 texture2d 연결 
            var mipLevel = 0;
            var attachmentPoint = gl.COLOR_ATTACHMENT0; // framebuffer 를 attachmentPoint 에 연결한다. 
            // framebuffer 는 데이타를 가지고 있지 않고 연결 고리만 가지고 있다. 
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.textures[textureKey], mipLevel);

            // framebuffer 상태 체크 하기 
            // framebuffer 를 더 이상 할당 못할 수도 있음. 
            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

            // console.log(this.enumToString(attachmentPoint), this.enumToString(status), key, this.textures[textureKey]);

            if (status !== gl.FRAMEBUFFER_COMPLETE) {
                return;
            }
        }
    }, {
        key: 'bindVA',
        value: function bindVA() {
            var gl = this.gl;

            if (!this.vao) {
                this.vao = gl.createVertexArray();
            }

            gl.bindVertexArray(this.vao);
        }
    }, {
        key: 'bindAttr',
        value: function bindAttr(key, data) {
            var drawType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'STATIC_DRAW';
            var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;

            // 버퍼를 만들고 데이타를 연결한다. 
            this.bindBuffer(key, data, drawType);

            //array 변수를 사용할 수 있도록 활성화 시킨다. 
            this.enable(key);

            // 포인터를 지정한다. 
            // array 변수가 어떻게 iteration 될지 지정한다. size 는 한번에 연산될 요소 개수 
            // size 가 2 라고 했을 때 2개씩 하나의 iteration 에 들어간다. 
            // 즉, (x, y) 가 한번에 들어감 
            this.pointer(key, 'FLOAT', size);
        }

        /* 
            shader 에서 사용하는 Attribute, Uniform 변수 설정 
            변수 설정을 간소화 할 필요도 있을 듯 하다. 
        */

    }, {
        key: 'initBuffer',
        value: function initBuffer() {
            var _canvas = this.canvas,
                width = _canvas.width,
                height = _canvas.height;

            // console.log(width, height)

            // 선언된 변수 location 지정 하기 
            // location 을 지정해야 GLSL 에서 해당 변수와 연결할 수 있다. 언제? 

            this.a("a_position");
            this.a("a_texCoord");
            this.u("u_resolution");
            this.u("u_image");
            this.u("u_flipY");

            this.u("u_kernelSelect");
            this.u("u_filterIndex");

            this.u("u_kernel9[0]");
            this.u("u_kernel9Weight");
            this.u("u_kernel25[0]");
            this.u("u_kernel25Weight");
            this.u("u_kernel49[0]");
            this.u("u_kernel49Weight");
            this.u("u_kernel81[0]");
            this.u("u_kernel81Weight");

            this.bindVA();

            // 단순 변수를 초기화 하고 
            this.bindAttr("a_position", [0, 0, width, 0, 0, height, 0, height, width, 0, width, height], 'STATIC_DRAW', 2 /* components for iteration */);

            // 변수에 데이타를 연결할다. 
            this.bindAttr("a_texCoord", [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0], 'STATIC_DRAW', 2 /* components for iteration */);

            // texture 는 img 로 할 수도 있고 
            this.bindTexture("u_image", this.img);

            // 비어있는 texture 도 만들 수 있다. 
            // 객체로 제어할까? 
            // texture 를 framebuffer 로 바로 대응시킨다. 
            // 이후 framebuffer 가 변경되면 img_texture 가 바뀐다. 
            this.bindFrameBufferWithTexture("frame_buffer_0", "img_texture_0", width, height);
            this.bindFrameBufferWithTexture("frame_buffer_1", "img_texture_1", width, height);
        }
    }, {
        key: 'activeTexture',
        value: function activeTexture() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var gl = this.gl;

            gl.activeTexture(gl.TEXTURE0 + index);
        }
    }, {
        key: 'drawFilter',
        value: function drawFilter() {
            var _this = this;

            var gl = this.gl;

            this.resize();
            this.clear();

            this.useProgram();

            this.bindVA();

            this.activeTexture(0);
            this.bindTexture('u_image');

            this.uniform1i("u_image", 0);
            this.uniform1f("u_flipY", 1);

            var _gl$canvas = gl.canvas,
                width = _gl$canvas.width,
                height = _gl$canvas.height;


            this.eachFilter(function (f, index) {

                _this.bindFrameBuffer('frame_buffer_' + index % 2);
                _this.uniform2f("u_resolution", width, height);
                _this.viewport(0, 0, width, height);

                _this.effectFilter(f);

                // 다음 드로잉을 위해 방금 렌더링 한 텍스처를 사용합니다.
                _this.bindTexture('img_texture_' + index % 2);
            });

            this.uniform1f("u_flipY", -1);
            this.bindFrameBuffer(null);
            this.uniform2f("u_resolution", width, height);
            this.viewport(0, 0, width, height);

            // clear 가 있는 이유는? 
            this.clear();

            this.effectFilter("normal");
        }
    }, {
        key: 'effectFilter',
        value: function effectFilter(filterFunction) {

            if (typeof filterFunction == 'string') {
                filterFunction = (GLFilter[filterFunction] || GLFilter.normal).call(GLFilter);
            }

            if (filterFunction.type == 'convolution') {
                this.uniform1f("u_kernelSelect", filterFunction.length);
                this.uniform1f("u_filterIndex", -1.0);
                this.uniform1fv('u_kernel' + filterFunction.length + '[0]', filterFunction.content);
                this.uniform1f('u_kernel' + filterFunction.length + 'Weight', this.computeKernelWeight(filterFunction.content));
            } else {

                this.uniform1f("u_kernelSelect", -1.0);
                this.uniform1f("u_filterIndex", filterFunction.index);
            }

            this.triangles(0 /* 시작 지점 */, 6 /* 좌표(vertex, 꼭지점) 개수 */); // 총 6개를 도는데 , triangles 니깐 3개씩 묶어서 2번 돈다. 
        }
    }, {
        key: 'computeKernelWeight',
        value: function computeKernelWeight(kernel) {
            var weight = kernel.reduce(function (prev, curr) {
                return prev + curr;
            });
            return weight <= 0 ? 1 : weight;
        }
    }, {
        key: 'createProgram',
        value: function createProgram(vertexSource, fragmentSource) {

            var gl = this.gl;

            var program = gl.createProgram();

            this.vertexShader = this.createVertexShader(vertexSource);
            this.fragmentShader = this.createFragmentShader(fragmentSource);

            // console.log(fragmentSource)      


            gl.attachShader(program, this.vertexShader);
            gl.attachShader(program, this.fragmentShader);

            gl.linkProgram(program);

            var success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {

                return program;
            }

            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }
    }, {
        key: 'createShader',
        value: function createShader(type, source) {
            var gl = this.gl;

            var shader$$1 = gl.createShader(type);
            gl.shaderSource(shader$$1, source);
            gl.compileShader(shader$$1);

            var success = gl.getShaderParameter(shader$$1, gl.COMPILE_STATUS);

            if (success) {
                return shader$$1;
            }

            console.error(gl.getShaderInfoLog(shader$$1));
            gl.deleteShader(shader$$1);
        }
    }, {
        key: 'createVertexShader',
        value: function createVertexShader(vertexSource) {
            var gl = this.gl;

            return this.createShader(gl.VERTEX_SHADER, vertexSource);
        }
    }, {
        key: 'createFragmentShader',
        value: function createFragmentShader(fragmentSource) {
            var gl = this.gl;

            return this.createShader(gl.FRAGMENT_SHADER, fragmentSource);
        }
    }, {
        key: 'eachFilter',
        value: function eachFilter(callback) {
            this.filterList.forEach(callback);
        }
    }, {
        key: 'init',
        value: function init() {
            this.locations = {};
            this.buffers = {};
            this.framebuffers = {};
            this.textures = {};
            this.textureIndex = {};
            this.hasTexParameter = {};
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var gl = this.gl;

            this.init();

            gl.deleteProgram(this.program);
        }
    }, {
        key: 'filter',
        value: function filter(filterList, doneCallback) {

            this.filterList = filterList;

            this.initCanvas(makeVertexShaderSource(), makeFragmentShaderSource(this.filterList));

            this.drawFilter();

            if (typeof doneCallback == 'function') {

                doneCallback(this);
            }
        }
    }]);
    return GLCanvas;
}();

var GL$1 = {
    GLCanvas: GLCanvas
};

var functions = {
    filter: filter
};






function makeFilterFunction(filterObj) {
    var filterName = filterObj.arr[0];
    var f = GLFilter[filterName];

    var arr = filterObj.arr;
    arr.shift();

    var result = f.apply(this, arr);

    return result;
}

/**
 * 겹쳐져 있는 Filter 함수를 1차원으로 나열한다. 
 * ex)  ['sobel'] => ['sobel-horizontal', 'sobel-vertial'] 
 * 
 * @param {String|Array} filterString 
 */
function flatFilter(filterString) {

    var filter_list = [];

    if (typeof filterString == 'string') {
        filter_list = matches$1(filterString);
    } else if (Array.isArray(filterString)) {
        filter_list = filterString;
    }

    var allFilter = [];

    filter_list.forEach(function (filterObj) {
        var filterName = filterObj.arr[0];

        if (GLFilter[filterName]) {
            var f = makeFilterFunction(filterObj);

            if (f.type == 'convolution' || f.type == 'shader') {
                allFilter.push(f);
            } else {
                f.forEach(function (subFilter) {
                    allFilter = allFilter.concat(flatFilter(subFilter));
                });
            }
        }
    });

    // console.log(filter_list, allFilter)

    return allFilter;
}

function filter(img, filterString, callback, opt) {

    var canvas = new GL$1.GLCanvas({
        width: opt.width || img.width,
        height: opt.height || img.height,
        img: img
    });

    canvas.filter(flatFilter(filterString), function done() {
        if (typeof callback == 'function') {
            callback(canvas);
        }
    });
}

var GL = _extends({}, GL$1, functions);

function palette(colors) {
    var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
    var exportFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'hex';


    if (colors.length > k) {
        colors = kmeans(colors, k);
    }

    return colors.map(function (c) {
        return format(c, exportFormat);
    });
}

function ImageToRGB(url) {
    var callbackOrOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments[2];


    if (!callback) {
        var img = new ImageLoader(url);
        img.loadImage(function () {
            if (typeof callbackOrOption == 'function') {
                callbackOrOption(img.toRGB());
            }
        });
    } else if (callback) {
        var img = new ImageLoader(url, callbackOrOption);
        img.loadImage(function () {
            if (typeof callback == 'function') {
                callback(img.toRGB());
            }
        });
    }
}

function ImageToCanvas(url, filter, callback) {
    var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { frameTimer: 'full' };

    ImageToURL(url, filter, callback, Object.assign({
        returnTo: 'canvas'
    }, opt));
}

function ImageToURL(url, filter, callback) {
    var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { frameTimer: 'full' };

    var img = new ImageLoader(url);
    img.loadImage(function () {
        img.toArray(filter, function (datauri) {
            if (typeof callback == 'function') {
                callback(datauri);
            }
        }, opt);
    });
}

function GLToCanvas(url, filter, callback) {
    var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var img = new ImageLoader(url);
    img.load(function () {
        GL.filter(img.newImage, filter, function done(datauri) {
            if (typeof callback == 'function') {
                callback(datauri);
            }
        }, opt);
    });
}

function histogram(url, callback) {
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var img = new ImageLoader(url);
    img.loadImage(function () {
        if (typeof callback == 'function') {
            callback(img.toHistogram(opt));
        }
    });
}

function histogramToPoints(points) {
    var tension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.2;


    var controlPoints = [];
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        if (i == 0) {
            controlPoints[i] = [];
            continue;
        }

        if (i == points.length - 1) {
            controlPoints[i] = [];
            continue;
        }

        var prevPoint = points[i - 1];
        var nextPoint = points[i + 1];

        // 기울기 
        var M = (nextPoint[1] - prevPoint[1]) / (nextPoint[0] - prevPoint[0]);

        var newControlPoint = [prevPoint[0] + (nextPoint[0] - prevPoint[0]) * tension, prevPoint[1] + (nextPoint[1] - prevPoint[1]) * tension];

        var controlPoint = [[].concat(toConsumableArray(prevPoint)), /* start */
        [].concat(newControlPoint) /* end */
        ];

        var P = Math.sqrt(Math.pow(p[0] - prevPoint[0], 2) + Math.pow(p[1] - prevPoint[1], 2));
        var N = Math.sqrt(Math.pow(nextPoint[0] - p[0], 2) + Math.pow(nextPoint[1] - p[1], 2));

        var rate = P / N;

        var dx = controlPoint[0][0] + (controlPoint[1][0] - controlPoint[0][0]) * rate;
        var dy = controlPoint[0][1] + (controlPoint[1][1] - controlPoint[0][1]) * rate;

        controlPoint[0][0] += p[0] - dx;
        controlPoint[0][1] += p[1] - dy;
        controlPoint[1][0] += p[0] - dx;
        controlPoint[1][1] += p[1] - dy;

        controlPoints[i] = controlPoint;
    }

    return controlPoints;
}

function ImageToHistogram(url, callback) {
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { width: 200, height: 100 };


    var img = new ImageLoader(url);
    img.loadImage(function () {
        Canvas.createHistogram(opt.width || 200, opt.height || 100, img.toHistogram(opt), function (canvas) {
            if (typeof callback == 'function') callback(canvas.toDataURL('image/png'));
        }, opt);
    });
}

var image = {
    palette: palette,
    ImageToCanvas: ImageToCanvas,
    ImageToHistogram: ImageToHistogram,
    ImageToRGB: ImageToRGB,
    ImageToURL: ImageToURL,
    GLToCanvas: GLToCanvas,
    histogram: histogram,
    histogramToPoints: histogramToPoints
};

function debounce(callback, delay) {

    var t = undefined;

    return function (cm, e) {
        if (t) {
            clearTimeout(t);
        }

        t = setTimeout(function () {
            callback(cm, e);
        }, delay || 300);
    };
}

var func = {
    debounce: debounce
};

var Color$1 = _extends({}, formatter, math, mixin, parser, fromYCrCb, fromRGB, fromCMYK, fromHSV, fromHSL, fromLAB, image, func);

var hue_color = [{ rgb: '#ff0000', start: .0 }, { rgb: '#ffff00', start: .17 }, { rgb: '#00ff00', start: .33 }, { rgb: '#00ffff', start: .50 }, { rgb: '#0000ff', start: .67 }, { rgb: '#ff00ff', start: .83 }, { rgb: '#ff0000', start: 1 }];

function checkHueColor(p) {
    var startColor, endColor;

    for (var i = 0; i < hue_color.length; i++) {
        if (hue_color[i].start >= p) {
            startColor = hue_color[i - 1];
            endColor = hue_color[i];
            break;
        }
    }

    if (startColor && endColor) {
        return Color$1.interpolateRGB(startColor, endColor, (p - startColor.start) / (endColor.start - startColor.start));
    }

    return hue_color[0].rgb;
}

function initHueColors() {
    for (var i = 0, len = hue_color.length; i < len; i++) {
        var hue = hue_color[i];

        var obj = Color$1.parse(hue.rgb);

        hue.r = obj.r;
        hue.g = obj.g;
        hue.b = obj.b;
    }
}

initHueColors();

var HueColor = {
    colors: hue_color,
    checkHueColor: checkHueColor
};

// TODO: worker run 
var ImageFilter = _extends({}, FilterList, functions$1);

var Util = {
    Color: Color$1,
    HueColor: HueColor,
    ColorNames: ColorNames,
    ImageFilter: ImageFilter,
    GL: GL,
    Canvas: Canvas,
    ImageLoader: ImageLoader
};

var counter = 0;
var cached = [];

var Dom = function () {
    function Dom(tag, className, attr) {
        classCallCheck(this, Dom);


        if (typeof tag != 'string') {
            this.el = tag;
        } else {

            var el = document.createElement(tag);
            this.uniqId = counter++;

            if (className) {
                el.className = className;
            }

            attr = attr || {};

            for (var k in attr) {
                el.setAttribute(k, attr[k]);
            }

            this.el = el;
        }
    }

    createClass(Dom, [{
        key: 'attr',
        value: function attr(key, value) {
            if (arguments.length == 1) {
                return this.el.getAttribute(key);
            }

            this.el.setAttribute(key, value);

            return this;
        }
    }, {
        key: 'is',
        value: function is(checkElement) {
            return this.el === (checkElement.el || checkElement);
        }
    }, {
        key: 'closest',
        value: function closest(cls) {

            var temp = this;
            var checkCls = false;

            while (!(checkCls = temp.hasClass(cls))) {
                if (temp.el.parentNode) {
                    temp = new Dom(temp.el.parentNode);
                } else {
                    return null;
                }
            }

            if (checkCls) {
                return temp;
            }

            return null;
        }
    }, {
        key: 'removeClass',
        value: function removeClass(cls) {

            if (this.el.className) {
                this.el.className = (' ' + this.el.className + ' ').replace(' ' + cls + ' ', ' ').trim();
            }

            return this;
        }
    }, {
        key: 'hasClass',
        value: function hasClass(cls) {
            if (!this.el.className) {
                return false;
            } else {
                var newClass = ' ' + this.el.className + ' ';
                return newClass.indexOf(' ' + cls + ' ') > -1;
            }
        }
    }, {
        key: 'addClass',
        value: function addClass(cls) {
            if (!this.hasClass(cls)) {
                this.el.className = this.el.className + ' ' + cls;
            }

            return this;
        }
    }, {
        key: 'toggleClass',
        value: function toggleClass(cls) {
            var isForce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            if (arguments.length == 2) {
                if (isForce) {
                    this.addClass(cls);
                } else {
                    this.removeClass(cls);
                }
            } else {
                if (this.hasClass(cls)) {
                    this.removeClass(cls);
                } else {
                    this.addClass(cls);
                }
            }
        }
    }, {
        key: 'html',
        value: function html(_html) {

            if (arguments.length == 0) {
                return this.el.innerHTML;
            }

            if (typeof _html == 'string') {
                this.el.innerHTML = _html;
            } else {
                this.empty().append(_html);
            }

            return this;
        }
    }, {
        key: 'find',
        value: function find(selector) {
            return this.el.querySelector(selector);
        }
    }, {
        key: '$',
        value: function $(selector) {
            var node = this.find(selector);
            return node ? new Dom(node) : null;
        }
    }, {
        key: 'findAll',
        value: function findAll(selector) {
            return this.el.querySelectorAll(selector);
        }
    }, {
        key: '$$',
        value: function $$(selector) {
            return [].concat(toConsumableArray(this.findAll(selector))).map(function (node) {
                return new Dom(node);
            });
        }
    }, {
        key: 'empty',
        value: function empty() {
            return this.html('');
        }
    }, {
        key: 'append',
        value: function append(el) {

            if (typeof el == 'string') {
                this.el.appendChild(document.createTextNode(el));
            } else {
                this.el.appendChild(el.el || el);
            }

            return this;
        }
    }, {
        key: 'appendTo',
        value: function appendTo(target) {
            var t = target.el ? target.el : target;

            t.appendChild(this.el);

            return this;
        }
    }, {
        key: 'remove',
        value: function remove() {
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }

            return this;
        }
    }, {
        key: 'text',
        value: function text(value) {
            if (arguments.length == 0) {
                return this.el.textContent;
            } else {
                this.el.textContent = value;
                return this;
            }
        }
    }, {
        key: 'css',
        value: function css(key, value) {
            var _this = this;

            if (arguments.length == 2) {
                this.el.style[key] = value;
            } else if (arguments.length == 1) {

                if (typeof key == 'string') {
                    return getComputedStyle(this.el)[key];
                } else {
                    var keys = key || {};
                    Object.keys(keys).forEach(function (k) {
                        _this.el.style[k] = keys[k];
                    });
                }
            }

            return this;
        }
    }, {
        key: 'cssFloat',
        value: function cssFloat(key) {
            return parseFloat(this.css(key));
        }
    }, {
        key: 'cssInt',
        value: function cssInt(key) {
            return parseInt(this.css(key));
        }
    }, {
        key: 'px',
        value: function px(key, value) {
            return this.css(key, value + 'px');
        }
    }, {
        key: 'rect',
        value: function rect() {
            return this.el.getBoundingClientRect();
        }
    }, {
        key: 'offset',
        value: function offset() {
            var rect = this.rect();

            return {
                top: rect.top + Dom.getScrollTop(),
                left: rect.left + Dom.getScrollLeft()
            };
        }
    }, {
        key: 'offsetLeft',
        value: function offsetLeft() {
            return this.offset().left;
        }
    }, {
        key: 'offsetTop',
        value: function offsetTop() {
            return this.offset().top;
        }
    }, {
        key: 'position',
        value: function position() {

            if (this.el.style.top) {
                return {
                    top: parseFloat(this.css('top')),
                    left: parseFloat(this.css('left'))
                };
            } else {
                return this.rect();
            }
        }
    }, {
        key: 'size',
        value: function size() {
            return [this.width(), this.height()];
        }
    }, {
        key: 'width',
        value: function width() {
            return this.el.offsetWidth || this.rect().width;
        }
    }, {
        key: 'contentWidth',
        value: function contentWidth() {
            return this.width() - this.cssFloat('padding-left') - this.cssFloat('padding-right');
        }
    }, {
        key: 'height',
        value: function height() {
            return this.el.offsetHeight || this.rect().height;
        }
    }, {
        key: 'contentHeight',
        value: function contentHeight() {
            return this.height() - this.cssFloat('padding-top') - this.cssFloat('padding-bottom');
        }
    }, {
        key: 'dataKey',
        value: function dataKey(key) {
            return this.uniqId + '.' + key;
        }
    }, {
        key: 'data',
        value: function data(key, value) {
            if (arguments.length == 2) {
                cached[this.dataKey(key)] = value;
            } else if (arguments.length == 1) {
                return cached[this.dataKey(key)];
            } else {
                var keys = Object.keys(cached);

                var uniqId = this.uniqId + ".";
                return keys.filter(function (key) {
                    if (key.indexOf(uniqId) == 0) {
                        return true;
                    }

                    return false;
                }).map(function (value) {
                    return cached[value];
                });
            }

            return this;
        }
    }, {
        key: 'val',
        value: function val(value) {
            if (arguments.length == 0) {
                return this.el.value;
            } else if (arguments.length == 1) {
                this.el.value = value;
            }

            return this;
        }
    }, {
        key: 'int',
        value: function int() {
            return parseInt(this.val(), 10);
        }
    }, {
        key: 'float',
        value: function float() {
            return parseFloat(this.val());
        }
    }, {
        key: 'show',
        value: function show() {
            return this.css('display', 'block');
        }
    }, {
        key: 'hide',
        value: function hide() {
            return this.css('display', 'none');
        }
    }, {
        key: 'toggle',
        value: function toggle(isForce) {

            var currentHide = this.css('display') == 'none';

            if (arguments.length == 1) {
                currentHide = isForce;
            }

            if (currentHide) {
                return this.show();
            } else {
                return this.hide();
            }
        }
    }, {
        key: 'scrollTop',
        value: function scrollTop() {
            if (this.el === document.body) {
                return Dom.getScrollTop();
            }

            return this.el.scrollTop;
        }
    }, {
        key: 'scrollLeft',
        value: function scrollLeft() {
            if (this.el === document.body) {
                return Dom.getScrollLeft();
            }

            return this.el.scrollLeft;
        }
    }, {
        key: 'on',
        value: function on(eventName, callback, opt1, opt2) {
            this.el.addEventListener(eventName, callback, opt1, opt2);

            return this;
        }
    }, {
        key: 'off',
        value: function off(eventName, callback) {
            this.el.removeEventListener(eventName, callback);

            return this;
        }
    }, {
        key: 'getElement',
        value: function getElement() {
            return this.el;
        }
    }, {
        key: 'createChild',
        value: function createChild(tag) {
            var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
            var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var css = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            var $element = new Dom(tag, className, attrs);
            $element.css(css);

            this.append($element);

            return $element;
        }
    }, {
        key: 'firstChild',
        value: function firstChild() {
            return new Dom(this.el.firstElementChild);
        }
    }, {
        key: 'children',
        value: function children() {
            var element = this.el.firstElementChild;

            if (!element) {
                return [];
            }

            var results = [];

            do {
                results.push(new Dom(element));
                element = element.nextElementSibling;
            } while (element);

            return results;
        }
    }, {
        key: 'childLength',
        value: function childLength() {
            return this.el.children.length;
        }
    }, {
        key: 'replace',
        value: function replace(newElement) {

            this.el.parentNode.replaceChild(newElement.el || newElement, this.el);

            return this;
        }
    }, {
        key: 'checked',
        value: function checked() {
            var isChecked = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            this.el.checked = isChecked;
        }
    }], [{
        key: 'getScrollTop',
        value: function getScrollTop() {
            return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
        }
    }, {
        key: 'getScrollLeft',
        value: function getScrollLeft() {
            return Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft);
        }
    }]);
    return Dom;
}();

var ACTION_PREFIX = '/';
var GETTER_PREFIX = '*/';

var BaseModule = function () {
    function BaseModule($store) {
        classCallCheck(this, BaseModule);

        this.$store = $store;
        this.initialize();
    }

    createClass(BaseModule, [{
        key: 'afterDispatch',
        value: function afterDispatch() {}
    }, {
        key: 'initialize',
        value: function initialize() {
            var _this = this;

            this.filterProps(ACTION_PREFIX).forEach(function (key) {
                _this.$store.action(key, _this);
            });

            this.filterProps(GETTER_PREFIX).forEach(function (key) {
                _this.$store.getter(key, _this);
            });
        }
    }, {
        key: 'filterProps',
        value: function filterProps() {
            var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

            return Object.getOwnPropertyNames(this.__proto__).filter(function (key) {
                return key.startsWith(pattern);
            });
        }
    }]);
    return BaseModule;
}();

var ColorSetsList = function (_BaseModule) {
    inherits(ColorSetsList, _BaseModule);

    function ColorSetsList() {
        classCallCheck(this, ColorSetsList);
        return possibleConstructorReturn(this, (ColorSetsList.__proto__ || Object.getPrototypeOf(ColorSetsList)).apply(this, arguments));
    }

    createClass(ColorSetsList, [{
        key: 'initialize',
        value: function initialize() {
            get(ColorSetsList.prototype.__proto__ || Object.getPrototypeOf(ColorSetsList.prototype), 'initialize', this).call(this);

            // set property
            this.$store.colorSetsList = [{ name: "Material",
                colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B']
            }, { name: "Custom", "edit": true, "colors": [] }, { name: "Color Scale", "scale": ['red', 'yellow', 'black'], count: 5 }];
            this.$store.currentColorSets = {};
        }
    }, {
        key: '/setUserPalette',
        value: function setUserPalette($store, list) {
            $store.userList = list;

            $store.dispatch('/resetUserPalette');
            $store.dispatch('/setCurrentColorSets');
        }
    }, {
        key: '/resetUserPalette',
        value: function resetUserPalette($store) {
            if ($store.userList && $store.userList.length) {
                $store.userList = $store.userList.map(function (element, index) {

                    if (typeof element.colors == 'function') {
                        var makeCallback = element.colors;

                        element.colors = makeCallback($store);
                        element._colors = makeCallback;
                    }

                    return Object.assign({
                        name: 'color-' + index,
                        colors: []
                    }, element);
                });

                $store.emit('changeUserList');
            }
        }
    }, {
        key: '/setCurrentColorSets',
        value: function setCurrentColorSets($store, nameOrIndex) {

            var _list = $store.read('/list');

            if (typeof nameOrIndex == 'undefined') {
                $store.currentColorSets = _list[0];
            } else if (typeof nameOrIndex == 'number') {
                $store.currentColorSets = _list[nameOrIndex];
            } else {
                $store.currentColorSets = _list.filter(function (obj) {
                    return obj.name == nameOrIndex;
                })[0];
            }

            $store.emit('changeCurrentColorSets');
        }
    }, {
        key: '*/getCurrentColorSets',
        value: function getCurrentColorSets($store) {
            return $store.currentColorSets;
        }
    }, {
        key: '/addCurrentColor',
        value: function addCurrentColor($store, color) {
            if (Array.isArray($store.currentColorSets.colors)) {
                $store.currentColorSets.colors.push(color);
                $store.emit('changeCurrentColorSets');
            }
        }
    }, {
        key: '/setCurrentColorAll',
        value: function setCurrentColorAll($store) {
            var colors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            $store.currentColorSets.colors = colors;
            $store.emit('changeCurrentColorSets');
        }
    }, {
        key: '/removeCurrentColor',
        value: function removeCurrentColor($store, index) {
            if ($store.currentColorSets.colors[index]) {
                $store.currentColorSets.colors.splice(index, 1);
                $store.emit('changeCurrentColorSets');
            }
        }
    }, {
        key: '/removeCurrentColorToTheRight',
        value: function removeCurrentColorToTheRight($store, index) {
            if ($store.currentColorSets.colors[index]) {
                $store.currentColorSets.colors.splice(index, Number.MAX_VALUE);
                $store.emit('changeCurrentColorSets');
            }
        }
    }, {
        key: '/clearPalette',
        value: function clearPalette($store) {
            if ($store.currentColorSets.colors) {
                $store.currentColorSets.colors = [];
                $store.emit('changeCurrentColorSets');
            }
        }
    }, {
        key: '*/list',
        value: function list($store) {
            return Array.isArray($store.userList) && $store.userList.length ? $store.userList : $store.colorSetsList;
        }
    }, {
        key: '*/getCurrentColors',
        value: function getCurrentColors($store) {
            return $store.read('/getColors', $store.currentColorSets);
        }
    }, {
        key: '*/getColors',
        value: function getColors($store, element) {
            if (element.scale) {
                return Color$1.scale(element.scale, element.count);
            }

            return element.colors || [];
        }
    }, {
        key: '*/getColorSetsList',
        value: function getColorSetsList($store) {
            return $store.read('/list').map(function (element) {
                return {
                    name: element.name,
                    edit: element.edit,
                    colors: $store.read('/getColors', element)
                };
            });
        }
    }]);
    return ColorSetsList;
}(BaseModule);

var Event = {
    addEvent: function addEvent(dom, eventName, callback) {
        if (dom) {
            dom.addEventListener(eventName, callback);
        }
    },
    removeEvent: function removeEvent(dom, eventName, callback) {
        if (dom) {
            dom.removeEventListener(eventName, callback);
        }
    },
    pos: function pos(e) {
        if (e.touches && e.touches[0]) {
            return e.touches[0];
        }

        return e;
    },
    posXY: function posXY(e) {
        var pos = this.pos(e);
        return {
            x: pos.pageX,
            y: pos.pageY
        };
    }
};

var DELEGATE_SPLIT = '.';

var State = function () {
  function State(masterObj) {
    var _this = this;

    var settingObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, State);


    this.masterObj = masterObj;
    this.settingObj = settingObj;

    window.addEventListener('resize', debounce(function () {
      _this.initialize();
    }, 300));
  }

  createClass(State, [{
    key: 'initialize',
    value: function initialize() {
      this.settingObj = {};
    }
  }, {
    key: 'set',
    value: function set$$1(key, value) {
      var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      this.settingObj[key] = value || defaultValue;
    }
  }, {
    key: 'init',
    value: function init(key) {

      if (!this.has(key)) {

        var arr = key.split(DELEGATE_SPLIT);

        var obj = this.masterObj.refs[arr[0]] || this.masterObj[arr[0]] || this.masterObj;
        var method = arr.pop();

        if (obj[method]) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var value = obj[method].apply(obj, args);

          this.set(key, value);
        }
      }
    }
  }, {
    key: 'get',
    value: function get$$1(key) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';


      this.init(key, defaultValue);

      return this.settingObj[key] || defaultValue;
    }
  }, {
    key: 'has',
    value: function has(key) {
      return !!this.settingObj[key];
    }
  }]);
  return State;
}();

var CHECK_EVENT_PATTERN = /^(click|mouse(down|up|move|over|out|enter|leave)|pointer(start|move|end)|touch(start|move|end)|key(down|up|press)|drag|dragstart|drop|dragover|dragenter|dragleave|dragexit|dragend|contextmenu|change|input|ttingttong|tt)/ig;
var CHECK_LOAD_PATTERN = /^load (.*)/ig;
var EVENT_SAPARATOR = ' ';
var EVENT_NAME_SAPARATOR = ':';
var META_KEYS = ['Control', 'Shift', 'Alt', 'Meta'];
var PREDEFINED_EVENT_NAMES = {
  'pointerstart': 'mousedown:touchstart',
  'pointermove': 'mousemove:touchmove',
  'pointerend': 'mouseup:touchend',
  'ttingttong': 'click',
  'tt': 'click'

  //  'mousedown.debounce(300)

};
var EventMachin = function () {
  function EventMachin() {
    classCallCheck(this, EventMachin);

    this.state = new State(this);
    this.refs = {};
    this.children = {};
    this.childComponents = this.components();
  }

  /**
   * 부모가 정의한 template 과  그 안에서 동작하는 자식 컴포넌트들을 다 합쳐서 
   * 최종 element 를 만들어준다. 
   * 
   * 그리고 자동으로 load 되어질게 있으면 로드 해준다. 
   */


  createClass(EventMachin, [{
    key: 'render',
    value: function render($container) {
      // 1. 나의 template 을 만들어내고  
      this.$el = this.parseTemplate(this.template());
      this.refs.$el = this.$el;

      if ($container) $container.html(this.$el);

      // 데이타 로드 하고 
      this.load();

      this.afterRender();
    }
  }, {
    key: 'afterRender',
    value: function afterRender() {}

    /**
     * 자식 컴포넌트로 사용될 객체 정의 
     */

  }, {
    key: 'components',
    value: function components() {
      return {};
    }

    /**
     * Class 기반으로 $el 을 생성하기 위해서 
     * 선언형으로 html 템플릿을 정의한다. 
     * 
     * @param {*} html 
     */

  }, {
    key: 'parseTemplate',
    value: function parseTemplate(html, isLoad) {
      var _this = this;

      if (Array.isArray(html)) {
        html = html.join('');
      }

      // 모든 element 는 root element 가 하나여야 한다. 
      var list = new Dom("div").html(html).children();

      var fragment = document.createDocumentFragment();

      list.forEach(function ($el) {
        // ref element 정리 
        if ($el.attr('ref')) {
          _this.refs[$el.attr('ref')] = $el;
        }
        var refs = $el.$$('[ref]');

        [].concat(toConsumableArray(refs)).forEach(function ($dom) {
          var name = $dom.attr('ref');
          _this.refs[name] = $dom;
        });

        fragment.appendChild($el.el);
      });

      if (!isLoad) {
        return list[0];
      }

      return fragment;
    }

    /**
     * target 으로 지정된 자식 컴포넌트를 대체해준다.
     * load 이후에 parseComponent 를 한번더 실행을 해야한다. 
     * load 이후에 새로운 Component 가 있으면 parseComponent 를 할 수가 없는데.... 
     * 이상한데 왜 로드가 안되어 있지? 
     */

  }, {
    key: 'parseComponent',
    value: function parseComponent() {
      var _this2 = this;

      var $el = this.$el;
      Object.keys(this.childComponents).forEach(function (ComponentName) {

        var Component = _this2.childComponents[ComponentName];
        var targets = $el.$$('' + ComponentName.toLowerCase());
        [].concat(toConsumableArray(targets)).forEach(function ($dom) {
          var props = {};

          [].concat(toConsumableArray($dom.el.attributes)).filter(function (t) {
            return ['ref'].indexOf(t.nodeName) < 0;
          }).forEach(function (t) {
            props[t.nodeName] = t.nodeValue;
          });

          var refName = $dom.attr('ref') || ComponentName;

          if (refName) {

            if (Component) {

              var instance = new Component(_this2, props);
              _this2.children[refName] = instance;
              _this2.refs[refName] = instance.$el;

              if (instance) {
                instance.render();

                $dom.replace(instance.$el);
              }
            }
          }
        });
      });
    }

    // load function이 정의된 객체는 load 를 실행해준다. 

  }, {
    key: 'load',
    value: function load() {
      var _this3 = this;

      this.filterProps(CHECK_LOAD_PATTERN).forEach(function (callbackName) {
        var elName = callbackName.split('load ')[1];
        if (_this3.refs[elName]) {
          var fragment = _this3.parseTemplate(_this3[callbackName].call(_this3), true);
          _this3.refs[elName].html(fragment);
        }
      });

      this.parseComponent();
    }

    // 기본 템플릿 지정 

  }, {
    key: 'template',
    value: function template() {
      return '<div></div>';
    }
  }, {
    key: 'initialize',
    value: function initialize() {}
  }, {
    key: 'eachChildren',
    value: function eachChildren(callback) {
      var _this4 = this;

      Object.keys(this.children).forEach(function (ChildComponentName) {
        if (typeof callback == 'function') {
          callback(_this4.children[ChildComponentName]);
        }
      });
    }

    /**
     * 이벤트를 초기화한다. 
     */

  }, {
    key: 'initializeEvent',
    value: function initializeEvent() {
      this.initializeEventMachin();

      // 자식 이벤트도 같이 초기화 한다. 
      // 그래서 이 메소드는 부모에서 한번만 불려도 된다. 
      this.eachChildren(function (Component) {
        Component.initializeEvent();
      });
    }

    /**
     * 자원을 해제한다. 
     * 이것도 역시 자식 컴포넌트까지 제어하기 때문에 가장 최상위 부모에서 한번만 호출되도 된다. 
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.destroyEventMachin();
      // this.refs = {} 

      this.eachChildren(function (Component) {
        Component.destroy();
      });
    }
  }, {
    key: 'destroyEventMachin',
    value: function destroyEventMachin() {
      this.removeEventAll();
    }
  }, {
    key: 'initializeEventMachin',
    value: function initializeEventMachin() {
      this.filterProps(CHECK_EVENT_PATTERN).forEach(this.parseEvent.bind(this));
    }

    /**
     * property 수집하기 
     * 상위 클래스의 모든 property 를 수집해서 리턴한다. 
     */

  }, {
    key: 'collectProps',
    value: function collectProps() {

      if (!this.collapsedProps) {
        var p = this.__proto__;
        var results = [];
        do {
          results.push.apply(results, toConsumableArray(Object.getOwnPropertyNames(p)));
          p = p.__proto__;
        } while (p);

        this.collapsedProps = results;
      }

      return this.collapsedProps;
    }
  }, {
    key: 'filterProps',
    value: function filterProps(pattern) {
      return this.collectProps().filter(function (key) {
        return key.match(pattern);
      });
    }
  }, {
    key: 'getEventNames',
    value: function getEventNames(eventName) {
      var results = [];

      eventName.split(EVENT_NAME_SAPARATOR).forEach(function (e) {
        var arr = (PREDEFINED_EVENT_NAMES[e] || e).split(EVENT_NAME_SAPARATOR);

        results.push.apply(results, toConsumableArray(arr));
      });

      return results;
    }
  }, {
    key: 'parseEvent',
    value: function parseEvent(key) {
      var _this5 = this;

      var arr = key.split(EVENT_SAPARATOR);

      var eventNames = this.getEventNames(arr[0]);

      var params = arr.slice(1);
      var callback = this[key].bind(this);

      eventNames.forEach(function (eventName) {
        var eventInfo = [eventName].concat(toConsumableArray(params));
        _this5.bindingEvent(eventInfo, callback);
      });
    }
  }, {
    key: 'getDefaultDomElement',
    value: function getDefaultDomElement(dom) {
      var el = void 0;

      if (dom) {
        el = this.refs[dom] || this[dom] || window[dom];
      } else {
        el = this.el || this.$el || this.$root;
      }

      if (el instanceof Dom) {
        return el.getElement();
      }

      return el;
    }

    /* magic check method  */

  }, {
    key: 'self',
    value: function self(e) {
      // e.target 이 delegate 대상인지 체크 
      return e.delegateTarget == e.target;
    }
  }, {
    key: 'getDefaultEventObject',
    value: function getDefaultEventObject(eventName) {
      var _this6 = this;

      var arr = eventName.split('.');
      var realEventName = arr.shift();

      var isControl = arr.includes('Control');
      var isShift = arr.includes('Shift');
      var isAlt = arr.includes('Alt');
      var isMeta = arr.includes('Meta');

      arr = arr.filter(function (code) {
        return META_KEYS.includes(code) === false;
      });

      var checkMethodList = arr.filter(function (code) {
        return !!_this6[code];
      });

      // const delay = arr.filter(code => {
      //   return (+code) + '' == code
      // })

      // const debounce = delay.length ? +delay[0] : 0;   // 0 은 debounce 하지 않음 . 
      var debounceTime = 0;

      arr = arr.filter(function (code) {
        return checkMethodList.includes(code) === false;
        // && delay.includes(code) === false; 
      }).map(function (code) {
        return code.toLowerCase();
      });

      return {
        eventName: realEventName,
        isControl: isControl,
        isShift: isShift,
        isAlt: isAlt,
        isMeta: isMeta,
        codes: arr,
        debounce: debounceTime,
        checkMethodList: checkMethodList
      };
    }
  }, {
    key: 'bindingEvent',
    value: function bindingEvent(_ref, callback) {
      var _ref2 = toArray(_ref),
          eventName = _ref2[0],
          dom = _ref2[1],
          delegate = _ref2.slice(2);

      dom = this.getDefaultDomElement(dom);
      var eventObject = this.getDefaultEventObject(eventName);

      eventObject.dom = dom;
      eventObject.delegate = delegate.join(EVENT_SAPARATOR);

      this.addEvent(eventObject, callback);
    }
  }, {
    key: 'matchPath',
    value: function matchPath(el, selector) {
      if (el) {
        if (el.matches(selector)) {
          return el;
        }
        return this.matchPath(el.parentElement, selector);
      }
      return null;
    }
  }, {
    key: 'getBindings',
    value: function getBindings() {

      if (!this._bindings) {
        this.initBindings();
      }

      return this._bindings;
    }
  }, {
    key: 'addBinding',
    value: function addBinding(obj) {
      this.getBindings().push(obj);
    }
  }, {
    key: 'initBindings',
    value: function initBindings() {
      this._bindings = [];
    }
  }, {
    key: 'checkEventType',
    value: function checkEventType(e, eventObject) {
      var _this7 = this;

      var onlyControl = eventObject.isControl ? e.ctrlKey : true;
      var onlyShift = eventObject.isShift ? e.shiftKey : true;
      var onlyAlt = eventObject.isAlt ? e.altKey : true;
      var onlyMeta = eventObject.isMeta ? e.metaKey : true;

      // 특정 keycode 를 가지고 있는지 체크 
      // keyup.pagedown  이라고 정의하면 pagedown 키를 눌렀을때만 동작 함 
      var hasKeyCode = true;
      if (eventObject.codes.length) {
        hasKeyCode = eventObject.codes.includes(e.code.toLowerCase()) || eventObject.codes.includes(e.key.toLowerCase());
      }

      // 체크 메소드들은 모든 메소드를 다 적용해야한다. 
      var isAllCheck = true;
      if (eventObject.checkMethodList.length) {
        isAllCheck = eventObject.checkMethodList.every(function (method) {
          return _this7[method].call(_this7, e);
        });
      }

      return onlyControl && onlyAlt && onlyShift && onlyMeta && hasKeyCode && isAllCheck;
    }
  }, {
    key: 'makeCallback',
    value: function makeCallback(eventObject, callback) {
      var _this8 = this;

      if (eventObject.debounce) {
        callback = debounce(callback, eventObject.debounce);
      }

      if (eventObject.delegate) {
        return function (e) {
          var delegateTarget = _this8.matchPath(e.target || e.srcElement, eventObject.delegate);

          if (delegateTarget) {
            // delegate target 이 있는 경우만 callback 실행 
            e.delegateTarget = delegateTarget;
            e.$delegateTarget = new Dom(delegateTarget);
            e.xy = Event.posXY(e);

            if (_this8.checkEventType(e, eventObject)) {
              return callback(e);
            }
          }
        };
      } else {
        return function (e) {
          e.xy = Event.posXY(e);
          if (_this8.checkEventType(e, eventObject)) {
            return callback(e);
          }
        };
      }
    }
  }, {
    key: 'addEvent',
    value: function addEvent(eventObject, callback) {
      eventObject.callback = this.makeCallback(eventObject, callback);
      this.addBinding(eventObject);
      Event.addEvent(eventObject.dom, eventObject.eventName, eventObject.callback);
    }
  }, {
    key: 'removeEventAll',
    value: function removeEventAll() {
      var _this9 = this;

      this.getBindings().forEach(function (obj) {
        _this9.removeEvent(obj);
      });
      this.initBindings();
    }
  }, {
    key: 'removeEvent',
    value: function removeEvent(_ref3) {
      var eventName = _ref3.eventName,
          dom = _ref3.dom,
          callback = _ref3.callback;

      Event.removeEvent(dom, eventName, callback);
    }
  }]);
  return EventMachin;
}();

var CHECK_STORE_EVENT_PATTERN = /^@/;

var UIElement = function (_EventMachin) {
    inherits(UIElement, _EventMachin);

    function UIElement(opt, props) {
        classCallCheck(this, UIElement);

        var _this = possibleConstructorReturn(this, (UIElement.__proto__ || Object.getPrototypeOf(UIElement)).call(this, opt));

        _this.opt = opt || {};
        _this.parent = _this.opt;
        _this.props = props || {};
        _this.source = uuid();

        window[_this.source] = _this;

        if (opt && opt.$store) {
            _this.$store = opt.$store;
        }

        _this.created();

        _this.initialize();

        _this.initializeStoreEvent();
        return _this;
    }

    createClass(UIElement, [{
        key: 'created',
        value: function created() {}

        /**
         * initialize store event 
         * 
         * you can define '@xxx' method(event) in UIElement 
         * 
         * 
         */

    }, {
        key: 'initializeStoreEvent',
        value: function initializeStoreEvent() {
            var _this2 = this;

            this.storeEvents = {};
            this.filterProps(CHECK_STORE_EVENT_PATTERN).forEach(function (key) {
                var arr = key.split('@');
                arr.shift();
                var event = arr.join('@');

                _this2.storeEvents[event] = _this2[key].bind(_this2);
                _this2.$store.on(event, _this2.storeEvents[event], _this2);
            });
        }
    }, {
        key: 'destoryStoreEvent',
        value: function destoryStoreEvent() {
            var _this3 = this;

            Object.keys(this.storeEvents).forEach(function (event) {
                _this3.$store.off(event, _this3.storeEvents[event]);
            });
        }
    }, {
        key: 'read',
        value: function read() {
            var _$store;

            return (_$store = this.$store).read.apply(_$store, arguments);
        }
    }, {
        key: 'run',
        value: function run() {
            var _$store2;

            return (_$store2 = this.$store).run.apply(_$store2, arguments);
        }
    }, {
        key: 'dispatch',
        value: function dispatch() {
            var _$store3;

            this.$store.source = this.source;
            return (_$store3 = this.$store).dispatch.apply(_$store3, arguments);
        }
    }, {
        key: 'emit',
        value: function emit() {
            var _$store4;

            this.$store.source = this.source;
            (_$store4 = this.$store).emit.apply(_$store4, arguments);
        }
    }]);
    return UIElement;
}(EventMachin);

function isUndefined(v) {
    return typeof v == 'undefined' || v == null;
}

var ColorManager = function (_BaseModule) {
    inherits(ColorManager, _BaseModule);

    function ColorManager() {
        classCallCheck(this, ColorManager);
        return possibleConstructorReturn(this, (ColorManager.__proto__ || Object.getPrototypeOf(ColorManager)).apply(this, arguments));
    }

    createClass(ColorManager, [{
        key: 'initialize',
        value: function initialize() {
            get(ColorManager.prototype.__proto__ || Object.getPrototypeOf(ColorManager.prototype), 'initialize', this).call(this);

            this.$store.rgb = {};
            this.$store.hsl = {};
            this.$store.hsv = {};
            this.$store.alpha = 1;
            this.$store.format = 'hex';

            // this.$store.dispatch('/changeColor');
        }
    }, {
        key: '/changeFormat',
        value: function changeFormat($store, format) {
            $store.format = format;

            $store.emit('changeFormat');
        }
    }, {
        key: '/initColor',
        value: function initColor($store, colorObj, source) {
            $store.dispatch('/changeColor', colorObj, source, true);
            $store.emit('initColor');
        }
    }, {
        key: '/changeColor',
        value: function changeColor($store, colorObj, source, isNotEmit) {

            colorObj = colorObj || '#FF0000';

            if (typeof colorObj == 'string') {
                colorObj = Color$1.parse(colorObj);
            }

            colorObj.source = colorObj.source || source;

            $store.alpha = isUndefined(colorObj.a) ? $store.alpha : colorObj.a;
            $store.format = colorObj.type != 'hsv' ? colorObj.type || $store.format : $store.format;

            if ($store.format == 'hex' && $store.alpha < 1) {
                $store.format = 'rgb';
            }

            if (colorObj.type == 'hsl') {
                $store.hsl = Object.assign($store.hsl, colorObj);
                $store.rgb = Color$1.HSLtoRGB($store.hsl);
                $store.hsv = Color$1.HSLtoHSV(colorObj);
            } else if (colorObj.type == 'hex') {
                $store.rgb = Object.assign($store.rgb, colorObj);
                $store.hsl = Color$1.RGBtoHSL($store.rgb);
                $store.hsv = Color$1.RGBtoHSV(colorObj);
            } else if (colorObj.type == 'rgb') {
                $store.rgb = Object.assign($store.rgb, colorObj);
                $store.hsl = Color$1.RGBtoHSL($store.rgb);
                $store.hsv = Color$1.RGBtoHSV(colorObj);
            } else if (colorObj.type == 'hsv') {
                $store.hsv = Object.assign($store.hsv, colorObj);
                $store.rgb = Color$1.HSVtoRGB($store.hsv);
                $store.hsl = Color$1.HSVtoHSL($store.hsv);
            }

            if (!isNotEmit) {
                $store.emit('changeColor', colorObj.source);
            }
        }
    }, {
        key: '*/getHueColor',
        value: function getHueColor($store) {
            return HueColor.checkHueColor($store.hsv.h / 360);
        }
    }, {
        key: '*/toString',
        value: function toString($store, type) {
            type = type || $store.format;
            var colorObj = $store[type] || $store.rgb;
            return Color$1.format(Object.assign({}, colorObj, { a: $store.alpha }), type);
        }
    }, {
        key: '*/toColor',
        value: function toColor($store, type) {
            type = (type || $store.format).toLowerCase();

            if (type == 'rgb') {
                return $store.read('/toRGB');
            } else if (type == 'hsl') {
                return $store.read('/toHSL');
            } else if (type == 'hex') {
                return $store.read('/toHEX');
            }

            return $store.read('/toString', type);
        }
    }, {
        key: '*/toRGB',
        value: function toRGB($store) {
            return $store.read('/toString', 'rgb');
        }
    }, {
        key: '*/toHSL',
        value: function toHSL($store) {
            return $store.read('/toString', 'hsl');
        }
    }, {
        key: '*/toHEX',
        value: function toHEX($store) {
            return $store.read('/toString', 'hex').toUpperCase();
        }
    }]);
    return ColorManager;
}(BaseModule);

var BaseStore = function () {
    function BaseStore(opt) {
        classCallCheck(this, BaseStore);

        this.callbacks = [];
        this.actions = [];
        this.getters = [];
        this.modules = opt.modules || [];

        this.initialize();
    }

    createClass(BaseStore, [{
        key: 'initialize',
        value: function initialize() {
            this.initializeModule();
        }
    }, {
        key: 'initializeModule',
        value: function initializeModule() {
            var _this = this;

            this.modules.forEach(function (ModuleClass) {
                var instance = _this.addModule(ModuleClass);
            });
        }
    }, {
        key: 'action',
        value: function action(_action, context) {
            var actionName = _action;
            this.actions[actionName] = { context: context, callback: context[_action] };
        }
    }, {
        key: 'getter',
        value: function getter(action, context) {
            var actionName = action.replace('*', '');
            this.getters[actionName] = { context: context, callback: context[action] };
        }
    }, {
        key: 'dispatch',
        value: function dispatch(action) {
            var m = this.actions[action];

            if (m) {
                for (var _len = arguments.length, opts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    opts[_key - 1] = arguments[_key];
                }

                this.run.apply(this, [action].concat(opts));
                m.context.afterDispatch();
            } else {
                throw new Error('action : ' + action + ' is not a valid.');
            }
        }
    }, {
        key: 'run',
        value: function run(action) {
            var m = this.actions[action];

            if (m) {
                for (var _len2 = arguments.length, opts = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    opts[_key2 - 1] = arguments[_key2];
                }

                m.callback.apply(m.context, [this].concat(opts));
            }
        }
    }, {
        key: 'read',
        value: function read(action) {
            var m = this.getters[action];

            if (m) {
                for (var _len3 = arguments.length, opts = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    opts[_key3 - 1] = arguments[_key3];
                }

                return m.callback.apply(m.context, [this].concat(opts));
            }
        }
    }, {
        key: 'clone',
        value: function clone(action) {
            for (var _len4 = arguments.length, opts = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                opts[_key4 - 1] = arguments[_key4];
            }

            return JSON.parse(JSON.stringify(this.read.apply(this, [action].concat(opts))));
        }
    }, {
        key: 'addModule',
        value: function addModule(ModuleClass) {
            return new ModuleClass(this);
        }
    }, {
        key: 'on',
        value: function on(event, originalCallback, context) {
            var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

            var callback = delay > 0 ? debounce(originalCallback, delay) : originalCallback;
            this.callbacks.push({ event: event, callback: callback, context: context, originalCallback: originalCallback });
        }
    }, {
        key: 'off',
        value: function off(event, originalCallback) {

            if (arguments.length == 0) {
                this.callbacks = [];
            } else if (arguments.length == 1) {
                this.callbacks = this.callbacks.filter(function (f) {
                    return f.event != event;
                });
            } else if (arguments.length == 2) {
                this.callbacks = this.callbacks.filter(function (f) {
                    return !(f.event == event && f.originalCallback == originalCallback);
                });
            }
        }
    }, {
        key: 'emit',
        value: function emit() {
            var _this2 = this;

            var args = [].concat(Array.prototype.slice.call(arguments));
            var event = args.shift();

            this.callbacks.filter(function (f) {
                return f.event == event;
            }).forEach(function (f) {
                if (f && typeof f.callback == 'function' && f.context.source != _this2.source) {
                    f.callback.apply(f, toConsumableArray(args));
                }
            });
        }
    }]);
    return BaseStore;
}();

var BaseColorPicker = function (_UIElement) {
    inherits(BaseColorPicker, _UIElement);

    function BaseColorPicker() {
        classCallCheck(this, BaseColorPicker);
        return possibleConstructorReturn(this, (BaseColorPicker.__proto__ || Object.getPrototypeOf(BaseColorPicker)).apply(this, arguments));
    }

    createClass(BaseColorPicker, [{
        key: 'created',
        value: function created() {
            this.isColorPickerShow = false;
            this.isShortCut = false;
            this.hideDelay = +(typeof this.opt.hideDeplay == 'undefined' ? 2000 : this.opt.hideDelay);
            this.timerCloseColorPicker;
            this.autoHide = this.opt.autoHide || true;
            this.outputFormat = this.opt.outputFormat;
            this.$checkColorPickerClass = this.checkColorPickerClass.bind(this);
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var _this2 = this;

            var modules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            this.$body = null;
            this.$root = null;

            this.$store = new BaseStore({
                modules: [ColorManager, ColorSetsList].concat(toConsumableArray(modules))
            });

            this.callbackChange = function () {
                _this2.callbackChangeValue();
            };

            this.colorpickerShowCallback = function () {};
            this.colorpickerHideCallback = function () {};

            this.$body = new Dom(this.getContainer());
            this.$root = new Dom('div', 'codemirror-colorpicker');

            //  append colorpicker to container (ex : body)
            if (this.opt.position == 'inline') {
                this.$body.append(this.$root);
            }

            if (this.opt.type) {
                // to change css style
                this.$root.addClass(this.opt.type);
            }

            if (this.opt.hideInformation) {
                this.$root.addClass('hide-information');
            }

            if (this.opt.hideColorsets) {
                this.$root.addClass('hide-colorsets');
            }

            this.$arrow = new Dom('div', 'arrow');

            this.$root.append(this.$arrow);

            this.dispatch('/setUserPalette', this.opt.colorSets);

            this.render(this.$root);

            this.initColorWithoutChangeEvent(this.opt.color);

            // 이벤트 연결 
            this.initializeEvent();
        }
    }, {
        key: 'initColorWithoutChangeEvent',
        value: function initColorWithoutChangeEvent(color) {
            this.dispatch('/initColor', color);
        }

        /** 
         * public method 
         * 
         */

        /**
         * 
         * show colorpicker with position  
         * 
         * @param {{left, top, hideDelay, isShortCut}} opt 
         * @param {String|Object} color  
         * @param {Function} showCallback  it is called when colorpicker is shown
         * @param {Function} hideCallback  it is called once when colorpicker is hidden
         */

    }, {
        key: 'show',
        value: function show(opt, color, showCallback, hideCallback) {

            // 매번 이벤트를 지우고 다시 생성할 필요가 없어서 초기화 코드는 지움. 
            // this.destroy();
            // this.initializeEvent();
            // define colorpicker callback
            this.colorpickerShowCallback = showCallback;
            this.colorpickerHideCallback = hideCallback;
            this.$root.css(this.getInitalizePosition()).show();

            this.definePosition(opt);

            this.isColorPickerShow = true;
            this.isShortCut = opt.isShortCut || false;
            this.outputFormat = opt.outputFormat;

            // define hide delay
            this.hideDelay = +(typeof opt.hideDelay == 'undefined' ? 2000 : opt.hideDelay);
            if (this.hideDelay > 0) {
                this.setHideDelay(this.hideDelay);
            }

            this.$root.appendTo(this.$body);

            this.initColorWithoutChangeEvent(color);
        }

        /**
         * 
         * initialize color for colorpicker
         * 
         * @param {String|Object} newColor 
         * @param {String} format  hex, rgb, hsl
         */

    }, {
        key: 'initColor',
        value: function initColor(newColor, format) {
            this.dispatch('/changeColor', newColor, format);
        }

        /**
         * hide colorpicker 
         * 
         */

    }, {
        key: 'hide',
        value: function hide() {
            if (this.isColorPickerShow) {
                // this.destroy();
                this.$root.hide();
                this.$root.remove(); // not empty 
                this.isColorPickerShow = false;

                this.callbackHideValue();
            }
        }

        /**
         * set to colors in current sets that you see 
         * @param {Array} colors 
         */

    }, {
        key: 'setColorsInPalette',
        value: function setColorsInPalette() {
            var colors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            this.dispatch('/setCurrentColorAll', colors);
        }

        /**
         * refresh all color palette 
         * 
         * @param {*} list 
         */

    }, {
        key: 'setUserPalette',
        value: function setUserPalette() {
            var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            this.dispatch('/setUserPalette', list);
        }

        /**
         * private method 
         */

    }, {
        key: 'getOption',
        value: function getOption(key) {
            return this.opt[key];
        }
    }, {
        key: 'setOption',
        value: function setOption(key, value) {
            this.opt[key] = value;
        }
    }, {
        key: 'isType',
        value: function isType(key) {
            return this.getOption('type') == key;
        }
    }, {
        key: 'isPaletteType',
        value: function isPaletteType() {
            return this.isType('palette');
        }
    }, {
        key: 'isSketchType',
        value: function isSketchType() {
            return this.isType('sketch');
        }
    }, {
        key: 'getContainer',
        value: function getContainer() {
            return this.opt.container || document.body;
        }
    }, {
        key: 'getColor',
        value: function getColor(type) {
            return this.read('/toColor', type);
        }
    }, {
        key: 'definePositionForArrow',
        value: function definePositionForArrow(opt, elementScreenLeft, elementScreenTop) {
            // console.log(arguments)
        }
    }, {
        key: 'definePosition',
        value: function definePosition(opt) {

            var width = this.$root.width();
            var height = this.$root.height();

            // set left position for color picker
            var elementScreenLeft = opt.left - this.$body.scrollLeft();
            if (width + elementScreenLeft > window.innerWidth) {
                elementScreenLeft -= width + elementScreenLeft - window.innerWidth;
            }
            if (elementScreenLeft < 0) {
                elementScreenLeft = 0;
            }

            // set top position for color picker
            var elementScreenTop = opt.top - this.$body.scrollTop();
            if (height + elementScreenTop > window.innerHeight) {
                elementScreenTop -= height + elementScreenTop - window.innerHeight;
            }
            if (elementScreenTop < 0) {
                elementScreenTop = 0;
            }

            // set position
            this.$root.css({
                left: elementScreenLeft + 'px',
                top: elementScreenTop + 'px'
            });

            // this.definePositionForArrow(opt, elementScreenLeft, elementScreenTop);
        }
    }, {
        key: 'getInitalizePosition',
        value: function getInitalizePosition() {
            if (this.opt.position == 'inline') {
                return {
                    position: 'relative',
                    left: 'auto',
                    top: 'auto',
                    display: 'inline-block'
                };
            } else {
                return {
                    position: 'fixed', // color picker has fixed position
                    left: '-10000px',
                    top: '-10000px'
                };
            }
        }
    }, {
        key: 'setHideDelay',
        value: function setHideDelay(delayTime) {
            var _this3 = this;

            delayTime = delayTime || 0;

            var hideCallback = this.hide.bind(this);

            this.$root.off('mouseenter');
            this.$root.off('mouseleave');

            this.$root.on('mouseenter', function () {
                clearTimeout(_this3.timerCloseColorPicker);
            });

            this.$root.on('mouseleave', function () {
                clearTimeout(_this3.timerCloseColorPicker);
                _this3.timerCloseColorPicker = setTimeout(hideCallback, delayTime);
            });

            clearTimeout(this.timerCloseColorPicker);
            // this.timerCloseColorPicker = setTimeout(hideCallback, delayTime);
        }
    }, {
        key: 'callbackChangeValue',
        value: function callbackChangeValue(color) {
            color = color || this.getCurrentColor();

            if (typeof this.opt.onChange == 'function') {
                this.opt.onChange.call(this, color);
            }

            if (typeof this.colorpickerShowCallback == 'function') {
                this.colorpickerShowCallback(color);
            }
        }
    }, {
        key: 'callbackHideValue',
        value: function callbackHideValue(color) {
            color = color || this.getCurrentColor();
            if (typeof this.opt.onHide == 'function') {
                this.opt.onHide.call(this, color);
            }

            if (typeof this.colorpickerHideCallback == 'function') {
                this.colorpickerHideCallback(color);
            }
        }
    }, {
        key: 'getCurrentColor',
        value: function getCurrentColor() {
            return this.read('/toColor', this.outputFormat);
        }
    }, {
        key: 'checkColorPickerClass',
        value: function checkColorPickerClass(el) {
            var $el = new Dom(el);
            var hasColorView = $el.closest('codemirror-colorview');
            var hasColorPicker = $el.closest('codemirror-colorpicker');
            var hasCodeMirror = $el.closest('CodeMirror');
            var IsInHtml = el.nodeName == 'HTML';

            return !!(hasColorPicker || hasColorView || hasCodeMirror);
        }
    }, {
        key: 'checkInHtml',
        value: function checkInHtml(el) {
            var IsInHtml = el.nodeName == 'HTML';

            return IsInHtml;
        }
    }, {
        key: 'initializeStoreEvent',
        value: function initializeStoreEvent() {
            get(BaseColorPicker.prototype.__proto__ || Object.getPrototypeOf(BaseColorPicker.prototype), 'initializeStoreEvent', this).call(this);

            this.$store.on('changeColor', this.callbackChange, this);
            this.$store.on('changeFormat', this.callbackChange, this);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            get(BaseColorPicker.prototype.__proto__ || Object.getPrototypeOf(BaseColorPicker.prototype), 'destroy', this).call(this);

            this.$store.off('changeColor', this.callbackChange);
            this.$store.off('changeFormat', this.callbackChange);

            this.callbackChange = undefined;

            // remove color picker callback
            this.colorpickerShowCallback = undefined;
            this.colorpickerHideCallback = undefined;
        }

        // Event Bindings 

    }, {
        key: 'mouseup document',
        value: function mouseupDocument(e) {

            // when color picker clicked in outside
            if (this.checkInHtml(e.target)) {
                //this.setHideDelay(hideDelay);
            } else if (this.checkColorPickerClass(e.target) == false) {
                this.hide();
            }
        }
    }]);
    return BaseColorPicker;
}(UIElement);

var BaseBox = function (_UIElement) {
    inherits(BaseBox, _UIElement);

    function BaseBox() {
        classCallCheck(this, BaseBox);
        return possibleConstructorReturn(this, (BaseBox.__proto__ || Object.getPrototypeOf(BaseBox)).apply(this, arguments));
    }

    createClass(BaseBox, [{
        key: 'refresh',
        value: function refresh() {}
    }, {
        key: 'refreshColorUI',
        value: function refreshColorUI(e) {}

        /** push change event  */

    }, {
        key: 'changeColor',
        value: function changeColor(opt) {
            this.dispatch('/changeColor', opt || {});
        }

        // Event Bindings 

    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.onDragEnd(e);
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            this.onDragMove(e);
        }
    }, {
        key: 'pointerstart $bar',
        value: function pointerstart$bar(e) {
            e.preventDefault();
            this.isDown = true;
        }
    }, {
        key: 'pointerstart $container',
        value: function pointerstart$container(e) {
            this.isDown = true;
            this.onDragStart(e);
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(e) {
            this.isDown = true;
            this.refreshColorUI(e);
        }
    }, {
        key: 'onDragMove',
        value: function onDragMove(e) {
            if (this.isDown) {
                this.refreshColorUI(e);
            }
        }

        /* called when mouse is ended move  */

    }, {
        key: 'onDragEnd',
        value: function onDragEnd(e) {
            this.isDown = false;
        }
    }, {
        key: '@changeColor',
        value: function changeColor() {
            this.refresh();
        }
    }, {
        key: '@initColor',
        value: function initColor() {
            this.refresh();
        }
    }]);
    return BaseBox;
}(UIElement);

var BaseSlider = function (_BaseBox) {
    inherits(BaseSlider, _BaseBox);

    function BaseSlider() {
        classCallCheck(this, BaseSlider);
        return possibleConstructorReturn(this, (BaseSlider.__proto__ || Object.getPrototypeOf(BaseSlider)).apply(this, arguments));
    }

    createClass(BaseSlider, [{
        key: 'initialize',
        value: function initialize() {
            get(BaseSlider.prototype.__proto__ || Object.getPrototypeOf(BaseSlider.prototype), 'initialize', this).call(this);
            this.minValue = 0; // min domain value 
            this.maxValue = 1; // max domain value 
        }

        /* slider container's min and max position */

    }, {
        key: 'getMinMaxPosition',
        value: function getMinMaxPosition() {
            var min = this.getMinPosition();
            var width = this.getMaxDist();
            var max = min + width;

            return { min: min, max: max, width: width };
        }

        /** get current position on page  */

    }, {
        key: 'getCurrent',
        value: function getCurrent(value) {
            return min + this.getMaxDist() * value;
        }

        /** get min position on slider container  */

    }, {
        key: 'getMinPosition',
        value: function getMinPosition() {
            return this.refs.$container.offset().left;
        }
    }, {
        key: 'getMaxDist',
        value: function getMaxDist() {
            return this.refs.$container.width();
        }

        /** get dist for position value */

    }, {
        key: 'getDist',
        value: function getDist(current) {
            var _getMinMaxPosition = this.getMinMaxPosition(),
                min = _getMinMaxPosition.min,
                max = _getMinMaxPosition.max;

            var dist;
            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            return dist;
        }

        /** get caculated dist for domain value   */

    }, {
        key: 'getCaculatedDist',
        value: function getCaculatedDist(e) {
            var current = e ? this.getMousePosition(e) : this.getCurrent(this.getDefaultValue() / this.maxValue);
            var dist = this.getDist(current);

            return dist;
        }

        /** get default value used in slider container */

    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {
            return 0;
        }

        /** set mosue position */

    }, {
        key: 'setMousePosition',
        value: function setMousePosition(x) {
            this.refs.$bar.css({ left: x + 'px' });
        }

        /** set mouse position in page */

    }, {
        key: 'getMousePosition',
        value: function getMousePosition(e) {
            return Event.pos(e).pageX;
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.setColorUI();
        }

        /** set drag bar position  */

    }, {
        key: 'setColorUI',
        value: function setColorUI(v) {

            v = v || this.getDefaultValue();

            if (v <= this.minValue) {
                this.refs.$bar.addClass('first').removeClass('last');
            } else if (v >= this.maxValue) {
                this.refs.$bar.addClass('last').removeClass('first');
            } else {
                this.refs.$bar.removeClass('last').removeClass('first');
            }

            this.setMousePosition(this.getMaxDist() * ((v || 0) / this.maxValue));
        }
    }]);
    return BaseSlider;
}(BaseBox);

var Value = function (_BaseSlider) {
    inherits(Value, _BaseSlider);

    function Value() {
        classCallCheck(this, Value);
        return possibleConstructorReturn(this, (Value.__proto__ || Object.getPrototypeOf(Value)).apply(this, arguments));
    }

    createClass(Value, [{
        key: 'initialize',
        value: function initialize() {
            get(Value.prototype.__proto__ || Object.getPrototypeOf(Value.prototype), 'initialize', this).call(this);

            this.minValue = 0;
            this.maxValue = 1;
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n            <div class="value">\n                <div ref="$container" class="value-container">\n                    <div ref="$bar" class="drag-bar"></div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'setBackgroundColor',
        value: function setBackgroundColor() {
            this.refs.$container.css("background-color", this.read('/toRGB'));
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            get(Value.prototype.__proto__ || Object.getPrototypeOf(Value.prototype), 'refresh', this).call(this);
            this.setBackgroundColor();
        }
    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {
            return this.$store.hsv.v;
        }
    }, {
        key: 'refreshColorUI',
        value: function refreshColorUI(e) {
            var dist = this.getCaculatedDist(e);

            this.setColorUI(dist / 100 * this.maxValue);

            this.changeColor({
                type: 'hsv',
                v: dist / 100 * this.maxValue
            });
        }
    }]);
    return Value;
}(BaseSlider);

var Opacity = function (_BaseSlider) {
    inherits(Opacity, _BaseSlider);

    function Opacity() {
        classCallCheck(this, Opacity);
        return possibleConstructorReturn(this, (Opacity.__proto__ || Object.getPrototypeOf(Opacity)).apply(this, arguments));
    }

    createClass(Opacity, [{
        key: 'initialize',
        value: function initialize() {
            get(Opacity.prototype.__proto__ || Object.getPrototypeOf(Opacity.prototype), 'initialize', this).call(this);

            this.minValue = 0;
            this.maxValue = 1;
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n        <div class="opacity">\n            <div ref="$container" class="opacity-container">\n                <div ref="$colorbar" class="color-bar"></div>\n                <div ref="$bar" class="drag-bar2"></div>\n            </div>\n        </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            get(Opacity.prototype.__proto__ || Object.getPrototypeOf(Opacity.prototype), 'refresh', this).call(this);
            this.setOpacityColorBar();
        }
    }, {
        key: 'setOpacityColorBar',
        value: function setOpacityColorBar() {
            var rgb = Object.assign({}, this.$store.rgb);

            rgb.a = 0;
            var start = Color$1.format(rgb, 'rgb');

            rgb.a = 1;
            var end = Color$1.format(rgb, 'rgb');

            this.refs.$colorbar.css('background', 'linear-gradient(to right, ' + start + ', ' + end + ')');
        }
    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {
            return this.$store.alpha;
        }
    }, {
        key: 'refreshColorUI',
        value: function refreshColorUI(e) {
            var dist = this.getCaculatedDist(e);

            this.setColorUI(dist / 100 * this.maxValue);

            this.changeColor({
                a: Math.floor(dist) / 100 * this.maxValue
            });
        }
    }]);
    return Opacity;
}(BaseSlider);

var ColorView = function (_UIElement) {
    inherits(ColorView, _UIElement);

    function ColorView() {
        classCallCheck(this, ColorView);
        return possibleConstructorReturn(this, (ColorView.__proto__ || Object.getPrototypeOf(ColorView)).apply(this, arguments));
    }

    createClass(ColorView, [{
        key: 'template',
        value: function template() {
            return '<div class="color"></div>';
        }
    }, {
        key: 'setBackgroundColor',
        value: function setBackgroundColor() {
            this.refs.$el.css("background-color", this.read('/toRGB'));
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.setBackgroundColor();
        }
    }, {
        key: '@changeColor',
        value: function changeColor() {
            this.refresh();
        }
    }, {
        key: '@initColor',
        value: function initColor() {
            this.refresh();
        }
    }]);
    return ColorView;
}(UIElement);

var ColorWheel = function (_UIElement) {
    inherits(ColorWheel, _UIElement);

    function ColorWheel() {
        classCallCheck(this, ColorWheel);
        return possibleConstructorReturn(this, (ColorWheel.__proto__ || Object.getPrototypeOf(ColorWheel)).apply(this, arguments));
    }

    createClass(ColorWheel, [{
        key: 'initialize',
        value: function initialize() {
            get(ColorWheel.prototype.__proto__ || Object.getPrototypeOf(ColorWheel.prototype), 'initialize', this).call(this);
            this.width = 214;
            this.height = 214;
            this.thinkness = 0;
            this.half_thinkness = 0;
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n        <div class="wheel">\n            <canvas class="wheel-canvas" ref="$colorwheel" ></canvas>\n            <div class="wheel-canvas" ref="$valuewheel" ></div>\n            <div class="drag-pointer" ref="$drag_pointer"></div>\n        </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh(isEvent) {
            this.setColorUI(isEvent);
        }
    }, {
        key: 'setColorUI',
        value: function setColorUI(isEvent) {
            this.renderCanvas();
            this.renderValue();
            this.setHueColor(null, isEvent);
        }
    }, {
        key: 'renderValue',
        value: function renderValue() {
            var value = 1 - this.$store.hsv.v;
            this.refs.$valuewheel.css('background-color', 'rgba(0, 0, 0, ' + value + ')');
        }
    }, {
        key: 'renderWheel',
        value: function renderWheel(width, height) {

            if (this.width && !width) width = this.width;
            if (this.height && !height) height = this.height;

            var $canvas = new Dom('canvas');
            var context = $canvas.el.getContext('2d');
            $canvas.el.width = width;
            $canvas.el.height = height;
            $canvas.px('width', width);
            $canvas.px('height', height);

            var img = context.getImageData(0, 0, width, height);
            var pixels = img.data;
            var half_width = Math.floor(width / 2);
            var half_height = Math.floor(height / 2);

            var radius = width > height ? half_height : half_width;
            var cx = half_width;
            var cy = half_height;

            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var rx = x - cx + 1,
                        ry = y - cy + 1,
                        d = rx * rx + ry * ry,
                        hue = caculateAngle(rx, ry);

                    var rgb = Color$1.HSVtoRGB(hue, // 0~360 hue 
                    Math.min(Math.sqrt(d) / radius, 1), // 0..1 Saturation 
                    1 //  0..1 Value
                    );

                    var index = (y * width + x) * 4;
                    pixels[index] = rgb.r;
                    pixels[index + 1] = rgb.g;
                    pixels[index + 2] = rgb.b;
                    pixels[index + 3] = 255;
                }
            }

            context.putImageData(img, 0, 0);

            if (this.thinkness > 0) {
                context.globalCompositeOperation = "destination-out"; // destination-out 은 그리는 영역이 지워진다. 
                context.fillStyle = 'black';
                context.beginPath();
                context.arc(cx, cy, radius - this.thinkness, 0, Math.PI * 2);
                context.closePath();
                context.fill();
            }

            return $canvas;
        }
    }, {
        key: 'renderCanvas',
        value: function renderCanvas() {

            // only once rendering 
            if (this.$store.createdWheelCanvas) return;

            var $canvas = this.refs.$colorwheel;
            // console.log($canvas);
            var context = $canvas.el.getContext('2d');

            var _$canvas$size = $canvas.size(),
                _$canvas$size2 = slicedToArray(_$canvas$size, 2),
                width = _$canvas$size2[0],
                height = _$canvas$size2[1];

            if (this.width && !width) width = this.width;
            if (this.height && !height) height = this.height;

            $canvas.el.width = width;
            $canvas.el.height = height;
            $canvas.px('width', width);
            $canvas.px('height', height);

            var $wheelCanvas = this.renderWheel(width, height);

            context.drawImage($wheelCanvas.el, 0, 0);

            this.$store.createdWheelCanvas = true;
        }
    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {
            return this.$store.hsv.h;
        }
    }, {
        key: 'getDefaultSaturation',
        value: function getDefaultSaturation() {
            return this.$store.hsv.s;
        }
    }, {
        key: 'getCurrentXY',
        value: function getCurrentXY(e, angle, radius, centerX, centerY) {
            return e ? e.xy : getXYInCircle(angle, radius, centerX, centerY);
        }
    }, {
        key: 'getRectangle',
        value: function getRectangle() {
            var width = this.state.get('$el.width');
            var height = this.state.get('$el.height');
            var radius = this.state.get('$colorwheel.width') / 2;

            var minX = this.state.get('$el.offsetLeft');
            var centerX = minX + width / 2;

            var minY = this.state.get('$el.offsetTop');
            var centerY = minY + height / 2;

            return { minX: minX, minY: minY, width: width, height: height, radius: radius, centerX: centerX, centerY: centerY };
        }
    }, {
        key: 'setHueColor',
        value: function setHueColor(e, isEvent) {

            if (!this.state.get('$el.width')) return;

            var _getRectangle = this.getRectangle(),
                minX = _getRectangle.minX,
                minY = _getRectangle.minY,
                radius = _getRectangle.radius,
                centerX = _getRectangle.centerX,
                centerY = _getRectangle.centerY;

            var _getCurrentXY = this.getCurrentXY(e, this.getDefaultValue(), this.getDefaultSaturation() * radius, centerX, centerY),
                x = _getCurrentXY.x,
                y = _getCurrentXY.y;

            var rx = x - centerX,
                ry = y - centerY,
                d = rx * rx + ry * ry,
                hue = caculateAngle(rx, ry);

            if (d > radius * radius) {
                var _getCurrentXY2 = this.getCurrentXY(null, hue, radius, centerX, centerY),
                    x = _getCurrentXY2.x,
                    y = _getCurrentXY2.y;
            }

            // saturation 을 
            var saturation = Math.min(Math.sqrt(d) / radius, 1);

            // set drag pointer position 
            this.refs.$drag_pointer.px('left', x - minX);
            this.refs.$drag_pointer.px('top', y - minY);

            if (!isEvent) {
                this.changeColor({
                    type: 'hsv',
                    h: hue,
                    s: saturation
                });
            }
        }
    }, {
        key: 'changeColor',
        value: function changeColor(opt) {
            this.dispatch('/changeColor', opt || {});
        }
    }, {
        key: '@changeColor',
        value: function changeColor() {
            this.refresh(true);
        }
    }, {
        key: '@initColor',
        value: function initColor() {
            this.refresh(true);
        }

        // Event Bindings 

    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.isDown = false;
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            if (this.isDown) {
                this.setHueColor(e);
            }
        }
    }, {
        key: 'pointerstart $drag_pointer',
        value: function pointerstart$drag_pointer(e) {
            e.preventDefault();
            this.isDown = true;
        }
    }, {
        key: 'pointerstart $el',
        value: function pointerstart$el(e) {
            this.isDown = true;
            this.setHueColor(e);
        }
    }]);
    return ColorWheel;
}(UIElement);

var ColorInformation = function (_UIElement) {
    inherits(ColorInformation, _UIElement);

    function ColorInformation() {
        classCallCheck(this, ColorInformation);
        return possibleConstructorReturn(this, (ColorInformation.__proto__ || Object.getPrototypeOf(ColorInformation)).apply(this, arguments));
    }

    createClass(ColorInformation, [{
        key: 'template',
        value: function template() {
            return '\n        <div class="information hex">\n            <div ref="$informationChange" class="information-change">\n                <button ref="$formatChangeButton" type="button" class="format-change-button arrow-button"></button>\n            </div>\n            <div class="information-item hex">\n                <div class="input-field hex">\n                    <input ref="$hexCode" class="input" type="text" />\n                    <div class="title">HEX</div>\n                </div>\n            </div>\n            <div class="information-item rgb">\n                <div class="input-field rgb-r">\n                    <input ref="$rgb_r" class="input" type="number" step="1" min="0" max="255" />\n                    <div class="title">R</div>\n                </div>\n                <div class="input-field rgb-g">\n                    <input ref="$rgb_g" class="input" type="number" step="1" min="0" max="255" />\n                    <div class="title">G</div>\n                </div>\n                <div class="input-field rgb-b">\n                    <input ref="$rgb_b" class="input" type="number" step="1" min="0" max="255" />\n                    <div class="title">B</div>\n                </div>          \n                <div class="input-field rgb-a">\n                    <input ref="$rgb_a" class="input" type="number" step="0.01" min="0" max="1" />\n                    <div class="title">A</div>\n                </div>                                                            \n            </div>\n            <div class="information-item hsl">\n                <div class="input-field hsl-h">\n                    <input ref="$hsl_h" class="input" type="number" step="1" min="0" max="360" />\n                    <div class="title">H</div>\n                </div>\n                <div class="input-field hsl-s">\n                    <input ref="$hsl_s" class="input" type="number" step="1" min="0" max="100" />\n                    <div class="postfix">%</div>\n                    <div class="title">S</div>\n                </div>\n                <div class="input-field hsl-l">\n                    <input ref="$hsl_l" class="input" type="number" step="1" min="0" max="100" />\n                    <div class="postfix">%</div>                        \n                    <div class="title">L</div>\n                </div>\n                <div class="input-field hsl-a">\n                    <input ref="$hsl_a" class="input" type="number" step="0.01" min="0" max="1" />\n                    <div class="title">A</div>\n                </div>\n            </div>\n        </div>\n        ';
        }
    }, {
        key: 'setCurrentFormat',
        value: function setCurrentFormat(format) {
            this.format = format;

            this.initFormat();
        }
    }, {
        key: 'initFormat',
        value: function initFormat() {
            var current_format = this.format || 'hex';

            this.$el.removeClass('hex');
            this.$el.removeClass('rgb');
            this.$el.removeClass('hsl');
            this.$el.addClass(current_format);
        }
    }, {
        key: 'nextFormat',
        value: function nextFormat() {
            var current_format = this.format || 'hex';

            var next_format = 'hex';
            if (current_format == 'hex') {
                next_format = 'rgb';
            } else if (current_format == 'rgb') {
                next_format = 'hsl';
            } else if (current_format == 'hsl') {
                if (this.$store.alpha == 1) {
                    next_format = 'hex';
                } else {
                    next_format = 'rgb';
                }
            }

            this.$el.removeClass(current_format);
            this.$el.addClass(next_format);
            this.format = next_format;

            this.dispatch('/changeFormat', this.format);
        }
    }, {
        key: 'getFormat',
        value: function getFormat() {
            return this.format || 'hex';
        }
    }, {
        key: 'checkNumberKey',
        value: function checkNumberKey(e) {
            return Event.checkNumberKey(e);
        }
    }, {
        key: 'checkNotNumberKey',
        value: function checkNotNumberKey(e) {
            return !Event.checkNumberKey(e);
        }
    }, {
        key: 'changeRgbColor',
        value: function changeRgbColor() {
            this.dispatch('/changeColor', {
                type: 'rgb',
                r: this.refs.$rgb_r.int(),
                g: this.refs.$rgb_g.int(),
                b: this.refs.$rgb_b.int(),
                a: this.refs.$rgb_a.float()
            });
        }
    }, {
        key: 'changeHslColor',
        value: function changeHslColor() {
            this.dispatch('/changeColor', {
                type: 'hsl',
                h: this.refs.$hsl_h.int(),
                s: this.refs.$hsl_s.int(),
                l: this.refs.$hsl_l.int(),
                a: this.refs.$hsl_a.float()
            });
        }
    }, {
        key: '@changeColor',
        value: function changeColor() {
            this.refresh();
        }
    }, {
        key: '@initColor',
        value: function initColor() {
            this.refresh();
        }
    }, {
        key: 'input $rgb_r',
        value: function input$rgb_r(e) {
            this.changeRgbColor();
        }
    }, {
        key: 'input $rgb_g',
        value: function input$rgb_g(e) {
            this.changeRgbColor();
        }
    }, {
        key: 'input $rgb_b',
        value: function input$rgb_b(e) {
            this.changeRgbColor();
        }
    }, {
        key: 'input $rgb_a',
        value: function input$rgb_a(e) {
            this.changeRgbColor();
        }
    }, {
        key: 'input $hsl_h',
        value: function input$hsl_h(e) {
            this.changeHslColor();
        }
    }, {
        key: 'input $hsl_s',
        value: function input$hsl_s(e) {
            this.changeHslColor();
        }
    }, {
        key: 'input $hsl_l',
        value: function input$hsl_l(e) {
            this.changeHslColor();
        }
    }, {
        key: 'input $hsl_a',
        value: function input$hsl_a(e) {
            this.changeHslColor();
        }
    }, {
        key: 'keydown $hexCode',
        value: function keydown$hexCode(e) {
            if (e.which < 65 || e.which > 70) {
                return this.checkNumberKey(e);
            }
        }
    }, {
        key: 'keyup $hexCode',
        value: function keyup$hexCode(e) {
            var code = this.refs.$hexCode.val();

            if (code.charAt(0) == '#' && code.length == 7) {
                this.dispatch('/changeColor', code);
            }
        }
    }, {
        key: 'click $formatChangeButton',
        value: function click$formatChangeButton(e) {
            this.nextFormat();
        }
    }, {
        key: 'setRGBInput',
        value: function setRGBInput() {
            this.refs.$rgb_r.val(this.$store.rgb.r);
            this.refs.$rgb_g.val(this.$store.rgb.g);
            this.refs.$rgb_b.val(this.$store.rgb.b);
            this.refs.$rgb_a.val(this.$store.alpha);
        }
    }, {
        key: 'setHSLInput',
        value: function setHSLInput() {
            this.refs.$hsl_h.val(this.$store.hsl.h);
            this.refs.$hsl_s.val(this.$store.hsl.s);
            this.refs.$hsl_l.val(this.$store.hsl.l);
            this.refs.$hsl_a.val(this.$store.alpha);
        }
    }, {
        key: 'setHexInput',
        value: function setHexInput() {
            this.refs.$hexCode.val(this.read('/toHEX'));
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.setCurrentFormat(this.$store.format);
            this.setRGBInput();
            this.setHSLInput();
            this.setHexInput();
        }
    }]);
    return ColorInformation;
}(UIElement);

var DATA_COLORSETS_INDEX = 'data-colorsets-index';

var ColorSetsChooser = function (_UIElement) {
    inherits(ColorSetsChooser, _UIElement);

    function ColorSetsChooser() {
        classCallCheck(this, ColorSetsChooser);
        return possibleConstructorReturn(this, (ColorSetsChooser.__proto__ || Object.getPrototypeOf(ColorSetsChooser)).apply(this, arguments));
    }

    createClass(ColorSetsChooser, [{
        key: 'template',
        value: function template() {
            return '\n            <div class="color-chooser">\n                <div class="color-chooser-container">\n                    <div class="colorsets-item colorsets-item-header">\n                        <h1 class="title">Color Palettes</h1>\n                        <span ref="$toggleButton" class="items">&times;</span>\n                    </div>\n                    <div ref="$colorsetsList" class="colorsets-list"></div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.load();
        }
    }, {
        key: '@changeCurrentColorSets',
        value: function changeCurrentColorSets() {
            this.refresh();
        }
    }, {
        key: '@toggleColorChooser',
        value: function toggleColorChooser() {
            this.toggle();
        }

        // loadable 

    }, {
        key: 'load $colorsetsList',
        value: function load$colorsetsList() {
            // colorsets 
            var colorSets = this.read('/getColorSetsList');

            return '\n            <div>\n                ' + colorSets.map(function (element, index) {
                return '\n                        <div class="colorsets-item" data-colorsets-index="' + index + '" >\n                            <h1 class="title">' + element.name + '</h1>\n                            <div class="items">\n                                <div>\n                                    ' + element.colors.filter(function (color, i) {
                    return i < 5;
                }).map(function (color) {
                    color = color || 'rgba(255, 255, 255, 1)';
                    return '<div class="color-item" title="' + color + '">\n                                                <div class="color-view" style="background-color: ' + color + '"></div>\n                                            </div>';
                }).join('') + '\n                                </div>\n                            </div>\n                        </div>';
            }).join('') + '\n            </div>\n        ';
        }
    }, {
        key: 'show',
        value: function show() {
            this.$el.addClass('open');
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.$el.removeClass('open');
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            this.$el.toggleClass('open');
        }
    }, {
        key: 'click $toggleButton',
        value: function click$toggleButton(e) {
            this.toggle();
        }
    }, {
        key: 'click $colorsetsList .colorsets-item',
        value: function click$colorsetsListColorsetsItem(e) {
            var $item = e.$delegateTarget;

            if ($item) {

                var index = parseInt($item.attr(DATA_COLORSETS_INDEX));

                this.dispatch('/setCurrentColorSets', index);

                this.hide();
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            get(ColorSetsChooser.prototype.__proto__ || Object.getPrototypeOf(ColorSetsChooser.prototype), 'destroy', this).call(this);

            this.hide();
        }
    }]);
    return ColorSetsChooser;
}(UIElement);

var CurrentColorSets = function (_UIElement) {
    inherits(CurrentColorSets, _UIElement);

    function CurrentColorSets() {
        classCallCheck(this, CurrentColorSets);
        return possibleConstructorReturn(this, (CurrentColorSets.__proto__ || Object.getPrototypeOf(CurrentColorSets)).apply(this, arguments));
    }

    createClass(CurrentColorSets, [{
        key: 'template',
        value: function template() {
            return '\n            <div class="colorsets">\n                <div class="menu" title="Open Color Palettes">\n                    <button ref="$colorSetsChooseButton" type="button" class="color-sets-choose-btn arrow-button"></button>\n                </div>\n                <div ref="$colorSetsColorList" class="color-list"></div>\n            </div>\n        ';
        }
    }, {
        key: 'load $colorSetsColorList',
        value: function load$colorSetsColorList() {
            var currentColorSets = this.read('/getCurrentColorSets');
            var colors = this.read('/getCurrentColors');

            return '\n            <div class="current-color-sets">\n            ' + colors.map(function (color, i) {
                return '<div class="color-item" title="' + color + '" data-index="' + i + '" data-color="' + color + '">\n                    <div class="empty"></div>\n                    <div class="color-view" style="background-color: ' + color + '"></div>\n                </div>';
            }).join('') + '   \n            ' + (currentColorSets.edit ? '<div class="add-color-item">+</div>' : '') + '         \n            </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.load();
        }
    }, {
        key: 'addColor',
        value: function addColor(color) {
            this.dispatch('/addCurrentColor', color);
            this.refresh();
        }
    }, {
        key: '@changeCurrentColorSets',
        value: function changeCurrentColorSets() {
            this.refresh();
        }
    }, {
        key: 'click $colorSetsChooseButton',
        value: function click$colorSetsChooseButton(e) {
            this.emit('toggleColorChooser');
        }
    }, {
        key: 'contextmenu $colorSetsColorList',
        value: function contextmenu$colorSetsColorList(e) {
            e.preventDefault();
            var currentColorSets = this.read('/getCurrentColorSets');

            if (!currentColorSets.edit) {
                return;
            }

            var $target = new Dom(e.target);

            var $item = $target.closest('color-item');

            if ($item) {
                var index = parseInt($item.attr('data-index'));

                this.emit('showContextMenu', e, index);
            } else {
                this.emit('showContextMenu', e);
            }
        }
    }, {
        key: 'click $colorSetsColorList .add-color-item',
        value: function click$colorSetsColorListAddColorItem(e) {
            this.addColor(this.read('/toColor'));
        }
    }, {
        key: 'click $colorSetsColorList .color-item',
        value: function click$colorSetsColorListColorItem(e) {
            this.dispatch('/changeColor', e.$delegateTarget.attr('data-color'));
        }
    }]);
    return CurrentColorSets;
}(UIElement);

var CurrentColorSetsContextMenu = function (_UIElement) {
    inherits(CurrentColorSetsContextMenu, _UIElement);

    function CurrentColorSetsContextMenu() {
        classCallCheck(this, CurrentColorSetsContextMenu);
        return possibleConstructorReturn(this, (CurrentColorSetsContextMenu.__proto__ || Object.getPrototypeOf(CurrentColorSetsContextMenu)).apply(this, arguments));
    }

    createClass(CurrentColorSetsContextMenu, [{
        key: 'template',
        value: function template() {
            return '\n            <ul class="colorsets-contextmenu">\n                <li class="menu-item small-hide" data-type="remove-color">Remove color</li>\n                <li class="menu-item small-hide" data-type="remove-all-to-the-right">Remove all to the right</li>\n                <li class="menu-item" data-type="clear-palette">Clear palette</li>\n            </ul>\n        ';
        }
    }, {
        key: 'show',
        value: function show(e, index) {
            var $event = Event.pos(e);

            this.$el.px('top', $event.clientY - 10);
            this.$el.px('left', $event.clientX);
            this.$el.addClass('show');
            this.selectedColorIndex = index;

            if (typeof this.selectedColorIndex == 'undefined') {
                this.$el.addClass('small');
            } else {
                this.$el.removeClass('small');
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.$el.removeClass('show');
        }
    }, {
        key: 'runCommand',
        value: function runCommand(command) {
            switch (command) {
                case 'remove-color':
                    this.dispatch('/removeCurrentColor', this.selectedColorIndex);
                    break;
                case 'remove-all-to-the-right':
                    this.dispatch('/removeCurrentColorToTheRight', this.selectedColorIndex);
                    break;
                case 'clear-palette':
                    this.dispatch('/clearPalette');
                    break;
            }
        }
    }, {
        key: '@showContextMenu',
        value: function showContextMenu(e, index) {
            this.show(e, index);
        }
    }, {
        key: 'click $el .menu-item',
        value: function click$elMenuItem(e) {
            e.preventDefault();

            this.runCommand(e.$delegateTarget.attr('data-type'));
            this.hide();
        }
    }]);
    return CurrentColorSetsContextMenu;
}(UIElement);

var MacOSColorPicker = function (_BaseColorPicker) {
    inherits(MacOSColorPicker, _BaseColorPicker);

    function MacOSColorPicker() {
        classCallCheck(this, MacOSColorPicker);
        return possibleConstructorReturn(this, (MacOSColorPicker.__proto__ || Object.getPrototypeOf(MacOSColorPicker)).apply(this, arguments));
    }

    createClass(MacOSColorPicker, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'colorpicker-body\'>\n                <ColorWheel></ColorWheel>\n                <div class="control">\n                    <Value></Value>\n                    <Opacity></Opacity>\n                    <div class="empty"></div>\n                    <ColorView></ColorView>\n                </div>\n                <Information></Information>\n                <CurrentColorSets></CurrentColorSets>\n                <ColorSetsChooser></ColorSetsChooser>\n                <ContextMenu></ContextMenu>                \n            </div> \n        ';
        }
    }, {
        key: 'components',
        value: function components() {
            return {
                Value: Value, Opacity: Opacity, ColorView: ColorView,
                ColorWheel: ColorWheel,
                Information: ColorInformation,
                CurrentColorSets: CurrentColorSets,
                ColorSetsChooser: ColorSetsChooser,
                ContextMenu: CurrentColorSetsContextMenu
            };
        }
    }]);
    return MacOSColorPicker;
}(BaseColorPicker);

var Hue = function (_BaseSlider) {
    inherits(Hue, _BaseSlider);

    function Hue() {
        classCallCheck(this, Hue);
        return possibleConstructorReturn(this, (Hue.__proto__ || Object.getPrototypeOf(Hue)).apply(this, arguments));
    }

    createClass(Hue, [{
        key: 'initialize',
        value: function initialize() {
            get(Hue.prototype.__proto__ || Object.getPrototypeOf(Hue.prototype), 'initialize', this).call(this);
            this.minValue = 0;
            this.maxValue = 360;
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n            <div class="hue">\n                <div ref="$container" class="hue-container">\n                    <div ref="$bar" class="drag-bar"></div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {
            return this.$store.hsv.h;
        }
    }, {
        key: 'refreshColorUI',
        value: function refreshColorUI(e) {

            var dist = this.getCaculatedDist(e);

            this.setColorUI(dist / 100 * this.maxValue);

            this.changeColor({
                h: dist / 100 * this.maxValue,
                type: 'hsv'
            });
        }
    }]);
    return Hue;
}(BaseSlider);

var ColorPalette = function (_UIElement) {
    inherits(ColorPalette, _UIElement);

    function ColorPalette() {
        classCallCheck(this, ColorPalette);
        return possibleConstructorReturn(this, (ColorPalette.__proto__ || Object.getPrototypeOf(ColorPalette)).apply(this, arguments));
    }

    createClass(ColorPalette, [{
        key: 'template',
        value: function template() {
            return '\n        <div class="color">\n            <div ref="$saturation" class="saturation">\n                <div ref="$value" class="value">\n                    <div ref="$drag_pointer" class="drag-pointer"></div>\n                </div>\n            </div>        \n        </div>        \n        ';
        }
    }, {
        key: 'setBackgroundColor',
        value: function setBackgroundColor(color) {
            this.$el.css("background-color", color);
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.setColorUI();
        }
    }, {
        key: 'caculateSV',
        value: function caculateSV() {
            var pos = this.drag_pointer_pos || { x: 0, y: 0 };

            var width = this.$el.width();
            var height = this.$el.height();

            var s = pos.x / width;
            var v = (height - pos.y) / height;

            this.dispatch('/changeColor', {
                type: 'hsv',
                s: s,
                v: v
            });
        }
    }, {
        key: 'setColorUI',
        value: function setColorUI() {
            var x = this.state.get('$el.width') * this.$store.hsv.s,
                y = this.state.get('$el.height') * (1 - this.$store.hsv.v);

            this.refs.$drag_pointer.px('left', x);
            this.refs.$drag_pointer.px('top', y);

            this.drag_pointer_pos = { x: x, y: y };

            this.setBackgroundColor(this.read('/getHueColor'));
        }
    }, {
        key: 'setMainColor',
        value: function setMainColor(e) {
            // e.preventDefault();
            var pos = this.state.get('$el.offset');
            var w = this.state.get('$el.contentWidth');
            var h = this.state.get('$el.contentHeight');

            var x = Event.pos(e).pageX - pos.left;
            var y = Event.pos(e).pageY - pos.top;

            if (x < 0) x = 0;else if (x > w) x = w;

            if (y < 0) y = 0;else if (y > h) y = h;

            this.refs.$drag_pointer.px('left', x);
            this.refs.$drag_pointer.px('top', y);

            this.drag_pointer_pos = { x: x, y: y };

            this.caculateSV();
        }
    }, {
        key: '@changeColor',
        value: function changeColor() {
            this.refresh();
        }
    }, {
        key: '@initColor',
        value: function initColor() {
            this.refresh();
        }
    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.isDown = false;
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            if (this.isDown) {
                this.setMainColor(e);
            }
        }
    }, {
        key: 'pointerstart',
        value: function pointerstart(e) {
            this.isDown = true;
            this.setMainColor(e);
        }
    }, {
        key: 'pointerend',
        value: function pointerend(e) {
            this.isDown = false;
        }
    }]);
    return ColorPalette;
}(UIElement);

var ChromeDevToolColorPicker = function (_BaseColorPicker) {
    inherits(ChromeDevToolColorPicker, _BaseColorPicker);

    function ChromeDevToolColorPicker() {
        classCallCheck(this, ChromeDevToolColorPicker);
        return possibleConstructorReturn(this, (ChromeDevToolColorPicker.__proto__ || Object.getPrototypeOf(ChromeDevToolColorPicker)).apply(this, arguments));
    }

    createClass(ChromeDevToolColorPicker, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'colorpicker-body\'>\n                <Palette></Palette> \n                <div class="control">\n                    <Hue></Hue>\n                    <Opacity></Opacity>\n                    <div class="empty"></div>\n                    <ColorView></ColorView>\n                </div>\n                <Information></Information>\n                <CurrentColorSets></CurrentColorSets>\n                <ColorSetsChooser></ColorSetsChooser>\n                <ContextMenu></ContextMenu>\n            </div>\n        ';
        }
    }, {
        key: 'components',
        value: function components() {
            return {
                Hue: Hue, Opacity: Opacity, ColorView: ColorView,
                Palette: ColorPalette,
                Information: ColorInformation,
                CurrentColorSets: CurrentColorSets,
                ColorSetsChooser: ColorSetsChooser,
                ContextMenu: CurrentColorSetsContextMenu
            };
        }
    }]);
    return ChromeDevToolColorPicker;
}(BaseColorPicker);

var MiniColorPicker = function (_BaseColorPicker) {
    inherits(MiniColorPicker, _BaseColorPicker);

    function MiniColorPicker() {
        classCallCheck(this, MiniColorPicker);
        return possibleConstructorReturn(this, (MiniColorPicker.__proto__ || Object.getPrototypeOf(MiniColorPicker)).apply(this, arguments));
    }

    createClass(MiniColorPicker, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'colorpicker-body\'>\n                <Palette></Palette>\n                <div class="control">\n                    <Hue></Hue>\n                    <Opacity></Opacity>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'components',
        value: function components() {
            return {
                Hue: Hue, Opacity: Opacity, Palette: ColorPalette
            };
        }
    }]);
    return MiniColorPicker;
}(BaseColorPicker);

var VerticalSlider = function (_BaseSlider) {
    inherits(VerticalSlider, _BaseSlider);

    function VerticalSlider() {
        classCallCheck(this, VerticalSlider);
        return possibleConstructorReturn(this, (VerticalSlider.__proto__ || Object.getPrototypeOf(VerticalSlider)).apply(this, arguments));
    }

    createClass(VerticalSlider, [{
        key: 'getMaxDist',


        /** get max height for vertical slider */
        value: function getMaxDist() {
            return this.refs.$container.height();
        }

        /** set mouse pointer for vertical slider */

    }, {
        key: 'setMousePosition',
        value: function setMousePosition(y) {
            this.refs.$bar.px('top', y);
        }

        /** get mouse position by pageY for vertical slider */

    }, {
        key: 'getMousePosition',
        value: function getMousePosition(e) {
            return Event.pos(e).pageY;
        }

        /** get min position for vertial slider */

    }, {
        key: 'getMinPosition',
        value: function getMinPosition() {
            return this.refs.$container.offset().top;
        }

        /** get caculated dist for domain value   */

    }, {
        key: 'getCaculatedDist',
        value: function getCaculatedDist(e) {
            var current = e ? this.getMousePosition(e) : this.getCurrent(this.getDefaultValue() / this.maxValue);
            var dist = 100 - this.getDist(current);

            return dist;
        }

        /** set drag bar position  */

    }, {
        key: 'setColorUI',
        value: function setColorUI(v) {

            v = v || this.getDefaultValue();

            if (v <= this.minValue) {
                this.refs.$bar.addClass('first').removeClass('last');
            } else if (v >= this.maxValue) {
                this.refs.$bar.addClass('last').removeClass('first');
            } else {
                this.refs.$bar.removeClass('last').removeClass('first');
            }

            var per = 1 - (v || 0) / this.maxValue;

            this.setMousePosition(this.getMaxDist() * per);
        }
    }]);
    return VerticalSlider;
}(BaseSlider);

var VerticalHue = function (_VerticalSlider) {
    inherits(VerticalHue, _VerticalSlider);

    function VerticalHue() {
        classCallCheck(this, VerticalHue);
        return possibleConstructorReturn(this, (VerticalHue.__proto__ || Object.getPrototypeOf(VerticalHue)).apply(this, arguments));
    }

    createClass(VerticalHue, [{
        key: 'initialize',
        value: function initialize() {
            get(VerticalHue.prototype.__proto__ || Object.getPrototypeOf(VerticalHue.prototype), 'initialize', this).call(this);
            this.minValue = 0;
            this.maxValue = 360;
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n            <div class="hue">\n                <div ref="$container" class="hue-container">\n                    <div ref="$bar" class="drag-bar"></div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {
            return this.$store.hsv.h;
        }
    }, {
        key: 'refreshColorUI',
        value: function refreshColorUI(e) {

            var dist = this.getCaculatedDist(e);

            this.setColorUI(dist / 100 * this.maxValue);

            this.changeColor({
                h: dist / 100 * this.maxValue,
                type: 'hsv'
            });
        }
    }]);
    return VerticalHue;
}(VerticalSlider);

var VerticalOpacity = function (_VerticalSlider) {
    inherits(VerticalOpacity, _VerticalSlider);

    function VerticalOpacity() {
        classCallCheck(this, VerticalOpacity);
        return possibleConstructorReturn(this, (VerticalOpacity.__proto__ || Object.getPrototypeOf(VerticalOpacity)).apply(this, arguments));
    }

    createClass(VerticalOpacity, [{
        key: 'template',
        value: function template() {
            return '\n        <div class="opacity">\n            <div ref="$container" class="opacity-container">\n                <div ref="$colorbar" class="color-bar"></div>\n                <div ref="$bar" class="drag-bar2"></div>\n            </div>\n        </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            get(VerticalOpacity.prototype.__proto__ || Object.getPrototypeOf(VerticalOpacity.prototype), 'refresh', this).call(this);
            this.setOpacityColorBar();
        }
    }, {
        key: 'setOpacityColorBar',
        value: function setOpacityColorBar() {
            var rgb = Object.assign({}, this.$store.rgb);

            rgb.a = 0;
            var start = Color$1.format(rgb, 'rgb');

            rgb.a = 1;
            var end = Color$1.format(rgb, 'rgb');

            this.refs.$colorbar.css('background', 'linear-gradient(to top, ' + start + ', ' + end + ')');
        }
    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {
            return this.$store.alpha;
        }
    }, {
        key: 'refreshColorUI',
        value: function refreshColorUI(e) {
            var dist = this.getCaculatedDist(e);

            this.setColorUI(dist / 100 * this.maxValue);

            this.changeColor({
                a: Math.floor(dist) / 100 * this.maxValue
            });
        }
    }]);
    return VerticalOpacity;
}(VerticalSlider);

var MiniColorPicker$2 = function (_BaseColorPicker) {
    inherits(MiniColorPicker, _BaseColorPicker);

    function MiniColorPicker() {
        classCallCheck(this, MiniColorPicker);
        return possibleConstructorReturn(this, (MiniColorPicker.__proto__ || Object.getPrototypeOf(MiniColorPicker)).apply(this, arguments));
    }

    createClass(MiniColorPicker, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'colorpicker-body\'>\n                <Palette></Palette><div class="control"><Hue></Hue><Opacity></Opacity></div>\n            </div>\n        ';
        }
    }, {
        key: 'components',
        value: function components() {
            return {
                Hue: VerticalHue,
                Opacity: VerticalOpacity,
                Palette: ColorPalette
            };
        }
    }]);
    return MiniColorPicker;
}(BaseColorPicker);

var ColorRing = function (_ColorWheel) {
    inherits(ColorRing, _ColorWheel);

    function ColorRing() {
        classCallCheck(this, ColorRing);
        return possibleConstructorReturn(this, (ColorRing.__proto__ || Object.getPrototypeOf(ColorRing)).apply(this, arguments));
    }

    createClass(ColorRing, [{
        key: 'initialize',
        value: function initialize() {
            get(ColorRing.prototype.__proto__ || Object.getPrototypeOf(ColorRing.prototype), 'initialize', this).call(this);

            this.width = 214;
            this.height = 214;
            this.thinkness = 16;
            this.half_thinkness = this.thinkness / 2;
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n        <div class="wheel" data-type="ring">\n            <canvas class="wheel-canvas" ref="$colorwheel" ></canvas>\n            <div class="drag-pointer" ref="$drag_pointer"></div>\n        </div>\n        ';
        }
    }, {
        key: 'setColorUI',
        value: function setColorUI(isEvent) {
            this.renderCanvas();
            this.setHueColor(null, isEvent);
        }
    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {
            return this.$store.hsv.h;
        }
    }, {
        key: 'setHueColor',
        value: function setHueColor(e, isEvent) {

            if (!this.state.get('$el.width')) return;

            var _getRectangle = this.getRectangle(),
                minX = _getRectangle.minX,
                minY = _getRectangle.minY,
                radius = _getRectangle.radius,
                centerX = _getRectangle.centerX,
                centerY = _getRectangle.centerY;

            var _getCurrentXY = this.getCurrentXY(e, this.getDefaultValue(), radius, centerX, centerY),
                x = _getCurrentXY.x,
                y = _getCurrentXY.y;

            var rx = x - centerX,
                ry = y - centerY,
                hue = caculateAngle(rx, ry);

            {
                var _getCurrentXY2 = this.getCurrentXY(null, hue, radius - this.half_thinkness, centerX, centerY),
                    x = _getCurrentXY2.x,
                    y = _getCurrentXY2.y;
            }

            // set drag pointer position 
            this.refs.$drag_pointer.px('left', x - minX);
            this.refs.$drag_pointer.px('top', y - minY);

            if (!isEvent) {
                this.changeColor({
                    type: 'hsv',
                    h: hue
                });
            }
        }
    }]);
    return ColorRing;
}(ColorWheel);

var RingColorPicker = function (_BaseColorPicker) {
    inherits(RingColorPicker, _BaseColorPicker);

    function RingColorPicker() {
        classCallCheck(this, RingColorPicker);
        return possibleConstructorReturn(this, (RingColorPicker.__proto__ || Object.getPrototypeOf(RingColorPicker)).apply(this, arguments));
    }

    createClass(RingColorPicker, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'colorpicker-body\'>\n                <ColorRing></ColorRing>\n                <Palette></Palette> \n                <div class="control">\n                    <Value></Value>\n                    <Opacity></Opacity>\n                    <div class="empty"></div>\n                    <ColorView></ColorView>\n                </div>\n                <Information></Information>\n                <CurrentColorSets></CurrentColorSets>\n                <ColorSetsChooser></ColorSetsChooser>\n                <ContextMenu></ContextMenu>\n            </div>\n        ';
        }
    }, {
        key: 'components',
        value: function components() {
            return {
                Value: Value,
                Opacity: Opacity,
                ColorView: ColorView,
                ColorRing: ColorRing,
                Palette: ColorPalette,
                Information: ColorInformation,
                CurrentColorSets: CurrentColorSets,
                ColorSetsChooser: ColorSetsChooser,
                ContextMenu: CurrentColorSetsContextMenu
            };
        }
    }]);
    return RingColorPicker;
}(BaseColorPicker);

var XDColorPicker = function (_BaseColorPicker) {
    inherits(XDColorPicker, _BaseColorPicker);

    function XDColorPicker() {
        classCallCheck(this, XDColorPicker);
        return possibleConstructorReturn(this, (XDColorPicker.__proto__ || Object.getPrototypeOf(XDColorPicker)).apply(this, arguments));
    }

    createClass(XDColorPicker, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'colorpicker-body\'>\n                <palette></palette> \n                <div class="control">\n                    <Hue></Hue>\n                    <Opacity></Opacity>\n                </div>\n                <information></information>\n                <currentColorSets></currentColorSets>\n                <colorSetsChooser></colorSetsChooser>\n                <contextMenu></contextMenu>\n            </div>\n        ';
        }
    }, {
        key: 'components',
        value: function components() {
            return {
                Hue: VerticalHue,
                Opacity: VerticalOpacity,
                Palette: ColorPalette,
                Information: ColorInformation,
                CurrentColorSets: CurrentColorSets,
                ColorSetsChooser: ColorSetsChooser,
                ContextMenu: CurrentColorSetsContextMenu
            };
        }
    }]);
    return XDColorPicker;
}(BaseColorPicker);

var ColorPicker = {
    create: function create(opts) {
        switch (opts.type) {
            case 'macos':
                return new MacOSColorPicker(opts);
            case 'xd':
                return new XDColorPicker(opts);
            case 'ring':
                return new RingColorPicker(opts);
            case 'mini':
                return new MiniColorPicker(opts);
            case 'mini-vertical':
                return new MiniColorPicker$2(opts);
            case 'sketch':
            case 'palette':
            default:
                return new ChromeDevToolColorPicker(opts);
        }
    },

    ColorPicker: ChromeDevToolColorPicker,
    ChromeDevToolColorPicker: ChromeDevToolColorPicker,
    MacOSColorPicker: MacOSColorPicker,
    RingColorPicker: RingColorPicker,
    MiniColorPicker: MiniColorPicker,
    MiniVerticalColorPicker: MiniColorPicker$2,
    XDColorPicker: XDColorPicker
};

var defaultObject = {
    color: 'rgba(0, 0, 0, 0)',
    percent: 0,
    selected: false
};

var isUndefined$1 = function isUndefined(value) {
    return typeof value == 'undefined' || value == null;
};

var INIT_COLOR_SOURCE = 'colorstep';

var ColorStepManager = function (_BaseModule) {
    inherits(ColorStepManager, _BaseModule);

    function ColorStepManager() {
        classCallCheck(this, ColorStepManager);
        return possibleConstructorReturn(this, (ColorStepManager.__proto__ || Object.getPrototypeOf(ColorStepManager)).apply(this, arguments));
    }

    createClass(ColorStepManager, [{
        key: '*/colorstep/create',
        value: function colorstepCreate($store, obj) {
            if (obj) {
                obj = $store.clone(obj);
            } else {
                obj = $store.clone(defaultObject);
            }

            return obj;
        }
    }, {
        key: '*/colorstep/colorSource',
        value: function colorstepColorSource($store) {
            return INIT_COLOR_SOURCE;
        }
    }, {
        key: '*/colorstep/current',
        value: function colorstepCurrent($store, index) {
            if (!isUndefined$1(index)) {
                return $store.read('/colorstep/list')[index] || $store.read('/colorstep/create');
            } else {
                return $store.read('/colorstep/list').filter(function (item) {
                    return !!item.selected;
                })[0];
            }
        }
    }, {
        key: '*/colorstep/currentIndex',
        value: function colorstepCurrentIndex($store, index) {
            if (isUndefined$1(index)) {
                return $store.read('/colorstep/list').map(function (step, index) {
                    return { step: step, index: index };
                }).filter(function (item) {
                    return !!item.step.selected;
                })[0].index;
            } else {
                return index;
            }
        }

        // 이미지 얻어오기 

    }, {
        key: '*/colorstep/get',
        value: function colorstepGet($store, colorStepOrKey, key) {

            var current = $store.read('/colorstep/current');
            if (arguments.length == 1) {
                return current;
            } else if (arguments.length == 2) {
                if (!isUndefined$1(current[colorStepOrKey])) {
                    return current[colorStepOrKey];
                }
            } else if (arguments.length == 3) {
                if (colorStepOrKey && !isUndefined$1(colorStepOrKey[key])) {
                    return colorStepOrKey[key];
                } else if (!isUndefined$1(current[key])) {
                    return current[key];
                }
            }
        }

        // 이미지 리스트 얻어오기 

    }, {
        key: '*/colorstep/list',
        value: function colorstepList($store, imageIndex) {
            var image = $store.read('/image/current', imageIndex);

            if (image) {
                return image.colorsteps || [];
            }

            return [];
        }
    }, {
        key: '/colorstep/initColor',
        value: function colorstepInitColor($store, color) {
            $store.dispatch('/tool/setColorSource', INIT_COLOR_SOURCE);
            $store.dispatch('/tool/changeColor', color);
        }

        // 이미지 변경하기 

    }, {
        key: '/colorstep/change',
        value: function colorstepChange($store, newColorStep, index) {
            // 현재 image 설정 
            // 현재 layer 설정 
            $store.dispatch('/colorstep/set', newColorStep, index);
        }

        // 이미지 설정하기 , 이벤트 까지 

    }, {
        key: '/colorstep/set',
        value: function colorstepSet($store, newColorStep, index) {
            var current = $store.read('/colorstep/current', index);
            Object.assign(current, newColorStep);

            var colorsteps = $store.read('/colorstep/list');

            $store.dispatch('/image/change', { colorsteps: colorsteps });
        }
    }, {
        key: '/colorstep/select',
        value: function colorstepSelect($store, selectedIndex) {
            var colorsteps = $store.read('/colorstep/list');

            colorsteps.forEach(function (step, index) {
                step.selected = selectedIndex === index;
            });

            $store.dispatch('/colorstep/setAll', colorsteps);
        }
    }, {
        key: '/colorstep/setStep',
        value: function colorstepSetStep($store, color, percent, index) {
            var current = $store.read('/colorstep/current', index);

            if (typeof color != 'undefined') {
                current.color = color;
            }

            if (typeof percent != 'undefined') {
                current.percent = percent;
            }

            var colorsteps = $store.read('/colorstep/list');

            $store.dispatch('/colorstep/setStepAll', colorsteps);
        }
    }, {
        key: '/colorstep/setAll',
        value: function colorstepSetAll($store) {
            var colorsteps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            $store.dispatch('/image/change', { colorsteps: colorsteps });
        }
    }, {
        key: '/colorstep/add',
        value: function colorstepAdd($store, item, percent) {

            var list = $store.read('/item/list/children', item.id);

            if (!list.length) {

                $store.read('/item/create/colorstep', { parentId: item.id, color: 'rgba(0, 0, 0, 0)', percent: percent });
                $store.read('/item/create/colorstep', { parentId: item.id, color: 'rgba(0, 0, 0, 1)', percent: 100 });

                $store.dispatch('/item/set', item);
                return;
            }

            var colorsteps = list.map(function (id) {
                return $store.items[id];
            });

            if (percent < colorsteps[0].percent) {

                $store.read('/item/create/colorstep', { parentId: item.id, color: colorsteps[0].color, percent: percent });
                $store.dispatch('/item/set', item);
                return;
            }

            if (colorsteps[colorsteps.length - 1].percent < percent) {
                var color = colorsteps[colorsteps.length - 1].color;

                $store.read('/item/create/colorstep', { parentId: item.id, color: color, percent: percent });

                $store.dispatch('/item/set', item);
                return;
            }

            for (var i = 0, len = colorsteps.length - 1; i < len; i++) {
                var step = colorsteps[i];
                var nextStep = colorsteps[i + 1];

                if (step.percent <= percent && percent <= nextStep.percent) {
                    var color = Color$1.mix(step.color, nextStep.color, (percent - step.percent) / (nextStep.percent - step.percent), 'rgb');

                    $store.read('/item/create/colorstep', { parentId: item.id, color: color, percent: percent });

                    $store.dispatch('/item/set', item);
                    return;
                }
            }
        }
    }, {
        key: '/colorstep/remove',
        value: function colorstepRemove($store, id) {

            var parentId = $store.read('/item/get', id).parentId;
            var image = $store.read('/item/get', parentId);

            $store.dispatch('/item/remove', id);

            $store.dispatch('/item/set', image);
        }
    }]);
    return ColorStepManager;
}(BaseModule);

var DEFINED_ANGLES = {
    'to top': 0,
    'to top right': 45,
    'to right': 90,
    'to bottom right': 135,
    'to bottom': 180,
    'to bottom left': 225,
    'to left': 270,
    'to top left': 315

};

var DEFINED_DIRECTIONS = {
    '0': 'to top',
    '45': 'to top right',
    '90': 'to right',
    '135': 'to bottom right',
    '180': 'to bottom',
    '225': 'to bottom left',
    '270': 'to left',
    '315': 'to top left'
};

var DEFINED_POSITIONS = {
    'center': true,
    'top': true,
    'left': true,
    'right': true,
    'bottom': true
};

var ImageManager = function (_BaseModule) {
    inherits(ImageManager, _BaseModule);

    function ImageManager() {
        classCallCheck(this, ImageManager);
        return possibleConstructorReturn(this, (ImageManager.__proto__ || Object.getPrototypeOf(ImageManager)).apply(this, arguments));
    }

    createClass(ImageManager, [{
        key: '*/image/get/file',
        value: function imageGetFile($store, files, callback) {
            (files || []).forEach(function (file) {
                var ext = file.name.split('.').pop();
                if (ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'svg') {
                    new ImageLoader(file).getImage(function (image) {
                        image.fileType = ext;
                        callback(image);
                    });
                }
            });
        }
    }, {
        key: '/image/setAngle',
        value: function imageSetAngle($store) {
            var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            angle = typeof DEFINED_ANGLES[angle] != 'undefined' ? DEFINED_ANGLES[angle] : +angle % 360;

            $store.dispatch('/image/change', { angle: angle });
        }
    }, {
        key: '/image/setRadialPosition',
        value: function imageSetRadialPosition($store) {
            var radialPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            var item = $store.read('/item/current/image');

            if (item) {
                item.radialPosition = radialPosition;

                $store.dispatch('/item/set', item);
            }
        }
    }, {
        key: '*/image/type/isGradient',
        value: function imageTypeIsGradient($store, type) {
            return $store.read('/image/type/isLinear', type) || $store.read('/image/type/isRadial', type);
        }
    }, {
        key: '*/image/type/isNotGradient',
        value: function imageTypeIsNotGradient($store, type) {
            return $store.read('/image/type/isGradient', type) == false;
        }
    }, {
        key: '*/image/type/isLinear',
        value: function imageTypeIsLinear($store, type) {
            return ['linear', 'repeating-linear'].includes(type);
        }
    }, {
        key: '*/image/type/isRadial',
        value: function imageTypeIsRadial($store, type) {
            return ['radial', 'repeating-radial'].includes(type);
        }
    }, {
        key: '*/image/type/isImage',
        value: function imageTypeIsImage($store, type) {
            return ['image'].includes(type);
        }
    }, {
        key: '*/image/type/isStatic',
        value: function imageTypeIsStatic($store, type) {
            return ['static'].includes(type);
        }
    }, {
        key: '*/image/angle',
        value: function imageAngle($store) {
            var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            return typeof DEFINED_ANGLES[angle] == 'undefined' ? angle : DEFINED_ANGLES[angle] || 0;
        }
    }, {
        key: '*/image/radialPosition',
        value: function imageRadialPosition($store) {
            var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            return position || $store.read('/image/get', 'radialPosition');
        }
    }, {
        key: '*/image/toCSS',
        value: function imageToCSS($store) {
            var image = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


            var results = {};
            var backgroundImage = $store.read('/image/toImageString', image);
            var backgroundSize = $store.read('/image/toBackgroundSizeString', image);
            var backgroundRepeat = $store.read('/image/toBackgroundRepeatString', image);

            if (backgroundImage) {
                results['background-image'] = backgroundImage; // size, position, origin, attachment and etc 
            }

            if (backgroundSize) {
                results['background-size'] = backgroundSize;
            }

            if (backgroundRepeat) {
                results['background-repeat'] = backgroundRepeat;
            }

            return results;
        }
    }, {
        key: '*/image/toString',
        value: function imageToString($store) {
            var image = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


            var obj = $store.read('/image/toCSS', image);

            return Object.keys(obj).map(function (key) {
                return key + ': ' + obj[key] + ';';
            }).join(' ');
        }
    }, {
        key: '*/image/toImageString',
        value: function imageToImageString($store, image) {
            var type = image.type;

            if (type == 'linear' || type == 'repeating-linear') {
                return $store.read('/image/toLinear', image);
            } else if (type == 'radial' || type == 'repeating-radial') {
                return $store.read('/image/toRadial', image);
            } else if (type == 'image') {
                return $store.read('/image/toImage', image);
            } else if (type == 'static') {
                return $store.read('/image/toStatic', image);
            }
        }
    }, {
        key: '*/image/toBackgroundSizeString',
        value: function imageToBackgroundSizeString($store, image) {

            if (image.backgroundSize == 'contain' || image.backgroundSize == 'cover') {
                return image.backgroundSize;
            } else if (image.backgroundSizeWidth && image.backgroundSizeHeight) {
                return [image.backgroundSizeWidth, image.backgroundSizeHeight].join(' ');
            } else if (image.backgroundSizeWidth) {
                return image.backgroundSizeWidth;
            }

            return 'auto';
        }
    }, {
        key: '*/image/toBackgroundRepeatString',
        value: function imageToBackgroundRepeatString($store, image) {
            if (image.backgroundRepeat) {
                return image.backgroundRepeat;
            }
        }
    }, {
        key: '*/image/toItemString',
        value: function imageToItemString($store) {
            var image = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;


            if (!image) return '';

            var colorsteps = image.colorsteps || $store.read('/item/map/children', image.id, function (step) {
                return step;
            });

            if (!colorsteps) return '';

            var colors = [].concat(toConsumableArray(colorsteps));
            if (!colors.length) return '';

            colors.sort(function (a, b) {
                if (a.percent == b.percent) return 0;
                return a.percent > b.percent ? 1 : -1;
            });

            colors = colors.map(function (f) {
                return f.color + ' ' + f.percent + '%';
            }).join(',');

            return colors;
        }
    }, {
        key: '*/image/toLinear',
        value: function imageToLinear($store) {
            var image = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var colors = $store.read('/image/toItemString', image);

            if (colors == '') return '';

            var opt = '';
            var angle = image.angle;
            var gradientType = image.type;

            opt = angle;

            if (typeof opt === 'number') {
                opt = DEFINED_DIRECTIONS['' + opt] || opt;
            }

            if (typeof opt === 'number') {
                opt = opt > 360 ? opt % 360 : opt;

                opt = opt + 'deg';
            }

            return gradientType + '-gradient(' + opt + ', ' + colors + ')';
        }
    }, {
        key: '*/image/toStatic',
        value: function imageToStatic($store) {
            var image = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return $store.read('/image/toLinear', {
                type: 'linear',
                angle: 0,
                colorsteps: [{ color: image.color, percent: 0 }, { color: image.color, percent: 100 }]
            });
        }
    }, {
        key: '*/image/toLinearRight',
        value: function imageToLinearRight($store, image) {
            return $store.read('/image/toLinear', Object.assign({}, image, { type: 'linear', angle: 'to right' }));
        }
    }, {
        key: '*/image/toRadial',
        value: function imageToRadial($store) {
            var image = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var colors = $store.read('/image/toItemString', image);

            if (colors == '') return '';
            var opt = '';
            var radialType = image.radialType;
            var radialPosition = image.radialPosition;
            var gradientType = image.type;

            radialPosition = DEFINED_POSITIONS[radialPosition] ? radialPosition : radialPosition.join(' ');

            opt = radialPosition ? radialType + ' at ' + radialPosition : radialType;

            return gradientType + '-gradient(' + opt + ', ' + colors + ')';
        }
    }, {
        key: '*/image/toImage',
        value: function imageToImage($store) {
            var image = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var url = image.backgroundImage;

            if (url) {
                return 'url(' + url + ')';
            }

            return null;
        }
    }]);
    return ImageManager;
}(BaseModule);

var filterInfo = {

    'blur': { title: 'Blur', type: 'range', min: 0, max: 100, step: 1, unit: 'px', defaultValue: 0 },
    'grayscale': { title: 'Grayscale', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 100 },
    'hue-rotate': { title: 'Hue', type: 'range', min: 0, max: 360, step: 1, unit: 'deg', defaultValue: 0 },
    'invert': { title: 'Invert', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 0 },
    'brightness': { title: 'Brightness', type: 'range', min: 0, max: 200, step: 1, unit: '%', defaultValue: 100 },
    'contrast': { title: 'Contrast', type: 'range', min: 0, max: 200, step: 1, unit: '%', defaultValue: 100 },
    'drop-shadow': {
        title: 'Drop Shadow',
        type: 'multi',
        items: [{ title: 'Offset X', type: 'range', min: 0, max: 100, step: 1, defaultValue: 0 }, { title: 'Offset Y', type: 'range', min: 0, max: 100, step: 1, defaultValue: 0 }, { title: 'Blur Radius', type: 'range', min: 0, max: 100, step: 1, defaultValue: 0 }, { title: 'Spread Radius', type: 'range', min: 0, max: 100, step: 1, defaultValue: 0 }, { title: 'Color', type: 'color', defaultValue: 'black' }]
    },
    'opacity': { title: 'Opacity', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 100 },
    'saturate': { title: 'Saturate', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 100 },
    'sepia': { title: 'Sepia', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 0 }
};

var LayerManager = function (_BaseModule) {
    inherits(LayerManager, _BaseModule);

    function LayerManager() {
        classCallCheck(this, LayerManager);
        return possibleConstructorReturn(this, (LayerManager.__proto__ || Object.getPrototypeOf(LayerManager)).apply(this, arguments));
    }

    createClass(LayerManager, [{
        key: '*/layer/filter/list',
        value: function layerFilterList($store) {
            return filterInfo;
        }
    }, {
        key: '*/layer/get/filter',
        value: function layerGetFilter($store, id) {
            return filterInfo[id];
        }
    }, {
        key: '*/layer/toString',
        value: function layerToString($store, layer) {
            var withStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var image = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;


            var obj = $store.read('/layer/toCSS', layer, withStyle, image) || {};

            if (image) {
                delete obj['background-color'];
                delete obj['background-blend-mode'];
                delete obj['mix-blend-mode'];
                delete obj['filter'];
            }

            return Object.keys(obj).map(function (key) {
                return key + ': ' + obj[key] + ';';
            }).join(' ');
        }
    }, {
        key: '*/layer/toExport',
        value: function layerToExport($store, layer) {
            var withStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


            var obj = $store.read('/layer/toCSS', layer, withStyle) || {};
            obj.position = obj.position || 'absolute';

            return $store.read('/css/toString', obj);
        }
    }, {
        key: '*/layer/make/filter',
        value: function layerMakeFilter($store, filters) {
            var defaultDataObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return Object.keys(filters).map(function (id) {
                var dataObject = filters[id] || defaultDataObject;

                // 적용하는 필터가 아니면 제외 한다. 
                if (!dataObject.checked) return '';

                var viewObject = $store.read('/layer/get/filter', id);

                var value = dataObject.value;

                if (typeof value == 'undefined') {
                    value = viewObject.defaultValue;
                }

                return id + '(' + value + viewObject.unit + ')';
            }).join(' ');
        }
    }, {
        key: '*/layer/filter/toString',
        value: function layerFilterToString($store, layer) {
            var filterId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
            var onlyFilter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


            if (!layer) return '';
            if (!filterId && !layer.filters) return '';

            var obj = $store.read('/layer/toCSS', layer, true) || { filters: [] };
            var filters = {};

            if (!filterId) {
                filters = layer.filters || {};
            } else {
                filters[filterId] = Object.assign({}, layer.filters[filterId] || {});
                filters[filterId].checked = true;
            }

            if (onlyFilter) {
                delete obj.width;
                delete obj.height;
                delete obj.left;
                delete obj.top;
            }

            obj.filter = $store.read('/layer/make/filter', filters);

            return Object.keys(obj).map(function (key) {
                return key + ': ' + obj[key] + ';';
            }).join(' ');
        }
    }, {
        key: '*/layer/toImageCSS',
        value: function layerToImageCSS($store, layer) {
            var results = {};
            $store.read('/item/each/children', layer.id, function (item) {
                var css = $store.read('/image/toCSS', item);

                Object.keys(css).forEach(function (key) {
                    if (!results[key]) {
                        results[key] = [];
                    }

                    results[key].push(css[key]);
                });
            });

            Object.keys(results).forEach(function (key) {
                if (Array.isArray(results[key])) {
                    results[key] = results[key].join(', ');
                }
            });

            return results;
        }
    }, {
        key: '*/layer/image/toImageCSS',
        value: function layerImageToImageCSS($store, image) {
            var results = {};

            var css = $store.read('/image/toCSS', image);

            Object.keys(css).forEach(function (key) {
                if (!results[key]) {
                    results[key] = [];
                }

                results[key].push(css[key]);
            });

            Object.keys(results).forEach(function (key) {
                if (Array.isArray(results[key])) {
                    results[key] = results[key].join(', ');
                }
            });

            return results;
        }
    }, {
        key: '*/layer/make/transform',
        value: function layerMakeTransform($store, layer) {

            var results = [];

            if (layer.style['rotate']) {
                results.push('rotate(' + layer.style['rotate'] + 'deg)');
            }

            if (layer.style['skewX']) {
                results.push('skewX(' + layer.style['skewX'] + 'deg)');
            }

            if (layer.style['skewY']) {
                results.push('skewY(' + layer.style['skewY'] + 'deg)');
            }

            if (layer.style['scale']) {
                results.push('scale(' + layer.style['scale'] + ')');
            }

            if (layer.style['translateX']) {
                results.push('translateX(' + layer.style['translateX'] + 'px)');
            }

            if (layer.style['translateY']) {
                results.push('translateY(' + layer.style['translateY'] + 'px)');
            }

            if (layer.style['translateZ']) {
                results.push('translateZ(' + layer.style['translateZ'] + 'px)');
            }

            if (layer.style['rotate3dX'] || layer.style['rotate3dY'] || layer.style['rotate3dZ'] || layer.style['rotate3dA']) {
                results.push('rotate3d( ' + (layer.style['rotate3dX'] || 0) + ', ' + (layer.style['rotate3dY'] || 0) + ', ' + (layer.style['rotate3dZ'] || 0) + ', ' + (layer.style['rotate3dA'] || 0) + 'deg  )');
            }

            if (layer.style['scale3dX'] || layer.style['scale3dY'] || layer.style['scale3dZ']) {
                results.push('scale3d( ' + (layer.style['scale3dX'] || 1) + ', ' + (layer.style['scale3dY'] || 1) + ', ' + (layer.style['scale3dZ'] || 1) + ')');
            }

            if (layer.style['translate3dX'] || layer.style['translate3dY'] || layer.style['translate3dZ']) {
                results.push('translate3d( ' + (layer.style['translate3dX'] || 0) + 'px, ' + (layer.style['translate3dY'] || 0) + 'px, ' + (layer.style['translate3dZ'] || 0) + 'px)');
            }

            return results.length ? results.join(' ') : 'none';
        }
    }, {
        key: '*/layer/toCSS',
        value: function layerToCSS($store) {
            var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var withStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var image = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            var css = Object.assign({}, withStyle ? layer.style || {} : {});

            if (withStyle) {
                css.left = css.x;
                css.top = css.y;
            }

            if (layer.style['background-color']) {
                css['background-color'] = layer.style['background-color'];
            }

            if (layer.style['background-blend-mode']) {
                css['background-blend-mode'] = layer.style['background-blend-mode'] || "";
            }

            if (layer.style['mix-blend-mode']) {
                css['mix-blend-mode'] = layer.style['mix-blend-mode'] || "";
            }

            if (layer.fixedRadius) {
                css['border-radius'] = layer.style['border-radius'];
                css['border-top-left-radius'] = '';
                css['border-top-right-radius'] = '';
                css['border-bottom-left-radius'] = '';
                css['border-bottom-right-radius'] = '';
            } else {}

            css['transform'] = $store.read('/layer/make/transform', layer);
            css['filter'] = $store.read('/layer/make/filter', layer.filters);

            var results = Object.assign(css, image ? $store.read('/layer/image/toImageCSS', image) : $store.read('/layer/toImageCSS', layer));
            delete results.x;
            delete results.y;

            var realCSS = {};
            Object.keys(results).filter(function (key) {
                return !!results[key];
            }).forEach(function (key) {
                realCSS[key] = results[key];
            });

            return realCSS;
        }
    }]);
    return LayerManager;
}(BaseModule);

var ToolManager = function (_BaseModule) {
    inherits(ToolManager, _BaseModule);

    function ToolManager() {
        classCallCheck(this, ToolManager);
        return possibleConstructorReturn(this, (ToolManager.__proto__ || Object.getPrototypeOf(ToolManager)).apply(this, arguments));
    }

    createClass(ToolManager, [{
        key: 'initialize',
        value: function initialize() {
            get(ToolManager.prototype.__proto__ || Object.getPrototypeOf(ToolManager.prototype), 'initialize', this).call(this);

            this.$store.tool = {
                color: '',
                colorSource: '',
                'guide.only': false,
                'guide.angle': true,
                'guide.position': true
            };
        }
    }, {
        key: '*/clone',
        value: function clone($store, object) {
            return JSON.parse(JSON.stringify(object));
        }
    }, {
        key: '*/tool/colorSource',
        value: function toolColorSource($store) {
            return $store.tool.colorSource;
        }
    }, {
        key: '*/tool/get',
        value: function toolGet($store, key, defaultValue) {
            return typeof $store.tool[key] == 'undefined' ? defaultValue : $store.tool[key];
        }
    }, {
        key: '/tool/setColorSource',
        value: function toolSetColorSource($store, colorSource) {
            $store.tool.colorSource = colorSource;
        }
    }, {
        key: '/tool/changeColor',
        value: function toolChangeColor($store, color) {
            $store.tool.color = color;

            $store.emit('changeColor');
        }
    }, {
        key: '/tool/set',
        value: function toolSet($store, key, value) {
            $store.tool[key] = value;

            $store.emit('changeTool');
        }
    }, {
        key: '/tool/toggle',
        value: function toolToggle($store, key, isForce) {
            if (typeof isForce == 'undefined') {
                $store.tool[key] = !$store.tool[key];
            } else {
                $store.tool[key] = isForce;
            }

            $store.emit('changeTool');
        }
    }]);
    return ToolManager;
}(BaseModule);

var blend_list = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];

var BlendManager = function (_BaseModule) {
    inherits(BlendManager, _BaseModule);

    function BlendManager() {
        classCallCheck(this, BlendManager);
        return possibleConstructorReturn(this, (BlendManager.__proto__ || Object.getPrototypeOf(BlendManager)).apply(this, arguments));
    }

    createClass(BlendManager, [{
        key: 'initialize',
        value: function initialize() {
            get(BlendManager.prototype.__proto__ || Object.getPrototypeOf(BlendManager.prototype), 'initialize', this).call(this);

            this.$store.blendMode = '';
        }
    }, {
        key: '*/blend/toString',
        value: function blendToString($store, layer) {
            var backgroundBlend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
            var mixBlend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
            var withStyle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;


            layer = $store.read('/clone', layer);

            layer.style['background-blend-mode'] = backgroundBlend;
            layer.style['mix-blend-mode'] = mixBlend;

            return $store.read('/layer/toString', layer, withStyle);
        }
    }, {
        key: '*/blend/toStringWithoutDimension',
        value: function blendToStringWithoutDimension($store, layer) {
            var backgroundBlend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
            var mixBlend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

            return $store.read('/blend/toString', layer, backgroundBlend, mixBlend, false);
        }
    }, {
        key: '*/blend/list',
        value: function blendList($store) {
            return blend_list;
        }
    }]);
    return BlendManager;
}(BaseModule);

var sample1 = {
    type: 'linear',
    angle: 90,
    colorsteps: [{ color: 'red', percent: 0 }, { color: 'blue', percent: 10 }, { color: 'yellow', percent: 40 }, { color: 'green', percent: 60 }, { color: 'magenta', percent: 80 }, { color: 'black', percent: 100 }]
};

var gradegray = {
    type: 'linear',
    angle: 90,
    colorsteps: [{ color: '#bdc3c7', percent: 0 }, { color: '#2c3e50', percent: 100 }]
};

var piggypink = {
    type: 'linear',
    angle: 90,
    colorsteps: [{ color: '#ee9ca7', percent: 0 }, { color: '#ffdde1', percent: 100 }]
};

var coolblues = {
    type: 'linear',
    angle: 90,
    colorsteps: [{ color: '#2193b0', percent: 0 }, { color: '#6dd5ed', percent: 100 }]
};

var megatron = {
    type: 'linear',
    angle: 90,
    colorsteps: [{ color: '#C6FFDD', percent: 0 }, { color: '#FBD786', percent: 50 }, { color: '#f7797d', percent: 100 }]
};

var jshine = {
    type: 'linear',
    angle: 90,
    colorsteps: [{ color: '#12c2e9', percent: 0 }, { color: '#c471ed', percent: 50 }, { color: '#f7797d', percent: 100 }]
};

var darkocean = {
    type: 'linear',
    angle: 90,
    colorsteps: [{ color: '#373B44', percent: 0 }, { color: '#4286f4', percent: 100 }]
};

var yoda = {
    type: 'linear',
    angle: 90,
    colorsteps: [{ color: '#FF0099', percent: 0 }, { color: '#493240', percent: 100 }]
};

var liberty = {
    type: 'linear',
    angle: 90,
    colorsteps: [{ color: '#200122', percent: 0 }, { color: '#6f0000', percent: 100 }]
};

var silence = {
    type: 'linear',
    angle: 340,
    colorsteps: [{ color: '#b721ff', percent: 0 }, { color: '#21d4fd', percent: 100 }]
};

var circle = {
    type: 'radial',
    radialPosition: 'center',
    radialType: 'circle',
    colorsteps: [{ color: 'white', percent: 0 }, { color: 'black', percent: 50 }]
};

var circle2 = {
    type: 'repeating-radial',
    radialPosition: 'top',
    radialType: 'circle',
    colorsteps: [{ color: 'white', percent: 0 }, { color: 'rgb(255,82,2)', percent: 9 }]
};

var deepblue = {
    type: 'linear',
    angle: 'to right',
    colorsteps: [{ color: '#6a11cb', percent: 0 }, { color: '#2575fc', percent: 100 }]
};

var gradientList = [deepblue, sample1, gradegray, piggypink, coolblues, megatron, jshine, darkocean, yoda, liberty, silence, circle, circle2];

var material = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E'];

var types = [{ id: 'material', title: 'Material Colors' }];

var list = {
    material: material
};

var ColorList = {
    list: list,
    types: types
};

var GradientManager = function (_BaseModule) {
    inherits(GradientManager, _BaseModule);

    function GradientManager() {
        classCallCheck(this, GradientManager);
        return possibleConstructorReturn(this, (GradientManager.__proto__ || Object.getPrototypeOf(GradientManager)).apply(this, arguments));
    }

    createClass(GradientManager, [{
        key: '*/gradient/list/sample',
        value: function gradientListSample($store) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';


            var results = [];

            if (type == 'all') {
                results.push.apply(results, toConsumableArray(gradientList.map(function (it) {
                    return Object.assign({}, it);
                })));

                results.push({
                    type: 'static',
                    color: ColorList.list['material'][0]
                });
            } else {
                results.push.apply(results, toConsumableArray(ColorList.list['material'].map(function (color) {
                    return Object.assign({}, { type: 'static', color: color });
                })));
            }

            return results;
        }
    }, {
        key: '/gradient/select',
        value: function gradientSelect($store, type, index) {
            var obj = $store.read('/gradient/list/sample', type)[index];

            if (obj) {
                var image = $store.read('/item/current/image');

                if (image) {

                    $store.run('/item/remove/children', image.id);

                    image = Object.assign({}, image, obj);

                    if (image.colorsteps) {
                        image.colorsteps.forEach(function (step) {
                            step.parentId = image.id;
                            $store.read('/item/create/colorstep', step);
                        });
                        // 기존 데이타를 변경 후에 colorsteps 는 지운다. 
                        delete image.colorsteps;
                    }

                    $store.dispatch('/item/set', image);
                } else {
                    $store.read('/item/current/layer', function (layer) {
                        layer.style['background-color'] = obj.color;
                        $store.dispatch('/item/set', layer);
                    });
                }
            }
        }
    }]);
    return GradientManager;
}(BaseModule);

var INDEX_DIST = 100;
var COPY_INDEX_DIST = 1;
var NONE_INDEX = -99999;

var PAGE_DEFAULT_OBJECT = {
    itemType: 'page',
    name: '',
    parentId: '',
    index: 0,
    style: {
        width: '400px',
        height: '300px'
    }
};

var LAYER_DEFAULT_OBJECT = {
    itemType: 'layer',
    name: '',
    index: 0,
    backgroundColor: '',
    backgroundBlendMode: 'normal',
    parentId: '',
    mixBlendMode: 'normal',
    selected: true,
    visible: true,
    style: {
        x: '0px',
        y: '0px',
        'background-blend-mode': 'multiply',
        'mix-blend-mode': 'multiply'
    },
    filters: {}
};

var IMAGE_DEFAULT_OBJECT = {
    itemType: 'image',
    type: 'static',
    fileType: '', // select file type as imagefile,  png, gif, jpg, svg if type is image 
    index: 0,
    parentId: '',
    angle: 90,
    color: 'red',
    radialType: 'circle',
    radialPosition: 'center',
    visible: true,
    backgroundRepeat: null,
    backgroundSize: null,
    backgroundSizeWidth: 0,
    backgroundSizeHeight: 0,
    backgroundOrigin: null,
    backgroundPosition: null,
    backgroundColor: null,
    backgroundAttachment: null,
    backgroundClip: null
};

var COLORSTEP_DEFAULT_OBJECT = {
    itemType: 'colorstep',
    parentId: '',
    percent: 0,
    color: 'rgba(0, 0, 0, 0)'
};

var EDITOR_MODE_PAGE = 'page';
var EDITOR_MODE_LAYER = 'layer-rect';
var EDITOR_MODE_LAYER_BORDER = 'layer-border';

var EDITOR_MODE_IMAGE_LINEAR = 'image-linear';
var EDITOR_MODE_IMAGE_RADIAL = 'image-radial';
var EDITOR_MODE_IMAGE_STATIC = 'image-static';
var EDITOR_MODE_IMAGE_IMAGE = 'image-image';

var ItemManager = function (_BaseModule) {
    inherits(ItemManager, _BaseModule);

    function ItemManager() {
        classCallCheck(this, ItemManager);
        return possibleConstructorReturn(this, (ItemManager.__proto__ || Object.getPrototypeOf(ItemManager)).apply(this, arguments));
    }

    createClass(ItemManager, [{
        key: "initialize",
        value: function initialize() {
            get(ItemManager.prototype.__proto__ || Object.getPrototypeOf(ItemManager.prototype), "initialize", this).call(this);

            this.$store.items = {};
            this.$store.selectedId = '';
            this.$store.selectedMode = 'board';
        }
    }, {
        key: "afterDispatch",
        value: function afterDispatch() {
            this.$store.emit('changeEditor');
        }
    }, {
        key: '*/item/collect/colorsteps',
        value: function itemCollectColorsteps($store, imageId) {
            return $store.read('/item/map/children', imageId, function (colorstep) {
                var colorstep = $store.read('/clone', $store.items[colorstep.id]);
                delete colorstep.id;
                delete colorstep.parentId;

                return colorstep;
            });
        }
    }, {
        key: '*/item/collect/image/one',
        value: function itemCollectImageOne($store, imageId) {
            var image = $store.read('/clone', $store.items[imageId]);
            delete image.id;
            delete image.parentId;

            return {
                image: image,
                colorsteps: $store.read('/item/collect/colorsteps', imageId)
            };
        }
    }, {
        key: '*/item/collect/images',
        value: function itemCollectImages($store, layerId) {
            return $store.read('/item/map/children', layerId, function (image) {
                return $store.read('/item/collect/image/one', image.id);
            });
        }
    }, {
        key: '*/item/collect/layer/one',
        value: function itemCollectLayerOne($store, layerId) {
            var results = {};

            if (!$store.items[layerId]) {
                return results;
            }

            var layer = $store.read('/clone', $store.items[layerId]);
            delete layer.id;
            delete layer.parentId;

            return {
                layer: layer,
                images: $store.read('/item/collect/images', layerId)
            };
        }
    }, {
        key: '*/item/collect/layers',
        value: function itemCollectLayers($store, pageId) {
            return $store.read('/item/map/children', pageId, function (layer) {
                return $store.read('/item/collect/layer/one', layer.id);
            });
        }
    }, {
        key: '*/item/collect/page',
        value: function itemCollectPage($store, pageId) {
            var results = {};

            if (!$store.items[pageId]) {
                return results;
            }

            var page = $store.read('/clone', $store.items[pageId]);
            delete page.id;
            delete page.parentId;

            return {
                page: page,
                layers: $store.read('/item/collect/layers', pageId)
            };
        }
    }, {
        key: '*/item/create/object',
        value: function itemCreateObject($store, obj) {
            var defaultObj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            obj = Object.assign({}, $store.read('/clone', defaultObj), obj);
            obj.id = Date.now() + '-' + uuid();

            $store.items[obj.id] = obj;

            return obj.id;
        }
    }, {
        key: '*/item/create/page',
        value: function itemCreatePage($store) {
            var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return $store.read('/item/create/object', obj, PAGE_DEFAULT_OBJECT);
        }
    }, {
        key: '*/item/create/layer',
        value: function itemCreateLayer($store) {
            var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return $store.read('/item/create/object', obj, LAYER_DEFAULT_OBJECT);
        }
    }, {
        key: '*/item/create/image',
        value: function itemCreateImage($store) {
            var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            var imageId = $store.read('/item/create/object', obj, IMAGE_DEFAULT_OBJECT);

            if (obj.type == 'static') {} else if (obj.type == 'image') {} else if (obj.type == 'linear') {
                $store.read('/item/create/colorstep', { parentId: imageId, color: 'rgba(0, 0, 0, 0)', percent: 0 });
                $store.read('/item/create/colorstep', { parentId: imageId, color: 'rgba(0, 0, 0, 1)', percent: 100 });
            } else if (obj.type == 'radial') {
                $store.read('/item/create/colorstep', { parentId: imageId, color: 'rgba(0, 0, 0, 0)', percent: 0 });
                $store.read('/item/create/colorstep', { parentId: imageId, color: 'rgba(0, 0, 0, 1)', percent: 100 });
            } else if (obj.type == 'repeating-linear') {
                $store.read('/item/create/colorstep', { parentId: imageId, color: 'rgba(0, 0, 0, 0)', percent: 0 });
                $store.read('/item/create/colorstep', { parentId: imageId, color: 'rgba(0, 0, 0, 1)', percent: 10 });
            } else if (obj.type == 'repeating-radial') {
                $store.read('/item/create/colorstep', { parentId: imageId, color: 'rgba(0, 0, 0, 0)', percent: 0 });
                $store.read('/item/create/colorstep', { parentId: imageId, color: 'rgba(0, 0, 0, 1)', percent: 10 });
            }

            return imageId;
        }
    }, {
        key: '*/item/create/colorstep',
        value: function itemCreateColorstep($store) {
            var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return $store.read('/item/create/object', obj, COLORSTEP_DEFAULT_OBJECT);
        }

        // 객체를 생성하면 id 만 리턴한다. 

    }, {
        key: '*/item/create',
        value: function itemCreate($store, itemType) {
            var obj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return $store.read('/item/create/' + itemType, obj);
        }
    }, {
        key: '*/item/copy',
        value: function itemCopy($store, id) {
            var copyObject = $store.clone('/item/get', id);

            return $store.read('/item/create', copyObject.itemType, copyObject);
        }
    }, {
        key: '*/item/get',
        value: function itemGet($store, id) {
            return $store.items[id] || {};
        }
    }, {
        key: '*/item/current',
        value: function itemCurrent($store) {
            return $store.read('/item/get', $store.selectedId);
        }
    }, {
        key: '*/item/current/page',
        value: function itemCurrentPage($store, callback) {
            var item = $store.read('/item/current');
            var path = $store.read('/item/path', item.id);

            var page = $store.read('/item/get', path[path.length - 1]);

            if (page) {
                if (typeof callback == 'function') callback(page);
                return page;
            }

            return null;
        }
    }, {
        key: '*/item/current/layer',
        value: function itemCurrentLayer($store, callback) {
            var item = $store.read('/item/current');

            if (item.itemType == 'layer') {
                if (typeof callback == 'function') callback(item);
                return item;
            } else if (item.itemType == 'image') {
                var layer = $store.read('/item/get', item.parentId);
                if (typeof callback == 'function') callback(layer);
                return layer;
            }

            return null;
        }
    }, {
        key: '*/item/is',
        value: function itemIs($store, itemType) {
            var item = $store.read('/item/current');

            return item.itemType == itemType;
        }
    }, {
        key: '*/item/is/page',
        value: function itemIsPage($store) {
            return $store.read('/item/is', 'page');
        }
    }, {
        key: '*/item/is/layer',
        value: function itemIsLayer($store) {
            return $store.read('/item/is', 'layer');
        }
    }, {
        key: '*/item/is/image',
        value: function itemIsImage($store) {
            return $store.read('/item/is', 'image');
        }
    }, {
        key: '*/item/is/mode',
        value: function itemIsMode($store, mode, mode2) {
            return $store.selectedMode == mode || $store.selectedMode == mode2;
        }
    }, {
        key: '*/item/current/image',
        value: function itemCurrentImage($store, callback) {
            var item = $store.read('/item/current');

            if (item && item.itemType == 'image') {
                if (typeof callback == 'function') {
                    callback(item);
                }
                return item;
            }

            return null;
        }
    }, {
        key: '*/item/keys',
        value: function itemKeys($store) {
            return Object.keys($store.items);
        }
    }, {
        key: '*/item/list',
        value: function itemList($store, filterCallback) {
            var list = $store.read('/item/keys').filter(filterCallback);

            list.sort(function (a, b) {
                return $store.items[a].index > $store.items[b].index ? 1 : -1;
            });

            return list;
        }
    }, {
        key: '*/item/filter',
        value: function itemFilter($store, filterCallback) {
            return $store.read('/item/list', filterCallback);
        }
    }, {
        key: '*/item/list/page',
        value: function itemListPage($store) {
            return $store.read('/item/filter', function (id) {
                return $store.items[id].itemType == 'page';
            });
        }
    }, {
        key: '*/item/map/page',
        value: function itemMapPage($store, callback) {
            return $store.read('/item/filter', function (id) {
                return $store.items[id].itemType == 'page';
            }).map(function (id, index) {
                return callback($store.items[id], index);
            });
        }
    }, {
        key: '*/item/list/children',
        value: function itemListChildren($store, parentId) {
            return $store.read('/item/filter', function (id) {
                return $store.items[id].parentId == parentId;
            });
        }
    }, {
        key: '*/item/map/children',
        value: function itemMapChildren($store, parentId, callback) {
            return $store.read('/item/filter', function (id) {
                return $store.items[id].parentId == parentId;
            }).map(function (id, index) {
                return callback($store.items[id], index);
            });
        }
    }, {
        key: '*/item/filter/children',
        value: function itemFilterChildren($store, parentId, callback) {
            return $store.read('/item/filter', function (id) {
                return $store.items[id].parentId == parentId;
            }).filter(function (id, index) {
                return callback($store.items[id], index);
            });
        }
    }, {
        key: '*/item/each/children',
        value: function itemEachChildren($store, parentId, callback) {
            return $store.read('/item/filter', function (id) {
                return $store.items[id].parentId == parentId;
            }).forEach(function (id, index) {
                callback($store.items[id], index);
            });
        }
    }, {
        key: '*/item/traverse',
        value: function itemTraverse($store, parentId) {
            var list = $store.read('/item/list/children', parentId);

            list.sort(function (a, b) {
                var $a = $store.items[a];
                var $b = $store.items[b];

                if ($a.order == $b.order) {

                    if (a > b) return 1;
                    if (a < b) return -1;

                    return 0;
                }
                return $a.order > $b.order ? 1 : -1;
            });

            return list.map(function (childId) {
                return { id: childId, children: $store.read('/item/traverse', childId) };
            });
        }
    }, {
        key: '*/item/tree',
        value: function itemTree($store) {
            return $store.read('/item/traverse', '');
        }
    }, {
        key: '*/item/tree/normalize',
        value: function itemTreeNormalize($store) {
            var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
            var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

            var results = [];

            var list = root != null ? $store.read('/item/tree') : children;
            list.forEach(function (item) {
                results.push({ id: item.id, depth: depth });
                results.push.apply(results, toConsumableArray($store.read('/item/tree/normalize', null, item.children, depth + 1)));
            });

            return results;
        }
    }, {
        key: '*/item/path',
        value: function itemPath($store, id) {
            var results = [id];
            var targetId = id;

            do {
                var item = $store.read('/item/get', targetId);

                if (item.parentId == '') {
                    results.push(item.id);
                    break;
                } else {
                    results.push(item.id);
                    targetId = item.parentId;
                }
            } while (targetId);

            return results;
        }
    }, {
        key: '*/item/get/mode',
        value: function itemGetMode($store) {
            return $store.selectedMode;
        }
    }, {
        key: '*/item/get/editMode',
        value: function itemGetEditMode($store) {
            return $store.editMode;
        }
    }, {
        key: '*/item/dom',
        value: function itemDom($store, id) {
            var dom = document.querySelector('[item-layer-id="' + id + '"]');

            if (dom) {
                return new Dom(dom);
            }
        }
    }, {
        key: '/item/remove',
        value: function itemRemove($store, id) {
            if (id) {

                var item = $store.read('/item/get', id);

                if (item.parentId) {
                    var list = $store.read('/item/list/children', item.parentId);
                } else {
                    var list = $store.read('/item/list/page');
                }

                var nextSelectedId = '';
                for (var i = 0, len = list.length; i < len; i++) {
                    var nodeId = list[i];
                    if ($store.items[id].index > item.index) {
                        nextSelectedId = nodeId;
                        break;
                    }
                }

                if (nextSelectedId) {
                    $store.run('/item/select', nextSelectedId);
                } else {
                    if (item.index > 0) {
                        for (var i = 0, len = list.length; i < len; i++) {
                            var nodeId = list[i];
                            if ($store.items[nodeId].index == item.index - INDEX_DIST) {
                                nextSelectedId = nodeId;
                                break;
                            }
                        }

                        if (nextSelectedId) {
                            $store.run('/item/select', nextSelectedId);
                        }
                    } else {
                        $store.run('/item/select', item.parentId);
                    }
                }

                $store.items[id].index = NONE_INDEX;
                $store.read('/item/sort', id);

                delete $store.items[id];
            }
        }
    }, {
        key: '/item/remove/children',
        value: function itemRemoveChildren($store, parentId) {
            $store.read('/item/each/children', parentId, function (item) {
                $store.run('/item/remove', item.id);
            });
        }
    }, {
        key: '/item/select',
        value: function itemSelect($store) {
            var selectedId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            $store.read('/item/keys').forEach(function (id) {

                var item = $store.items[id];

                if (item.itemType == 'colorstep') {
                    // NOOP 
                } else {
                    $store.items[id].selected = id === selectedId;
                }
            });

            if (selectedId) {
                $store.items[selectedId].selectTime = Date.now();

                $store.selectedId = selectedId;

                $store.run('/item/select/mode', $store.items[selectedId].itemType);
            } else {
                $store.selectedId = selectedId;
                $store.run('/item/select/mode', 'board');
            }
        }
    }, {
        key: '/item/select/mode',
        value: function itemSelectMode($store, mode, editMode) {
            $store.selectedMode = mode;

            if (!editMode) {

                switch (mode) {
                    case 'page':
                        editMode = EDITOR_MODE_PAGE;
                        break;
                    case 'layer':
                        editMode = EDITOR_MODE_LAYER;
                        break;
                    case 'image':

                        var item = $store.items[$store.selectedId];

                        switch (item.type) {
                            case 'linear':
                            case 'repeating-linear':
                                editMode = EDITOR_MODE_IMAGE_LINEAR;
                                break;
                            case 'radial':
                            case 'repeating-radial':
                                editMode = EDITOR_MODE_IMAGE_RADIAL;
                                break;
                            case 'static':
                                editMode = EDITOR_MODE_IMAGE_STATIC;
                                break;
                            case 'image':
                                editMode = EDITOR_MODE_IMAGE_IMAGE;
                                break;
                        }
                        break;
                }
            }

            $store.run('/item/select/editMode', editMode);
        }
    }, {
        key: '/item/select/editMode',
        value: function itemSelectEditMode($store, editMode) {
            $store.editMode = editMode;
        }

        // 현재 기준으로 editMode 를 변경 

    }, {
        key: '/item/switch/editMode',
        value: function itemSwitchEditMode($store) {

            switch ($store.editMode) {
                case EDITOR_MODE_LAYER:
                    $store.editMode = EDITOR_MODE_LAYER_BORDER;
                    break;
                case EDITOR_MODE_LAYER_BORDER:
                    $store.editMode = EDITOR_MODE_LAYER;
                    break;
            }
        }
    }, {
        key: '/item/set',
        value: function itemSet($store) {
            var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var isSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var id = obj.id;
            $store.items[id] = Object.assign($store.clone('/item/get', id), obj);

            if (isSelected) $store.run('/item/select', id);
        }
    }, {
        key: '*/item/add/index',
        value: function itemAddIndex($store, id) {
            var dist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : INDEX_DIST;

            return $store.items[id].index + dist;
        }
    }, {
        key: '*/item/next/index',
        value: function itemNextIndex($store, id) {
            return $store.read('/item/add/index', id, INDEX_DIST + COPY_INDEX_DIST);
        }
    }, {
        key: '*/item/prev/index',
        value: function itemPrevIndex($store, id) {
            return $store.read('/item/add/index', id, -1 * (INDEX_DIST + COPY_INDEX_DIST));
        }
    }, {
        key: '/item/add',
        value: function itemAdd($store, itemType) {
            var isSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var parentId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

            var id = $store.read('/item/create', itemType);
            var item = $store.read('/item/get', id);
            item.parentId = parentId;

            if (item.itemType == 'layer') {
                var page = $store.read('/item/get', parentId);

                item.style = Object.assign(item.style, page.style);
            }

            item.index = Number.MAX_SAFE_INTEGER;

            $store.run('/item/set', item, isSelected);
            $store.run('/item/sort', item.id);
        }
    }, {
        key: '/item/add/image',
        value: function itemAddImage($store, imageType) {
            var isSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var parentId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

            var id = $store.read('/item/create/image', { type: imageType });
            var item = $store.read('/item/get', id);
            item.type = imageType;
            item.parentId = parentId;
            item.index = Number.MAX_SAFE_INTEGER;

            $store.run('/item/set', item, isSelected);
            $store.run('/item/sort', id);
        }
    }, {
        key: '/item/add/image/file',
        value: function itemAddImageFile($store, img) {
            var isSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var parentId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

            var id = $store.read('/item/create/image');
            var item = $store.read('/item/get', id);
            item.type = 'image';
            item.parentId = parentId;
            item.index = Number.MAX_SAFE_INTEGER;
            item.fileType = img.fileType;
            item.backgroundImage = img.src;
            item.backgroundSizeWidth = '100%';

            $store.run('/item/set', item, isSelected);
            $store.run('/item/sort', id);
        }
    }, {
        key: '/item/add/page',
        value: function itemAddPage($store) {
            var isSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var pageId = $store.read('/item/create', 'page');
            var layerId = $store.read('/item/create', 'layer');
            var imageId = $store.read('/item/create', 'image');

            // 페이지 생성 
            var page = $store.read('/item/get', pageId);
            page.index = Number.MAX_SAFE_INTEGER;
            $store.run('/item/set', page);

            // 레이어 생성 
            var layer = $store.read('/item/get', layerId);
            layer.parentId = pageId;

            layer.style = Object.assign({}, layer.style, page.style);
            $store.run('/item/set', layer);

            // 이미지 생성 
            var image = $store.read('/item/get', imageId);
            image.parentId = layerId;
            $store.run('/item/set', image, isSelected);
        }
    }, {
        key: '/item/addCopy',
        value: function itemAddCopy($store, sourceId) {
            var newItemId = $store.read('/item/copy', sourceId);
            $store.run('/item/move/to', sourceId, newItemId);
        }
    }, {
        key: '/item/move/to',
        value: function itemMoveTo($store, sourceId, newItemId) {

            var currentItem = $store.read('/item/get', sourceId);

            var newItem = $store.read('/item/get', newItemId);
            newItem.index = currentItem.index + COPY_INDEX_DIST;

            $store.run('/item/set', newItem, true);
            $store.run('/item/sort', newItemId);
        }
    }, {
        key: '/item/addCopy/page',
        value: function itemAddCopyPage($store, sourceId) {
            var page = $store.read('/item/collect/page', sourceId);
            var newPageId = $store.read('/item/create/object', page.page);

            page.layers.forEach(function (layer) {
                var newLayerId = $store.read('/item/create/object', Object.assign({}, layer.layer, { parentId: newPageId }));
                layer.images.forEach(function (image) {
                    var newImageId = $store.read('/item/create/object', Object.assign({}, image.image, { parentId: newLayerId }));

                    image.colorsteps.forEach(function (step) {
                        $store.read('/item/create/object', Object.assign({}, step, { parentId: newImageId }));
                    });
                });
            });

            $store.run('/item/move/to', sourceId, newPageId);
        }
    }, {
        key: '/item/addCopy/layer',
        value: function itemAddCopyLayer($store, sourceId) {
            var currentLayer = $store.read('/item/get', sourceId);
            var layer = $store.read('/item/collect/layer/one', sourceId);
            var newLayerId = $store.read('/item/create/object', Object.assign({ parentId: currentLayer.parentId }, layer.layer));
            layer.images.forEach(function (image) {
                var newImageId = $store.read('/item/create/object', Object.assign({}, image.image, { parentId: newLayerId }));

                image.colorsteps.forEach(function (step) {
                    $store.read('/item/create/object', Object.assign({}, step, { parentId: newImageId }));
                });
            });

            $store.run('/item/move/to', sourceId, newLayerId);
        }
    }, {
        key: '/item/addCopy/image',
        value: function itemAddCopyImage($store, sourceId) {
            var currentImage = $store.read('/item/get', sourceId);
            var image = $store.read('/item/collect/image/one', sourceId);
            var newImageId = $store.read('/item/create/object', Object.assign({ parentId: currentImage.parentId }, image.image));
            image.colorsteps.forEach(function (step) {
                $store.read('/item/create/object', Object.assign({}, step, { parentId: newImageId }));
            });
            $store.run('/item/move/to', sourceId, newImageId);
        }
    }, {
        key: '/item/move/next',
        value: function itemMoveNext($store, id) {
            var item = $store.read('/item/get', id);
            item.index = $store.read('/item/next/index', id);

            $store.run('/item/set', item, item.selected);
            $store.run('/item/sort', id);
        }
    }, {
        key: '/item/move/last',
        value: function itemMoveLast($store, id) {
            var item = $store.read('/item/get', id);
            item.index = Number.MAX_SAFE_INTEGER;

            $store.run('/item/set', item, item.selected);
            $store.run('/item/sort', id);
        }
    }, {
        key: '/item/move/first',
        value: function itemMoveFirst($store, id) {
            var item = $store.read('/item/get', id);
            item.index = -1 * COPY_INDEX_DIST;

            $store.run('/item/set', item, item.selected);
            $store.run('/item/sort', id);
        }
    }, {
        key: '/item/move/in',
        value: function itemMoveIn($store, destId, sourceId) {
            var destItem = $store.read('/item/get', destId);
            var sourceItem = $store.read('/item/get', sourceId);
            sourceItem.index = destItem.index - COPY_INDEX_DIST;

            $store.run('/item/set', sourceItem, true);
            $store.run('/item/sort', sourceId);
        }
    }, {
        key: '/item/move/prev',
        value: function itemMovePrev($store, id) {
            var item = $store.read('/item/get', id);
            item.index = $store.read('/item/prev/index', id);

            $store.run('/item/set', item, item.selected);
            $store.run('/item/sort', id);
        }
    }, {
        key: '/item/sort',
        value: function itemSort($store, id) {
            var item = $store.read('/item/get', id);

            if (item.parentId) {
                var list = $store.read('/item/list/children', item.parentId);
            } else {
                var list = $store.read('/item/list/page');
            }

            // 필요 없는 index 를 가진 객체는 지운다. 
            list = list.filter(function (id) {
                return $store.items[id].index != NONE_INDEX;
            });

            list.sort(function (a, b) {
                return $store.items[a].index > $store.items[b].index ? 1 : -1;
            });

            list.forEach(function (id, index) {
                $store.items[id].index = index * INDEX_DIST;
            });
        }
    }, {
        key: '/item/set/parent',
        value: function itemSetParent($store, id, parentId) {
            $store.items[id] = Object.assign($store.clone('/item/get', id), { parentId: parentId });
        }
    }]);
    return ItemManager;
}(BaseModule);

var list$1 = new Array(1000);
var lastIndex = -1;
var selectedItem = {};

var verticalKeys = ['y', 'centerY', 'y2'];
var verticalAlign = { 'y': 'top', 'centerY': 'middle', 'y2': 'bottom' };
var horizontalKeys = ['x', 'centerX', 'x2'];
var horizontalAlign = { 'x': 'left', 'centerX': 'center', 'x2': 'right' };
var MAX_DIST = 1;

var GuideManager = function (_BaseModule) {
    inherits(GuideManager, _BaseModule);

    function GuideManager() {
        classCallCheck(this, GuideManager);
        return possibleConstructorReturn(this, (GuideManager.__proto__ || Object.getPrototypeOf(GuideManager)).apply(this, arguments));
    }

    createClass(GuideManager, [{
        key: '*/guide/rect',
        value: function guideRect($store, obj) {
            var x = +(obj.x || '0px').replace('px', '');
            var y = +(obj.y || '0px').replace('px', '');
            var width = +(obj.width || '0px').replace('px', '');
            var height = +(obj.height || '0px').replace('px', '');

            var x2 = x + width;
            var y2 = y + height;

            var centerX = x + Math.floor(width / 2);
            var centerY = y + Math.floor(height / 2);

            return { x: x, y: y, x2: x2, y2: y2, width: width, height: height, centerX: centerX, centerY: centerY };
        }
    }, {
        key: '*/guide/snap/layer',
        value: function guideSnapLayer($store, layer) {
            var dist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAX_DIST;

            var list = $store.read('/guide/line/layer', dist);
            var x, y;
            if (list.length) {

                var height = +(layer.style.height || '0px').replace('px', '');
                var width = +(layer.style.width || '0px').replace('px', '');
                var topY = Math.min.apply(Math, toConsumableArray(list.filter(function (it) {
                    return it.align == 'top';
                }).map(function (it) {
                    return it.y;
                })));
                var middleY = Math.min.apply(Math, toConsumableArray(list.filter(function (it) {
                    return it.align == 'middle';
                }).map(function (it) {
                    return it.y;
                })));
                var bottomY = Math.min.apply(Math, toConsumableArray(list.filter(function (it) {
                    return it.align == 'bottom';
                }).map(function (it) {
                    return it.y;
                })));
                var leftX = Math.min.apply(Math, toConsumableArray(list.filter(function (it) {
                    return it.align == 'left';
                }).map(function (it) {
                    return it.x;
                })));
                var centerX = Math.min.apply(Math, toConsumableArray(list.filter(function (it) {
                    return it.align == 'center';
                }).map(function (it) {
                    return it.x;
                })));
                var rightX = Math.min.apply(Math, toConsumableArray(list.filter(function (it) {
                    return it.align == 'right';
                }).map(function (it) {
                    return it.x;
                })));

                if (topY != Infinity) {
                    y = topY;
                } else if (bottomY != Infinity) {
                    y = bottomY - height;
                } else if (middleY != Infinity) {
                    y = Math.floor(middleY - height / 2);
                }

                if (leftX != Infinity) {
                    x = leftX;
                } else if (rightX != Infinity) {
                    x = rightX - width;
                } else if (centerX != Infinity) {
                    x = Math.floor(centerX - width / 2);
                }

                return [x, y];
            }

            return [];
        }
    }, {
        key: '*/guide/line/layer',
        value: function guideLineLayer($store) {
            var dist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_DIST;


            var page = $store.read('/item/current/page');

            if (!page) return [];
            if (!page.style) return [];

            if (page.selected) return [];

            var index = 0;
            list$1[index++] = $store.read('/guide/rect', {
                x: 0,
                y: 0,
                width: page.style.width,
                height: page.style.height
            });

            $store.read('/item/each/children', page.id, function (item) {
                var newItem = $store.read('/guide/rect', {
                    x: item.style.x,
                    y: item.style.y,
                    width: item.style.width,
                    height: item.style.height
                });

                if (item.selected) {
                    selectedItem = newItem;
                } else {
                    list$1[index++] = newItem;
                }
            });

            lastIndex = index;

            return $store.read('/guide/paths', dist);
        }
    }, {
        key: '*/guide/paths',
        value: function guidePaths($store) {
            var dist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_DIST;


            var results = [];
            for (var i = 0; i < lastIndex; i++) {
                results.push.apply(results, toConsumableArray($store.read('/guide/check', list$1[i], selectedItem, dist)));
            }

            return results;
        }
    }, {
        key: '*/guide/check',
        value: function guideCheck($store, item1, item2) {
            var dist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : MAX_DIST;

            var results = [];

            // 가로 먼저 체크 

            results.push.apply(results, toConsumableArray($store.read('/guide/check/vertical', item1, item2, dist)));

            // 세로 체크 
            results.push.apply(results, toConsumableArray($store.read('/guide/check/horizontal', item1, item2, dist)));

            return results;
        }
    }, {
        key: '*/guide/check/vertical',
        value: function guideCheckVertical($store, item1, item2) {
            var dist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : MAX_DIST;

            var results = [];

            verticalKeys.forEach(function (key) {

                // top
                if (Math.abs(item1.y - item2[key]) < dist) {
                    results.push({ type: '-',
                        align: verticalAlign[key],
                        x: Math.min(item1.centerX, item2.centerX),
                        y: item1.y,
                        width: Math.max(item1.centerX, item2.centerX) - Math.min(item1.centerX, item2.centerX)
                    });
                }

                // middle
                if (Math.abs(item1.centerY - item2[key]) < dist) {
                    results.push({ type: '-',
                        align: verticalAlign[key],
                        x: Math.min(item1.centerX, item2.centerX),
                        y: item1.centerY,
                        width: Math.max(item1.centerX, item2.centerX) - Math.min(item1.centerX, item2.centerX)
                    });
                }

                // bottom
                if (Math.abs(item1.y2 - item2[key]) < dist) {
                    results.push({ type: '-',
                        align: verticalAlign[key],
                        x: Math.min(item1.centerX, item2.centerX),
                        y: item1.y2,
                        width: Math.max(item1.centerX, item2.centerX) - Math.min(item1.centerX, item2.centerX)
                    });
                }
            });

            return results;
        }
    }, {
        key: '*/guide/check/horizontal',
        value: function guideCheckHorizontal($store, item1, item2) {
            var dist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : MAX_DIST;

            var results = [];

            horizontalKeys.forEach(function (key) {

                // left 
                if (Math.abs(item1.x - item2[key]) < dist) {
                    results.push({ type: '|',
                        align: horizontalAlign[key],
                        x: item1.x,
                        y: Math.min(item1.centerY, item2.centerY),
                        height: Math.max(item1.centerY, item2.centerY) - Math.min(item1.centerY, item2.centerY)
                    });
                }

                // center
                if (Math.abs(item1.centerX - item2[key]) < dist) {
                    results.push({ type: '|',
                        align: horizontalAlign[key],
                        x: item1.centerX,
                        y: Math.min(item1.centerY, item2.centerY),
                        height: Math.max(item1.centerY, item2.centerY) - Math.min(item1.centerY, item2.centerY)
                    });
                }

                // right
                if (Math.abs(item1.x2 - item2[key]) < dist) {
                    results.push({ type: '|',
                        align: horizontalAlign[key],
                        x: item1.x2,
                        y: Math.min(item1.centerY, item2.centerY),
                        height: Math.max(item1.centerY, item2.centerY) - Math.min(item1.centerY, item2.centerY)
                    });
                }
            });

            return results;
        }
    }]);
    return GuideManager;
}(BaseModule);

var SAVE_ID = 'css-imageeditor';
var CACHED_LAYER_SAVE_ID = 'css-imageeditor-cached-layers';
var CACHED_IMAGE_SAVE_ID = 'css-imageeditor-cached-images';

var StorageManager = function (_BaseModule) {
    inherits(StorageManager, _BaseModule);

    function StorageManager() {
        classCallCheck(this, StorageManager);
        return possibleConstructorReturn(this, (StorageManager.__proto__ || Object.getPrototypeOf(StorageManager)).apply(this, arguments));
    }

    createClass(StorageManager, [{
        key: 'initialize',
        value: function initialize() {
            get(StorageManager.prototype.__proto__ || Object.getPrototypeOf(StorageManager.prototype), 'initialize', this).call(this);

            this.$store.cachedLayers = [];
            this.$store.cachedImages = [];
        }
    }, {
        key: 'afterDispatch',
        value: function afterDispatch() {
            this.$store.emit('changeEditor');
        }
    }, {
        key: '*/storage/layers',
        value: function storageLayers($store) {
            return $store.cachedLayers;
        }
    }, {
        key: '/storage/unshift/layer',
        value: function storageUnshiftLayer($store, layer) {
            var item = $store.read('/clone', layer);
            $store.cachedLayers.unshift(item);

            $store.run('/storage/save/layer');
        }
    }, {
        key: '/storage/add/layer',
        value: function storageAddLayer($store, layer) {
            var item = $store.read('/clone', layer);
            $store.cachedLayers.add(item);

            $store.run('/storage/save/layer');
        }
    }, {
        key: '/storage/add/image',
        value: function storageAddImage($store, image) {
            var item = $store.read('/clone', image);
            $store.cachedImages.add(item);

            $store.run('/storage/save/image');
        }
    }, {
        key: '/storage/add/current/layer',
        value: function storageAddCurrentLayer($store) {
            $store.read('/item/current/layer', function (layer) {
                $store.dispatch('/storage/add/layer', [$store.read('/clone', layer)].concat(toConsumableArray($store.read('/item/map/children', layer.id, function (item) {
                    return $store.read('/clone', item);
                }))));
            });
        }
    }, {
        key: '/storage/add/current/image',
        value: function storageAddCurrentImage($store) {
            $store.read('/item/current/image', function (image) {
                $store.dispatch('/storage/add/image', image);
            });
        }
    }, {
        key: '/storage/save',
        value: function storageSave($store) {
            localStorage.setItem(SAVE_ID, JSON.stringify({
                items: $store.items,
                selectedId: $store.selectedId,
                selectedMode: $store.selectedMode
            }));
        }
    }, {
        key: '/storage/save/layer',
        value: function storageSaveLayer($store) {
            localStorage.setItem(CACHED_LAYER_SAVE_ID, JSON.stringify($store.cachedLayers));
        }
    }, {
        key: '/storage/save/image',
        value: function storageSaveImage($store) {
            localStorage.setItem(CACHED_IMAGE_SAVE_ID, JSON.stringify($store.cachedImages));
        }
    }, {
        key: '/storage/load/layer',
        value: function storageLoadLayer($store) {
            $store.cachedLayers = JSON.parse(localStorage.getItem(CACHED_LAYER_SAVE_ID) || "[]");
        }
    }, {
        key: '/storage/load/image',
        value: function storageLoadImage($store) {
            $store.cachedImages = JSON.parse(localStorage.getItem(CACHED_IMAGE_SAVE_ID) || "[]");
        }
    }, {
        key: '/storage/load',
        value: function storageLoad($store, callback) {
            var obj = JSON.parse(localStorage.getItem(SAVE_ID) || "{}");

            if (obj.items) $store.items = obj.items;
            if (obj.selectedId) $store.selectedId = obj.selectedId;
            if (obj.selectedMode) $store.selectedMode = obj.selectedMode;

            if (typeof callback == 'function') {
                callback(!!obj.items);
            }
        }
    }]);
    return StorageManager;
}(BaseModule);

var ordering = {
    'position': 1,
    'left': 2,
    'top': 2,
    'right': 2,
    'bottom': 2,
    'width': 3,
    'height': 3,

    'background-image': 100,
    'background-size': 100,
    'background-position': 100

};

var MAX_ORDER = Number.MAX_SAFE_INTEGER;

var CssManager = function (_BaseModule) {
    inherits(CssManager, _BaseModule);

    function CssManager() {
        classCallCheck(this, CssManager);
        return possibleConstructorReturn(this, (CssManager.__proto__ || Object.getPrototypeOf(CssManager)).apply(this, arguments));
    }

    createClass(CssManager, [{
        key: '*/css/filtering',
        value: function cssFiltering($store, style) {
            var newStyle = Object.assign({}, style);

            // delete unused css property 
            delete newStyle.x;
            delete newStyle.y;
            delete newStyle.rotate3dX;
            delete newStyle.rotate3dY;
            delete newStyle.rotate3dZ;
            delete newStyle.rotate3dA;
            delete newStyle.scale3dX;
            delete newStyle.scale3dY;
            delete newStyle.scale3dZ;
            delete newStyle.translate3dX;
            delete newStyle.translate3dY;
            delete newStyle.translate3dZ;

            if (newStyle['background-blend-mode'] == 'normal') {
                delete newStyle['background-blend-mode'];
            }

            if (newStyle['mix-blend-mode'] == 'normal') {
                delete newStyle['mix-blend-mode'];
            }

            if (parseParamNumber$2(newStyle['left']) == 0) {
                delete newStyle['left'];
            }

            if (parseParamNumber$2(newStyle['top']) == 0) {
                delete newStyle['top'];
            }

            if (newStyle['transform'] == 'none') {
                delete newStyle['transform'];
            }

            return newStyle;
        }
    }, {
        key: '*/css/sorting',
        value: function cssSorting($store, style) {

            style = $store.read('/css/filtering', style);

            var keys = Object.keys(style);

            keys.sort(function (a, b) {
                var aN = ordering[a] || MAX_ORDER;
                var bN = ordering[b] || MAX_ORDER;

                if (aN == bN) return 0;

                return aN < bN ? -1 : 1;
            });

            var newStyle = {};
            keys.forEach(function (key) {
                newStyle[key] = style[key];
            });

            return newStyle;
        }
    }, {
        key: '*/css/toString',
        value: function cssToString($store, style) {
            var newStyle = $store.read('/css/sorting', style);

            return Object.keys(newStyle).map(function (key) {
                return key + ": " + newStyle[key];
            }).join(';');
        }
    }]);
    return CssManager;
}(BaseModule);

var ModuleList = [CssManager, StorageManager, ItemManager, ColorStepManager, ImageManager, LayerManager, ToolManager, BlendManager, GradientManager, GuideManager];

var BaseImageEditor = function (_UIElement) {
    inherits(BaseImageEditor, _UIElement);

    function BaseImageEditor() {
        classCallCheck(this, BaseImageEditor);
        return possibleConstructorReturn(this, (BaseImageEditor.__proto__ || Object.getPrototypeOf(BaseImageEditor)).apply(this, arguments));
    }

    createClass(BaseImageEditor, [{
        key: 'initialize',
        value: function initialize() {
            var modules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            this.$body = null;
            this.$root = null;

            this.$store = new BaseStore({
                modules: [].concat(toConsumableArray(ModuleList), toConsumableArray(modules))
            });

            this.$body = new Dom(this.getContainer());
            this.$root = new Dom('div', 'imageeditor');

            this.$body.append(this.$root);

            if (this.opt.type) {
                // to change css style
                this.$root.addClass(this.opt.type);
            }

            this.render(this.$root);

            // 이벤트 연결 
            this.initializeEvent();
        }
    }, {
        key: 'getContainer',
        value: function getContainer() {
            return this.opt.container || document.body;
        }
    }]);
    return BaseImageEditor;
}(UIElement);

var PageList = function (_UIElement) {
    inherits(PageList, _UIElement);

    function PageList() {
        classCallCheck(this, PageList);
        return possibleConstructorReturn(this, (PageList.__proto__ || Object.getPrototypeOf(PageList)).apply(this, arguments));
    }

    createClass(PageList, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'pages\'>         \n                <div class="page-list" ref="$pageList">\n                \n                </div>\n                <div class=\'project-tools\'>\n                    <button type="button" ref="$saveButton">Save</button>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'makeItemNode',
        value: function makeItemNode(node, index) {
            var item = this.read('/item/get', node.id);

            var page = this.read('/item/current/page');

            var selectedId = '';

            if (page) selectedId = page.id;

            if (item.itemType == 'page') {
                return this.makeItemNodePage(item, index, selectedId);
            }
        }
    }, {
        key: 'makeItemNodePage',
        value: function makeItemNodePage(item, index, selectedId) {
            var selected = item.id == selectedId ? 'selected' : '';
            return '\n            <div class=\'tree-item ' + selected + '\' id="' + item.id + '" type=\'page\'>\n                <div class="item-title">\n                    ' + (item.name || 'Project ' + index) + '\n                </div>   \n            </div>\n            ';
        }
    }, {
        key: 'load $pageList',
        value: function load$pageList() {
            var _this2 = this;

            var str = this.read('/item/map/page', function (item, index) {
                return _this2.makeItemNode(item, index);
            }).join('');

            str += '<button type="button" class=\'add-page\'>+ Project</button>';

            return str;
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.load();
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'click $pageList .add-page',
        value: function click$pageListAddPage(e) {
            this.dispatch('/item/add/page', true);
            this.refresh();
        }
    }, {
        key: 'click.self $pageList .tree-item',
        value: function clickSelf$pageListTreeItem(e) {

            this.dispatch('/item/select', e.$delegateTarget.attr('id'));
            this.refresh();

            if (e.$delegateTarget.attr('type') == 'page') {
                this.emit('selectPage');
            }
        }
    }, {
        key: 'click $saveButton',
        value: function click$saveButton(e) {
            this.run('/storage/save');
        }
    }]);
    return PageList;
}(UIElement);

var BaseTab = function (_UIElement) {
    inherits(BaseTab, _UIElement);

    function BaseTab() {
        classCallCheck(this, BaseTab);
        return possibleConstructorReturn(this, (BaseTab.__proto__ || Object.getPrototypeOf(BaseTab)).apply(this, arguments));
    }

    createClass(BaseTab, [{
        key: 'template',
        value: function template() {
            return '\n        <div class="tab">\n            <div class="tab-header" ref="$header">\n                <div class="tab-item selected" data-id="1">1</div>\n                <div class="tab-item" data-id="2">2</div>\n            </div>\n            <div class="tab-body" ref="$body">\n                <div class="tab-content selected" data-id="1"></div>\n                <div class="tab-content" data-id="2"></div>\n            </div>\n        </div>\n        ';
        }
    }, {
        key: 'isNotSelectedTab',
        value: function isNotSelectedTab(e) {
            return !e.$delegateTarget.hasClass('selected');
        }
    }, {
        key: 'click.isNotSelectedTab $header .tab-item',
        value: function clickIsNotSelectedTab$headerTabItem(e) {
            this.selectTab(e.$delegateTarget.attr('data-id'));
        }
    }, {
        key: 'selectTab',
        value: function selectTab(id) {

            this.refs.$header.children().forEach(function ($dom) {
                $dom.toggleClass('selected', $dom.attr('data-id') == id);
            });

            this.refs.$body.children().forEach(function ($dom) {
                $dom.toggleClass('selected', $dom.attr('data-id') == id);
            });
        }
    }]);
    return BaseTab;
}(UIElement);

var BasePropertyItem = function (_UIElement) {
    inherits(BasePropertyItem, _UIElement);

    function BasePropertyItem() {
        classCallCheck(this, BasePropertyItem);
        return possibleConstructorReturn(this, (BasePropertyItem.__proto__ || Object.getPrototypeOf(BasePropertyItem)).apply(this, arguments));
    }

    createClass(BasePropertyItem, [{
        key: 'click $title',
        value: function click$title(e) {
            var $dom = new Dom(e.target);

            if ($dom.hasClass('title')) {
                this.$el.toggleClass('show');
            }
        }
    }]);
    return BasePropertyItem;
}(UIElement);

var Size = function (_BasePropertyItem) {
    inherits(Size, _BasePropertyItem);

    function Size() {
        classCallCheck(this, Size);
        return possibleConstructorReturn(this, (Size.__proto__ || Object.getPrototypeOf(Size)).apply(this, arguments));
    }

    createClass(Size, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-item size show'>\n                <div class='title' ref=\"$title\">Dimesion</div>\n                <div class='items'>\n                    <div>\n                        <label>fixed</label>\n                        <div>\n                            <button type=\"button\" ref=\"$rect\">like width</button>\n                        </div>\n                    </div>                   \n                    <div>\n                        <label>Width</label>\n                        <div>\n                            <input type='number' ref=\"$width\"> <span>px</span>\n                        </div>\n                        <label>Height</label>\n                        <div>\n                            <input type='number' ref=\"$height\"> <span>px</span>\n                        </div>\n                    </div>   \n                    <div>\n                        <label>X</label>\n                        <div>\n                            <input type='number' ref=\"$x\"> <span>px</span>\n                        </div>\n                        <label>Y</label>\n                        <div>\n                            <input type='number' ref=\"$y\"> <span>px</span>\n                        </div>\n                    </div>                                 \n                                 \n                </div>\n            </div>\n        ";
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: "refresh",
        value: function refresh() {
            var item = this.read('/item/current');

            if (item.itemType == 'image') return;
            if (!item.style) return;
            if (item.style.width) {
                this.refs.$width.val(parseParamNumber$1(item.style.width));
            }

            if (item.style.height) {
                this.refs.$height.val(parseParamNumber$1(item.style.height));
            }

            if (item.style.x) {
                this.refs.$x.val(parseParamNumber$1(item.style.x));
            }

            if (item.style.y) {
                this.refs.$y.val(parseParamNumber$1(item.style.y));
            }
        }
    }, {
        key: 'click $rect',
        value: function click$rect(e) {
            var item = this.read('/item/current');

            if (item.itemType == 'image') return;

            item.style.width = this.refs.$width.int() + 'px';
            item.style.height = item.style.width;
            this.dispatch('/item/set', item);
        }
    }, {
        key: 'input $width',
        value: function input$width() {
            var _this2 = this;

            this.read('/item/current/layer', function (item) {
                item.style.width = _this2.refs.$width.int() + 'px';
                _this2.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'input $height',
        value: function input$height() {
            var _this3 = this;

            this.read('/item/current/layer', function (item) {
                item.style.height = _this3.refs.$height.int() + 'px';
                _this3.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'input $x',
        value: function input$x() {
            var _this4 = this;

            this.read('/item/current/layer', function (item) {
                item.style.x = _this4.refs.$x.int() + 'px';
                _this4.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'input $y',
        value: function input$y() {
            var _this5 = this;

            this.read('/item/current/layer', function (item) {
                item.style.y = _this5.refs.$y.int() + 'px';
                _this5.dispatch('/item/set', item);
            });
        }
    }]);
    return Size;
}(BasePropertyItem);

var Position = function (_BasePropertyItem) {
    inherits(Position, _BasePropertyItem);

    function Position() {
        classCallCheck(this, Position);
        return possibleConstructorReturn(this, (Position.__proto__ || Object.getPrototypeOf(Position)).apply(this, arguments));
    }

    createClass(Position, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item position show\'>\n                <div class=\'title\' ref="$title">Position</div>\n                <div class=\'items\'>            \n                    <div>\n                        <label>X</label>\n                        <div>\n                            <input type=\'number\' ref="$x"> <span>px</span>\n                        </div>\n                        <label>Y</label>\n                        <div>\n                            <input type=\'number\' ref="$y"> <span>px</span>\n                        </div>\n                    </div>               \n                </div>\n            </div>\n        ';
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this2 = this;

            this.read('/item/current/layer', function (item) {
                if (item.style.x) {
                    _this2.refs.$x.val(item.style.x.replace('px', ''));
                }

                if (item.style.y) {
                    _this2.refs.$y.val(item.style.y.replace('px', ''));
                }
            });
        }
    }, {
        key: 'input $x',
        value: function input$x() {
            var _this3 = this;

            this.read('/item/current/layer', function (item) {
                item.style.x = _this3.refs.$x.int() + 'px';
                _this3.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'input $y',
        value: function input$y() {
            var _this4 = this;

            this.read('/item/current/layer', function (item) {
                item.style.y = _this4.refs.$y.int() + 'px';
                _this4.dispatch('/item/set', item);
            });
        }
    }]);
    return Position;
}(BasePropertyItem);

var Radius = function (_BasePropertyItem) {
    inherits(Radius, _BasePropertyItem);

    function Radius() {
        classCallCheck(this, Radius);
        return possibleConstructorReturn(this, (Radius.__proto__ || Object.getPrototypeOf(Radius)).apply(this, arguments));
    }

    createClass(Radius, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item radius show\'>\n                <div class=\'title\' ref="$title">Radius \n                    <span>\n                        <label><input type=\'checkbox\' ref="$fixedRadius" /> fixed</label>\n                    </span> \n                </div>\n                <div class=\'items\'>         \n                    <div>\n                        <label style="width:80px;">Top Left</label>\n                        <div>\n                            <input type=\'number\' ref="$topLeftRadius"> <span>px</span>\n                        </div>\n                        <label style="width:50px;">Right</label>\n                        <div>\n                            <input type=\'number\' ref="$topRightRadius"> <span>px</span>\n                        </div>\n                    </div>          \n                    <div>\n                        <label style="width:80px;">Bottom Left</label>\n                        <div>\n                            <input type=\'number\' ref="$bottomLeftRadius"> <span>px</span>\n                        </div>\n                        <label style="width:50px;">Right</label>\n                        <div>\n                            <input type=\'number\' ref="$bottomRightRadius"> <span>px</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this2 = this;

            this.read('/item/current/layer', function (item) {

                if (item.fixedRadius) {
                    _this2.refs.$fixedRadius.el.checked = true;
                    var radius = item.style['border-radius'] || '';
                    radius = radius.replace('px', '');
                    _this2.refs.$topLeftRadius.val(radius);
                    _this2.refs.$topRightRadius.val('');
                    _this2.refs.$bottomLeftRadius.val('');
                    _this2.refs.$bottomRightRadius.val('');

                    // this.refs.$topLeftRadius.val(item.style['border-top-left-radius'].replace('px', ''))
                    _this2.refs.$topRightRadius.el.disabled = true;
                    _this2.refs.$bottomLeftRadius.el.disabled = true;
                    _this2.refs.$bottomRightRadius.el.disabled = true;
                } else {
                    _this2.refs.$topRightRadius.el.disabled = false;
                    _this2.refs.$bottomLeftRadius.el.disabled = false;
                    _this2.refs.$bottomRightRadius.el.disabled = false;

                    if (item.style['border-top-left-radius']) {
                        _this2.refs.$topLeftRadius.val(item.style['border-top-left-radius'].replace('px', ''));
                    }

                    if (item.style['border-top-right-radius']) {
                        _this2.refs.$topRightRadius.val(item.style['border-top-right-radius'].replace('px', ''));
                    }

                    if (item.style['border-bottom-left-radius']) {
                        _this2.refs.$bottomLeftRadius.val(item.style['border-bottom-left-radius'].replace('px', ''));
                    }

                    if (item.style['border-bottom-right-radius']) {
                        _this2.refs.$bottomRightRadius.val(item.style['border-bottom-right-radius'].replace('px', ''));
                    }
                }
            });
        }
    }, {
        key: 'refreshValue',
        value: function refreshValue(key, $el) {
            var _this3 = this;

            this.read('/item/current/layer', function (item) {
                item.style[key] = $el.int() + 'px';
                _this3.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'click $fixedRadius',
        value: function click$fixedRadius(e) {
            var _this4 = this;

            this.read('/item/current/layer', function (item) {
                item.fixedRadius = _this4.refs.$fixedRadius.el.checked;
                _this4.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'input $topLeftRadius',
        value: function input$topLeftRadius() {
            var _this5 = this;

            this.read('/item/current/layer', function (item) {
                if (item.fixedRadius) {
                    _this5.refreshValue('border-radius', _this5.refs.$topLeftRadius);
                } else {
                    _this5.refreshValue('border-top-left-radius', _this5.refs.$topLeftRadius);
                }
            });
        }
    }, {
        key: 'input $topRightRadius',
        value: function input$topRightRadius() {
            this.refreshValue('border-top-right-radius', this.refs.$topRightRadius);
        }
    }, {
        key: 'input $bottomLeftRadius',
        value: function input$bottomLeftRadius() {
            this.refreshValue('border-bottom-left-radius', this.refs.$bottomLeftRadius);
        }
    }, {
        key: 'input $bottomRightRadius',
        value: function input$bottomRightRadius() {
            this.refreshValue('border-bottom-right-radius', this.refs.$bottomRightRadius);
        }
    }]);
    return Radius;
}(BasePropertyItem);

var Clip = function (_UIElement) {
    inherits(Clip, _UIElement);

    function Clip() {
        classCallCheck(this, Clip);
        return possibleConstructorReturn(this, (Clip.__proto__ || Object.getPrototypeOf(Clip)).apply(this, arguments));
    }

    createClass(Clip, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item hidden\'>\n                <div class=\'items\'>            \n                    <div>\n                        <label>Clip</label>\n                        <div>\n                            <input type=\'checkbox\' ref="$check">\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this2 = this;

            this.read('/item/current/page', function (item) {
                _this2.refs.$check.el.checked = !!item.clip;
            });
        }
    }, {
        key: 'click $check',
        value: function click$check() {
            var _this3 = this;

            this.read('/item/current/page', function (item) {
                item.clip = _this3.refs.$check.el.checked;
                _this3.dispatch('/item/set', item);
            });
        }
    }]);
    return Clip;
}(UIElement);

var GradientSampleList = function (_UIElement) {
    inherits(GradientSampleList, _UIElement);

    function GradientSampleList() {
        classCallCheck(this, GradientSampleList);
        return possibleConstructorReturn(this, (GradientSampleList.__proto__ || Object.getPrototypeOf(GradientSampleList)).apply(this, arguments));
    }

    createClass(GradientSampleList, [{
        key: 'initialize',
        value: function initialize() {
            get(GradientSampleList.prototype.__proto__ || Object.getPrototypeOf(GradientSampleList.prototype), 'initialize', this).call(this);

            this.list = this.read('/gradient/list/sample', this.props.type);
        }
    }, {
        key: 'template',
        value: function template() {
            var _this2 = this;

            return '\n        <div class="gradient-sample-list">\n            ' + this.list.map(function (item, index) {
                return '<div class=\'gradient-sample-item\' style=\'' + _this2.read('/image/toString', item) + '\' data-index="' + index + '"></div>';
            }).join('') + '\n        </div>\n        ';
        }
    }, {
        key: 'click $el .gradient-sample-item',
        value: function click$elGradientSampleItem(e) {
            var index = +e.$delegateTarget.attr('data-index');

            this.dispatch('/gradient/select', this.props.type, index);
        }
    }]);
    return GradientSampleList;
}(UIElement);

var SampleList = function (_BasePropertyItem) {
    inherits(SampleList, _BasePropertyItem);

    function SampleList() {
        classCallCheck(this, SampleList);
        return possibleConstructorReturn(this, (SampleList.__proto__ || Object.getPrototypeOf(SampleList)).apply(this, arguments));
    }

    createClass(SampleList, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-item sample-list show'>\n                <div class='title' ref=\"$title\">Change Image</div>\n                <div class='items'>            \n                    <GradientSampleList></GradientSampleList>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return { GradientSampleList: GradientSampleList };
        }
    }]);
    return SampleList;
}(BasePropertyItem);

var Name = function (_UIElement) {
    inherits(Name, _UIElement);

    function Name() {
        classCallCheck(this, Name);
        return possibleConstructorReturn(this, (Name.__proto__ || Object.getPrototypeOf(Name)).apply(this, arguments));
    }

    createClass(Name, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item name show\'>\n                <div class=\'items\'>            \n                    <div>\n                        <label>Name</label>\n                        <div>\n                            <input type=\'text\' ref="$name" class=\'full\'> \n                        </div>\n                    </div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var item = this.read('/item/current');

            var name = '';
            if (item) {
                name = item.name;
            }

            this.refs.$name.val(name);
        }
    }, {
        key: 'input $name',
        value: function input$name() {
            var item = this.read('/item/current');

            if (item) {
                item.name = this.refs.$name.val();
                this.dispatch('/item/set', item);
            }
        }
    }]);
    return Name;
}(UIElement);

var GradientSteps = function (_UIElement) {
    inherits(GradientSteps, _UIElement);

    function GradientSteps() {
        classCallCheck(this, GradientSteps);
        return possibleConstructorReturn(this, (GradientSteps.__proto__ || Object.getPrototypeOf(GradientSteps)).apply(this, arguments));
    }

    createClass(GradientSteps, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'gradient-steps\'>\n                <div class="hue-container"></div>            \n                <div class="hue" ref="$steps">\n                    <div class=\'step-list\' ref="$stepList">\n                    </div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'getStepPosition',
        value: function getStepPosition(percent) {
            var _getMinMax = this.getMinMax(),
                min = _getMinMax.min,
                max = _getMinMax.max;

            var left = this.refs.$steps.offset().left;

            min -= left;
            max -= left;

            return min + (max - min) * (percent / 100);
        }

        // load 후에 이벤트를 재설정 해야한다. 

    }, {
        key: 'load $stepList',
        value: function load$stepList() {
            var _this2 = this;

            var item = this.read('/item/current/image');

            if (!item) return '';

            return this.read('/item/map/children', item.id, function (step) {

                return '\n                <div \n                    class=\'drag-bar step ' + (step.selected ? 'selected' : '') + '\' \n                    id="' + step.id + '"\n                    color="' + step.color + '" \n                    style="left: ' + _this2.getStepPosition(step.percent) + 'px; border-color: ' + step.color + ';background-color: ' + step.color + ';"\n                >\n                    <div class=\'guide-line\' style="background-color: ' + step.color + ';"></div>\n                </div>\n            ';
            });
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this3 = this;

            this.read('/item/current/image', function (item) {
                var type = item ? item.type : '';

                if (_this3.read('/image/type/isGradient', type)) {
                    _this3.load();
                    _this3.setColorUI();
                }
            });
        }
    }, {
        key: 'setColorUI',
        value: function setColorUI() {
            this.setBackgroundColor();
        }
    }, {
        key: 'setBackgroundColor',
        value: function setBackgroundColor() {

            this.refs.$stepList.css('background-image', this.read('/image/toLinearRight', this.read('/item/current/image')));
        }

        /* slide 영역 min,max 구하기  */

    }, {
        key: 'getMinMax',
        value: function getMinMax() {
            var min = this.state.get('$steps.offsetLeft');
            var width = this.state.get('$steps.width');
            var max = min + width;

            return { min: min, max: max, width: width };
        }

        /* 현재 위치 구하기  */

    }, {
        key: 'getCurrent',
        value: function getCurrent(e) {
            var _getMinMax2 = this.getMinMax(),
                min = _getMinMax2.min,
                max = _getMinMax2.max;

            var x = e.xy.x;


            var current = Math.min(Math.max(min, x), max);

            return current;
        }

        /**
         * 마우스 이벤트로 현재 위치 및 percent 설정, 전체  gradient 리프레쉬 
         * 
         * @param {*} e 
         */

    }, {
        key: 'refreshColorUI',
        value: function refreshColorUI(e) {
            var _getMinMax3 = this.getMinMax(),
                min = _getMinMax3.min,
                max = _getMinMax3.max;

            var current = this.getCurrent(e);

            if (this.currentStep) {
                var posX = Math.max(min, current);
                this.currentStep.px('left', posX - this.state.get('$steps.offsetLeft'));

                var percent = Math.floor((current - min) / (max - min) * 100);

                var item = this.read('/item/get', this.currentStep.attr('id'));

                if (item) {
                    item.percent = percent;
                    this.dispatch('/item/set', item);
                    this.setBackgroundColor();
                }
            }
        }
    }, {
        key: '@changeColor',
        value: function changeColor() {

            if (this.read('/image/isNotGradientType', this.read('/item/current/image'))) return;
            if (this.read('/tool/colorSource') != this.read('/colorstep/colorSource')) return;

            if (this.currentStep) {

                var item = this.read('/item/get', this.currentStep.attr('id'));

                if (item) {
                    var rgb = this.read('/tool/get', 'color');
                    item.color = rgb;

                    this.dispatch('/item/set', item);
                    this.refresh();
                }
            }
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'checkTarget',
        value: function checkTarget(e) {
            return this.refs.$stepList.is(e.target);
        }

        // 이미 선언된 메소드를 사용하여 메타 데이타로 쓴다. 
        // checkTarget 이라는 메소드가 true 를 리턴해줘야 아래 이벤트는 실행된다. 

    }, {
        key: 'click.checkTarget $steps',
        value: function clickCheckTarget$steps(e) {
            this.addStep(e);
        }
    }, {
        key: 'removeStep',
        value: function removeStep(e) {

            var id = e.$delegateTarget.attr('id');

            this.dispatch('/colorstep/remove', id);
            this.refresh();
        }
    }, {
        key: 'addStep',
        value: function addStep(e) {
            var _getMinMax4 = this.getMinMax(),
                min = _getMinMax4.min,
                max = _getMinMax4.max;

            var current = this.getCurrent(e);

            var percent = Math.floor((current - min) / (max - min) * 100);

            var item = this.read('/item/current/image');

            if (!item) return;

            this.dispatch('/colorstep/add', item, percent);
            this.refresh();
        }
    }, {
        key: 'updateSelectedStep',
        value: function updateSelectedStep(e) {

            var selectedUI = this.refs.$steps.$('.selected');

            if (selectedUI) {
                selectedUI.removeClass('selected');
            }

            this.currentStep = e.$delegateTarget;
            this.currentStep.addClass('selected');
        }
    }, {
        key: 'initColor',
        value: function initColor(color) {
            this.dispatch('/colorstep/initColor', color);
        }
    }, {
        key: 'selectStep',
        value: function selectStep(e) {
            var item = this.read('/item/get', e.$delegateTarget.attr('id'));

            this.read('/item/each/children', item.parentId, function (step) {
                if (step.selected) step.selected = false;
            });

            item.selected = true;

            this.initColor(item.color);

            var $selected = this.refs.$stepList.$('.selected');
            if ($selected && !$selected.is(this.currentStep)) {
                $selected.removeClass('selected');
            }
            this.currentStep.addClass('selected');
            this.dispatch('/item/set', item);
            this.setBackgroundColor();
        }
    }, {
        key: 'click.Shift $steps .step',
        value: function clickShift$stepsStep(e) {
            this.removeStep(e);
        }
    }, {
        key: 'click $steps .step',
        value: function click$stepsStep(e) {
            this.selectStep(e);
        }

        // Event Bindings 

    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.onDragEnd(e);
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            this.onDragMove(e);
        }
    }, {
        key: 'pointerstart $steps .step',
        value: function pointerstart$stepsStep(e) {
            e.preventDefault();
            if (!this.isDown) {
                this.onDragStart(e);
            }
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(e) {

            this.isDown = true;
            this.currentStep = e.$delegateTarget;

            if (this.currentStep) {
                this.selectStep(e);
            }
        }
    }, {
        key: 'onDragMove',
        value: function onDragMove(e) {
            if (this.isDown) {
                this.refreshColorUI(e);
                this.refs.$stepList.addClass('mode-drag');
            }
        }

        /* called when mouse is ended move  */

    }, {
        key: 'onDragEnd',
        value: function onDragEnd(e) {
            this.isDown = false;
            if (this.refs.$stepList) {
                this.refs.$stepList.removeClass('mode-drag');
            }
        }
    }]);
    return GradientSteps;
}(UIElement);

var ColorSteps = function (_BasePropertyItem) {
    inherits(ColorSteps, _BasePropertyItem);

    function ColorSteps() {
        classCallCheck(this, ColorSteps);
        return possibleConstructorReturn(this, (ColorSteps.__proto__ || Object.getPrototypeOf(ColorSteps)).apply(this, arguments));
    }

    createClass(ColorSteps, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-item gradient-steps show'>\n                <div class='title'>Color Steps</div>\n                <div class='items'>            \n                    <GradientSteps></GradientSteps>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return { GradientSteps: GradientSteps };
        }
    }, {
        key: "refresh",
        value: function refresh() {
            this.$el.toggle(this.isShow());
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: "isShow",
        value: function isShow() {
            var item = this.read('/item/current/image');

            if (!item) return false;

            return this.read('/image/type/isGradient', item.type);
        }
    }]);
    return ColorSteps;
}(BasePropertyItem);

var GradientInfo = function (_UIElement) {
    inherits(GradientInfo, _UIElement);

    function GradientInfo() {
        classCallCheck(this, GradientInfo);
        return possibleConstructorReturn(this, (GradientInfo.__proto__ || Object.getPrototypeOf(GradientInfo)).apply(this, arguments));
    }

    createClass(GradientInfo, [{
        key: 'template',
        value: function template() {
            return ' \n            <div class=\'gradient-info\'>\n                <div class="form-item" ref="$colorsteps">\n\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'load $colorsteps',
        value: function load$colorsteps() {

            var item = this.read('/item/current/image');

            if (!item) return '';

            var colorsteps = this.read('/item/map/children', item.id, function (step) {
                return step;
            });

            return '<div class=\'step-list\' ref="$stepList">\n                    ' + colorsteps.map(function (step) {
                return '\n                            <div class=\'color-step ' + (step.selected ? 'selected' : '') + '\' style="background-color: ' + (step.selected ? step.color : '') + '" colorstep-id="' + step.id + '" >\n                                <div class="color-view">\n                                    <div class="color-view-item" style="background-color: ' + step.color + '" colorstep-id="' + step.id + '" ></div>\n                                </div>\n                                <div class="color-code">\n                                    <input type="text" class="code" value=\'' + step.color + '\'  colorstep-id="' + step.id + '"  />\n                                </div>\n                                <div class="color-percent">\n                                    <input type="number" class="percent" min="0" max="100" step="0.1"  value="' + step.percent + '"   colorstep-id="' + step.id + '"  />%\n                                </div>\n                                <div class="tools">\n                                    <button type="button" class=\'remove-step\'  colorstep-id="' + step.id + '" >&times;</button>\n                                </div>\n                            </div>\n                        ';
            }).join('') + '\n                </div>';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.load();
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'initColor',
        value: function initColor(color) {
            this.dispatch('/colorstep/initColor', color);
        }
    }, {
        key: 'selectStep',
        value: function selectStep(e) {
            var item = this.read('/item/get', e.$delegateTarget.attr('colorstep-id'));

            this.read('/item/each/children', item.parentId, function (step) {
                if (step.selected) step.selected = false;
            });

            console.log(e, item);

            item.selected = true;

            this.initColor(item.color);
            this.dispatch('/item/set', item);
            this.refresh();
        }
    }, {
        key: 'click $colorsteps .color-view-item',
        value: function click$colorstepsColorViewItem(e) {
            this.selectStep(e);
        }
    }, {
        key: 'input $colorsteps input.code',
        value: function input$colorstepsInputCode(e) {
            var item = this.read('/item/current/image');
            if (!item) return;

            var color = e.$delegateTarget.val();
            var id = e.$delegateTarget.attr('colorstep-id');

            var step = this.read('/item/get', id);

            if (step) {
                step.color = color;
                this.dispatch('/item/set', step);
            }
        }
    }, {
        key: 'input $colorsteps input.percent',
        value: function input$colorstepsInputPercent(e) {
            var item = this.read('/item/current/image');
            if (!item) return;

            var percent = e.$delegateTarget.val();
            var id = e.$delegateTarget.attr('colorstep-id');

            var step = this.read('/item/get', id);

            if (step) {
                step.percent = percent;
                this.dispatch('/item/set', step);
            }
        }
    }, {
        key: 'click $colorsteps .remove-step',
        value: function click$colorstepsRemoveStep(e) {
            var item = this.read('/item/current/image');
            if (!item) return;

            var id = e.$delegateTarget.attr('colorstep-id');

            this.dispatch('/colorstep/remove', id);
            this.refresh();
        }
    }]);
    return GradientInfo;
}(UIElement);

var ColorStepsInfo = function (_UIElement) {
    inherits(ColorStepsInfo, _UIElement);

    function ColorStepsInfo() {
        classCallCheck(this, ColorStepsInfo);
        return possibleConstructorReturn(this, (ColorStepsInfo.__proto__ || Object.getPrototypeOf(ColorStepsInfo)).apply(this, arguments));
    }

    createClass(ColorStepsInfo, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-item gradient-steps-info show'>\n                <div class='items'>            \n                    <GradientInfo></GradientInfo>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return { GradientInfo: GradientInfo };
        }
    }, {
        key: "refresh",
        value: function refresh() {
            this.$el.toggle(this.isShow());
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: "isShow",
        value: function isShow() {
            var item = this.read('/item/current/image');

            if (!item) return false;

            return this.read('/image/type/isGradient', item.type);
        }
    }]);
    return ColorStepsInfo;
}(UIElement);

var ColorPickerLayer = function (_UIElement) {
    inherits(ColorPickerLayer, _UIElement);

    function ColorPickerLayer() {
        classCallCheck(this, ColorPickerLayer);
        return possibleConstructorReturn(this, (ColorPickerLayer.__proto__ || Object.getPrototypeOf(ColorPickerLayer)).apply(this, arguments));
    }

    createClass(ColorPickerLayer, [{
        key: 'afterRender',
        value: function afterRender() {
            var _this2 = this;

            var defaultColor = this.read('/getSelectedColor');
            this.colorPicker = ColorPicker.create({
                type: 'ring',
                position: 'inline',
                container: this.$el.el,
                color: defaultColor,
                onChange: function onChange(c) {
                    _this2.changeColor(c);
                }
            });

            setTimeout(function () {
                _this2.colorPicker.dispatch('/initColor', defaultColor);
            }, 100);
        }
    }, {
        key: 'template',
        value: function template() {
            return '<div class=\'colorpicker-layer\'> </div>';
        }
    }, {
        key: 'changeColor',
        value: function changeColor(color) {
            var _this3 = this;

            var item = this.read('/item/current');

            if (!item) return;

            if (this.read('/item/is/mode', 'layer')) {
                item.style['background-color'] = color;
                this.dispatch('/item/set', item);
            } else if (this.read('/item/is/mode', 'image')) {

                if (this.read('/image/type/isStatic', item.type)) {
                    item.color = color;
                    this.dispatch('/item/set', item);
                } else if (this.read('/image/type/isGradient', item.type)) {

                    this.read('/item/each/children', item.id, function (step) {
                        if (step.selected) {
                            step.color = color;
                            _this3.dispatch('/item/set', step);
                        }
                    });
                }
            }
        }
    }, {
        key: '@changeColor',
        value: function changeColor() {
            this.colorPicker.initColorWithoutChangeEvent(this.read('/tool/get', 'color'));
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            var _this4 = this;

            if (this.read('/item/is/mode', 'layer')) {
                this.read('/item/current/layer', function (layer) {
                    _this4.colorPicker.initColorWithoutChangeEvent(layer.style['background-color']);
                });
            } else if (this.read('/item/is/mode', 'image')) {
                this.read('/item/current/image', function (image) {
                    if (_this4.read('/image/type/isStatic', image.type)) {
                        _this4.colorPicker.initColorWithoutChangeEvent(image.color);
                    } else if (_this4.read('/image/type/isGradient', image.type)) {}
                });
            }
        }
    }]);
    return ColorPickerLayer;
}(UIElement);

var ColorPickerPanel = function (_UIElement) {
    inherits(ColorPickerPanel, _UIElement);

    function ColorPickerPanel() {
        classCallCheck(this, ColorPickerPanel);
        return possibleConstructorReturn(this, (ColorPickerPanel.__proto__ || Object.getPrototypeOf(ColorPickerPanel)).apply(this, arguments));
    }

    createClass(ColorPickerPanel, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-item colorpicker show'>\n                <div class='items'>            \n                    <ColorPicker></ColorPicker>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return { ColorPicker: ColorPickerLayer };
        }
    }]);
    return ColorPickerPanel;
}(UIElement);

var PredefinedRadialGradientAngle = function (_UIElement) {
    inherits(PredefinedRadialGradientAngle, _UIElement);

    function PredefinedRadialGradientAngle() {
        classCallCheck(this, PredefinedRadialGradientAngle);
        return possibleConstructorReturn(this, (PredefinedRadialGradientAngle.__proto__ || Object.getPrototypeOf(PredefinedRadialGradientAngle)).apply(this, arguments));
    }

    createClass(PredefinedRadialGradientAngle, [{
        key: 'template',
        value: function template() {
            return '\n            <div class="predefined-radial-gradient-angle">\n                <button ref="$center" type="button" data-value="center" title="center"><span class=\'circle\'></span></button>            \n                <select class="radial-type-list" ref="$select">\n                    <option value="circle">circle</option>\n                    <option value="ellipse">ellipse</option>\n                    <option value="closest-side">closest-side</option> \n                    <option value="closest-corner">closest-corner</option>\n                    <option value="farthest-side">farthest-side</option>\n                    <option value="farthest-corner">farthest-corner</option>                    \n                </select>\n            </div>\n        ';
        }
    }, {
        key: 'change $select',
        value: function change$select(e) {
            var _this2 = this;

            this.read('/item/current/image', function (image) {
                image.radialType = _this2.refs.$select.val();
                _this2.dispatch('/item/set', image);
            });
        }
    }, {
        key: 'click $center',
        value: function click$center(e) {
            var _this3 = this;

            this.read('/item/current/image', function (image) {
                image.radialPosition = 'center';
                _this3.dispatch('/item/set', image);
            });
        }
    }]);
    return PredefinedRadialGradientAngle;
}(UIElement);

var ImageTypeSelect = function (_BasePropertyItem) {
    inherits(ImageTypeSelect, _BasePropertyItem);

    function ImageTypeSelect() {
        classCallCheck(this, ImageTypeSelect);
        return possibleConstructorReturn(this, (ImageTypeSelect.__proto__ || Object.getPrototypeOf(ImageTypeSelect)).apply(this, arguments));
    }

    createClass(ImageTypeSelect, [{
        key: 'components',
        value: function components() {
            return { PredefinedRadialGradientAngle: PredefinedRadialGradientAngle };
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n        <div class=\'property-item gradient-tools show\'>\n            <div class=\'title\' ref="$title">Change Image Types</div>\n            <div class=\'items\' ref="$items">        \n                <div class=\'gradient-type\' ref="$gradientType">\n                    <div ref="$static" class="gradient-item static" data-type="static" title="Static Color"></div>\n                    <div ref="$linear" class="gradient-item linear" data-type="linear" title="Linear Gradient"></div>\n                    <div ref="$radial" class="gradient-item radial" data-type="radial" title="Radial Gradient"></div>\n                    <div ref="$repeatingLinear" class="gradient-item repeating-linear" data-type="repeating-linear" title="repeating Linear Gradient"></div>\n                    <div ref="$repeatingRadial" class="gradient-item repeating-radial" data-type="repeating-radial" title="repeating Radial Gradient"></div>\n                    <div ref="$image" class="gradient-item image" data-type="image" title="Background Image">\n                        <div class="m1"></div>\n                        <div class="m2"></div>\n                        <div class="m3"></div>\n                    </div>\n                </div>\n                <div ref="$angular" class=\'gradient-angular linear\'>\n                    <div class="gradient-angular-item radial">\n                        <PredefinedRadialGradientAngle></PredefinedRadialGradientAngle>\n                    </div>\n                    <div class="gradient-angular-item image">\n                        \n                    </div>                \n                </div>\n            </div>\n        </div>\n\n          \n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {

            var isShow = this.isShow();
            this.$el.toggle(isShow);

            if (isShow) {
                this.setLayerTypeUI();
            }
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            var item = this.read('/item/current/image');

            if (!item) return false;

            return true;
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'setLayerTypeUI',
        value: function setLayerTypeUI(type) {
            var item = this.read('/item/current/image');

            if (!type && item) {
                type = item.type;
            }

            this.refs.$static.toggleClass('selected', type == 'static');
            this.refs.$linear.toggleClass('selected', type == 'linear');
            this.refs.$radial.toggleClass('selected', type == 'radial');
            this.refs.$repeatingLinear.toggleClass('selected', type == 'repeating-linear');
            this.refs.$repeatingRadial.toggleClass('selected', type == 'repeating-radial');
            this.refs.$image.toggleClass('selected', type == 'image');

            this.refs.$angular.toggleClass('linear', this.read('/image/type/isLinear', type));
            this.refs.$angular.toggleClass('radial', this.read('/image/type/isRadial', type));
            this.refs.$angular.toggleClass('image', this.read('/image/type/isImage', type));
        }
    }, {
        key: 'click $gradientType .gradient-item',
        value: function click$gradientTypeGradientItem(e) {

            var type = e.$delegateTarget.attr('data-type');

            var item = this.read('/item/current/image');

            if (!item) return;

            item.type = type;

            this.dispatch('/item/set', item);
            this.setLayerTypeUI(type);
        }
    }]);
    return ImageTypeSelect;
}(BasePropertyItem);

var ColorSampleList = function (_UIElement) {
    inherits(ColorSampleList, _UIElement);

    function ColorSampleList() {
        classCallCheck(this, ColorSampleList);
        return possibleConstructorReturn(this, (ColorSampleList.__proto__ || Object.getPrototypeOf(ColorSampleList)).apply(this, arguments));
    }

    createClass(ColorSampleList, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-item sample-list show'>\n                <div class='items'>            \n                    <GradientSampleList type=\"color\"></GradientSampleList>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return { GradientSampleList: GradientSampleList };
        }
    }]);
    return ColorSampleList;
}(UIElement);

var Transform = function (_BasePropertyItem) {
    inherits(Transform, _BasePropertyItem);

    function Transform() {
        classCallCheck(this, Transform);
        return possibleConstructorReturn(this, (Transform.__proto__ || Object.getPrototypeOf(Transform)).apply(this, arguments));
    }

    createClass(Transform, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item transform\'>\n                <div class=\'title\' ref="$title">Transform</div>\n                <div class=\'items\'>            \n                    <div>\n                        <label>Rotate</label>\n                        <div>\n                            <input type=\'number\' ref="$rotate"> <span>deg</span>\n                        </div>\n                        <label>Scale</label>\n                        <div>\n                            <input type=\'number\' ref="$scale" min="0.5" max="10.0" step="0.1"> <span></span>\n                        </div>\n                    </div>                      \n                    <div>\n                        <label>SkewX</label>\n                        <div>\n                            <input type=\'number\' ref="$skewX"> <span>deg</span>\n                        </div>\n                        <label>SkewY</label>\n                        <div>\n                            <input type=\'number\' ref="$skewY"> <span>deg</span>\n                        </div>\n                    </div>     \n   \n                    <div>\n                        <label>translateX</label>\n                        <div>\n                            <input type=\'number\' ref="$translateX"> <span>px</span>\n                        </div>\n                        <label>translateY</label>\n                        <div>\n                            <input type=\'number\' ref="$translateY"> <span>px</span>\n                        </div>\n                    </div>                                                         \n                    \n                    <!--\n                    <div>\n                        <label>translateZ</label>\n                        <div>\n                            <input type=\'number\' ref="$translateZ"> <span>px</span>\n                        </div>\n                    </div>   -->                                                                          \n                </div>\n            </div>\n        ';
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this2 = this;

            this.read('/item/current/layer', function (item) {

                var attr = ['rotate', 'skewX', 'skewY', 'scale', 'translateX', 'translateY', 'translateZ'];

                attr.forEach(function (key) {
                    if (item.style[key]) {
                        _this2.refs['$' + key].val(item.style[key]);
                    }
                });
            });
        }
    }, {
        key: 'updateTransform',
        value: function updateTransform(key) {
            var _this3 = this;

            this.read('/item/current/layer', function (item) {
                item.style[key] = _this3.refs['$' + key].val();
                _this3.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'input $rotate',
        value: function input$rotate() {
            this.updateTransform('rotate');
        }
    }, {
        key: 'input $skewX',
        value: function input$skewX() {
            this.updateTransform('skewX');
        }
    }, {
        key: 'input $skewY',
        value: function input$skewY() {
            this.updateTransform('skewY');
        }
    }, {
        key: 'input $scale',
        value: function input$scale() {
            this.updateTransform('scale');
        }
    }, {
        key: 'input $translateX',
        value: function input$translateX() {
            this.updateTransform('translateX');
        }
    }, {
        key: 'input $translateY',
        value: function input$translateY() {
            this.updateTransform('translateY');
        }
    }, {
        key: 'input $translateZ',
        value: function input$translateZ() {
            this.updateTransform('translateZ');
        }
    }]);
    return Transform;
}(BasePropertyItem);

var Transform3d = function (_BasePropertyItem) {
    inherits(Transform3d, _BasePropertyItem);

    function Transform3d() {
        classCallCheck(this, Transform3d);
        return possibleConstructorReturn(this, (Transform3d.__proto__ || Object.getPrototypeOf(Transform3d)).apply(this, arguments));
    }

    createClass(Transform3d, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item transform\'>\n                <div class=\'title\' ref="$title">Transform 3D</div> \n                <div class=\'items\'>            \n                    <div>\n                        <label>Rotate 3D</label>\n                        <div>\n                            <div class=\'input\'> \n                                <input type=\'number\' ref="$rotate3dX"> \n                                <input type=\'number\' ref="$rotate3dY"> \n                                <input type=\'number\' ref="$rotate3dZ"> \n                                <input type=\'number\' ref="$rotate3dA"> \n                            </div>\n                        </div>\n                    </div>\n                    <div>\n                        <label></label>\n                        <div>\n                            \n                            <div class=\'input-text\'>\n                                <span>X</span>\n                                <span>Y</span>\n                                <span>Z</span>\n                                <span>Angle</span>\n                            </div>\n                        </div>\n                    </div>\n                    <div>\n                        <label>Scale 3D</label>\n                        <div>\n                            <div class=\'input\'> \n                                <input type=\'number\' ref="$scale3dX"> \n                                <input type=\'number\' ref="$scale3dY"> \n                                <input type=\'number\' ref="$scale3dZ"> \n                            </div>\n                        </div>\n                    </div>\n                    <div>\n                        <label></label>\n                        <div>\n                            <div class=\'input-text\'>\n                                <span>X</span>\n                                <span>Y</span>\n                                <span>Z</span>\n                            </div>\n                        </div>\n                    </div>\n                    <div>\n                        <label>Translate3D</label>\n                        <div>\n                            <div class=\'input\'> \n                                <input type=\'number\' ref="$translate3dX"> \n                                <input type=\'number\' ref="$translate3dY"> \n                                <input type=\'number\' ref="$translate3dZ"> \n                            </div>\n                        </div>\n                    </div>\n                    <div>\n                        <label></label>                            \n                        <div>\n                            <div class=\'input-text\'>\n                                <span>X</span>\n                                <span>Y</span>\n                                <span>Z</span>\n                            </div>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n        ';
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this2 = this;

            this.read('/item/current/layer', function (item) {

                var attr = ['rotate3dX', 'rotate3dY', 'rotate3dZ', 'rotate3dA', 'scale3dX', 'scale3dY', 'scale3dZ', 'translate3dX', 'translate3dY', 'translate3dZ'];

                attr.forEach(function (key) {
                    if (item.style[key]) {
                        _this2.refs['$' + key].val(item.style[key]);
                    }
                });
            });
        }
    }, {
        key: 'updateTransform',
        value: function updateTransform(key) {
            var _this3 = this;

            this.read('/item/current/layer', function (item) {
                item.style[key] = _this3.refs['$' + key].val();
                _this3.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'input $rotate3dX',
        value: function input$rotate3dX() {
            this.updateTransform('rotate3dX');
        }
    }, {
        key: 'input $rotate3dY',
        value: function input$rotate3dY() {
            this.updateTransform('rotate3dY');
        }
    }, {
        key: 'input $rotate3dZ',
        value: function input$rotate3dZ() {
            this.updateTransform('rotate3dZ');
        }
    }, {
        key: 'input $rotate3dA',
        value: function input$rotate3dA() {
            this.updateTransform('rotate3dA');
        }
    }, {
        key: 'input $scale3dX',
        value: function input$scale3dX() {
            this.updateTransform('scale3dX');
        }
    }, {
        key: 'input $scale3dY',
        value: function input$scale3dY() {
            this.updateTransform('scale3dY');
        }
    }, {
        key: 'input $scale3dZ',
        value: function input$scale3dZ() {
            this.updateTransform('scale3dZ');
        }
    }, {
        key: 'input $translate3dX',
        value: function input$translate3dX() {
            this.updateTransform('translate3dX');
        }
    }, {
        key: 'input $translate3dY',
        value: function input$translate3dY() {
            this.updateTransform('translate3dY');
        }
    }, {
        key: 'input $translate3dZ',
        value: function input$translate3dZ() {
            this.updateTransform('translate3dZ');
        }
    }]);
    return Transform3d;
}(BasePropertyItem);

var unit_names = {
    'percent': '%',
    'px': 'px',
    'em': 'em'
};

var UnitRange = function (_UIElement) {
    inherits(UnitRange, _UIElement);

    function UnitRange() {
        classCallCheck(this, UnitRange);
        return possibleConstructorReturn(this, (UnitRange.__proto__ || Object.getPrototypeOf(UnitRange)).apply(this, arguments));
    }

    createClass(UnitRange, [{
        key: "created",
        value: function created() {
            this.min = this.props.min || 0;
            this.max = this.props.max || 1000;
            this.step = this.props.step || 1;
            this.value = this.props.value || 0;
            this.unit = this.props.unit || 'px';
            this.showClass = 'show';
            this.maxValueFunction = this.parent[this.props.maxvaluefunction].bind(this.parent);
            this.updateFunction = this.parent[this.props.updatefunction].bind(this.parent);
        }
    }, {
        key: "afterRender",
        value: function afterRender() {
            this.initializeRangeMax(this.unit);
        }
    }, {
        key: "template",
        value: function template() {

            return "\n            <div class='unit-range'>\n                <div class='base-value'>\n                    <input ref=\"$range\" type=\"range\" class='range' min=\"" + this.min + "\" max=\"" + this.max + "\" step=\"" + this.step + "\" value=\"" + this.value + "\" />\n                    <input ref=\"$number\" type=\"number\" class='number' min=\"" + this.min + "\" max=\"" + this.max + "\" step=\"" + this.step + "\" value=\"" + this.value + "\"  />\n                    <button ref=\"$unit\" type=\"button\" class='unit'>" + this.unit + "</button>\n                </div>\n                <div class=\"multi-value\" ref=\"$multiValue\">\n                    <div ref=\"$px\" class=\"px\" unit='px'></div>\n                    <div ref=\"$percent\" class=\"percent\" unit='percent'></div>\n                    <div ref=\"$em\" class=\"em\" unit='em'></div>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: 'click $multiValue div',
        value: function click$multiValueDiv(e) {
            var unit = e.$delegateTarget.attr('unit');
            var value = e.$delegateTarget.attr('value');

            this.selectUnit(unit, value);
        }
    }, {
        key: "refresh",
        value: function refresh() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            value = value || '';
            var unit = 'px';
            if (value.includes('%')) {
                unit = 'percent';
            } else if (value.includes('em')) {
                unit = 'em';
            }

            this.selectUnit(unit, parseParamNumber$2(value));
        }
    }, {
        key: "initializeRangeMax",
        value: function initializeRangeMax(unit) {

            if (unit == 'percent') {
                this.refs.$range.attr('max', 300);
                this.refs.$range.attr('step', 0.01);
                this.refs.$number.attr('max', 300);
                this.refs.$number.attr('step', 0.01);
            } else if (unit == 'px') {
                this.refs.$range.attr('max', 1000);
                this.refs.$range.attr('step', 1);
                this.refs.$number.attr('max', 1000);
                this.refs.$number.attr('step', 1);
            } else if (unit == 'em') {
                this.refs.$range.attr('max', 300);
                this.refs.$range.attr('step', 0.01);
                this.refs.$number.attr('max', 300);
                this.refs.$number.attr('step', 0.01);
            }
        }
    }, {
        key: "selectUnit",
        value: function selectUnit(unit, value) {
            this.unit = unit;
            this.value = value;

            this.refs.$range.val(this.value);
            this.refs.$number.val(this.value);
            this.refs.$unit.text(unit_names[this.unit]);

            this.initializeRangeMax(this.unit);
        }
    }, {
        key: 'click $unit',
        value: function click$unit(e) {
            this.$el.toggleClass(this.showClass);
            this.updateRange();
        }
    }, {
        key: "updateRange",
        value: function updateRange() {
            var unit = this.unit;
            var px = unit == 'px' ? this.refs.$range.val() : undefined;
            var percent = unit == 'percent' ? this.refs.$range.val() : undefined;
            var em = unit == 'em' ? this.refs.$range.val() : undefined;
            var maxValue = this.maxValueFunction();

            if (px) {
                this.refs.$px.text(px + ' px').attr('value', px);
                this.refs.$percent.text(px2percent(px, maxValue) + ' %').attr('value', px2percent(px, maxValue));
                this.refs.$em.text(px2em(px, maxValue) + ' em').attr('value', px2em(px, maxValue));
            } else if (percent) {
                this.refs.$percent.text(percent + ' %').attr('value', percent);
                this.refs.$px.text(percent2px(percent, maxValue) + ' px').attr('value', percent2px(percent, maxValue));
                this.refs.$em.text(percent2em(percent, maxValue) + ' em').attr('value', percent2em(percent, maxValue));
            } else if (em) {
                this.refs.$em.text(em + ' em').attr('value', em);
                this.refs.$percent.text(em2percent(em, maxValue) + ' %').attr('value', em2percent(em, maxValue));
                this.refs.$px.text(em2px(em, maxValue) + ' px').attr('value', em2px(em, maxValue));
            }
        }
    }, {
        key: 'input $range',
        value: function input$range(e) {
            this.refs.$number.val(this.refs.$range.val());
            this.updateRange();
            this.updateFunction(this.refs.$range.val() + unit_names[this.unit]);
        }
    }, {
        key: 'input $number',
        value: function input$number(e) {
            this.refs.$range.val(this.refs.$number.val());
            this.updateRange();
            this.updateFunction(this.refs.$range.val() + unit_names[this.unit]);
        }
    }]);
    return UnitRange;
}(UIElement);

var BackgroundSize = function (_UIElement) {
    inherits(BackgroundSize, _UIElement);

    function BackgroundSize() {
        classCallCheck(this, BackgroundSize);
        return possibleConstructorReturn(this, (BackgroundSize.__proto__ || Object.getPrototypeOf(BackgroundSize)).apply(this, arguments));
    }

    createClass(BackgroundSize, [{
        key: "components",
        value: function components() {
            return {
                UnitRange: UnitRange
            };
        }
    }, {
        key: "template",
        value: function template() {
            return "\n            <div class='property-item background'>\n                <div class='title' ref=\"$title\">Background</div>            \n                <div class='items'>\n                    <div>\n                        <label>size</label>\n                        <div class='size-list' ref=\"$size\">\n                            <button type=\"button\" value=\"contain\" title=\"contain\" ></button>\n                            <button type=\"button\" value=\"cover\" title=\"cover\"></button>\n                            <button type=\"button\" value=\"auto\" title=\"auto\"></button>\n                        </div>\n                    </div>\n                    <div>\n                        <label>width</label>\n                        <UnitRange \n                            ref=\"$width\" \n                            min=\"0\" max=\"1000\" step=\"1\" value=\"0\" unit=\"px\" \n                            maxValueFunction=\"getMaxWidth\"\n                            updateFunction=\"updateWidth\"\n                        ></UnitRange>\n                    </div>\n                    <div>\n                        <label>height</label>\n                        <UnitRange \n                            ref=\"$height\" \n                            min=\"0\" max=\"1000\" step=\"1\" value=\"0\" unit=\"px\" \n                            maxValueFunction=\"getMaxHeight\"\n                            updateFunction=\"updateHeight\"\n                        ></UnitRange>\n                    </div>\n                    <div>\n                        <label>repeat</label>\n                        <div class='flex repeat-list' ref=\"$repeat\">\n                            <button type=\"button\" value='no-repeat' title=\"no-repeat\">\n                                <span></span>\n                            </button>                        \n                            <button type=\"button\" value='repeat' title=\"repeat\">\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                            </button>\n                            <button type=\"button\" value='repeat-x' title=\"repeat-x\">\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                            </button>\n                            <button type=\"button\" value='repeat-y' title=\"repeat-y\">\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                            </button>\n                            <button type=\"button\" value='space' title=\"space\">\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>                                \n                            </button>\n                            <button type=\"button\" value='round' title=\"round\">\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>\n                                <span></span>                                                                \n                            </button>                            \n                            \n                        </div>\n                 \n                    </div>\n\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "updateWidth",
        value: function updateWidth(value) {
            var _this2 = this;

            this.read('/item/current/image', function (image) {
                image.backgroundSizeWidth = value;
                _this2.dispatch('/item/set', image);
            });
        }
    }, {
        key: "updateHeight",
        value: function updateHeight(value) {
            var _this3 = this;

            this.read('/item/current/image', function (image) {
                image.backgroundSizeHeight = value;
                _this3.dispatch('/item/set', image);
            });
        }
    }, {
        key: "getMaxHeight",
        value: function getMaxHeight() {
            var layer = this.read('/item/current/layer');

            if (!layer) return 0;

            return parseParamNumber$1(layer.style.height);
        }
    }, {
        key: "getMaxWidth",
        value: function getMaxWidth() {
            var layer = this.read('/item/current/layer');

            if (!layer) return 0;

            return parseParamNumber$1(layer.style.width);
        }
    }, {
        key: 'click $size button',
        value: function click$sizeButton(e) {
            var _this4 = this;

            this.read('/item/current/image', function (image) {
                image.backgroundSize = e.$delegateTarget.val();
                _this4.selectBackgroundSize(image.backgroundSize);
                _this4.dispatch('/item/set', image);
            });
        }
    }, {
        key: "selectBackgroundSize",
        value: function selectBackgroundSize() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'auto';

            var selectedItem = this.refs.$size.$('.selected');
            if (selectedItem) selectedItem.removeClass('selected');

            if (!['contain', 'cover', 'auto'].includes(value)) {
                value = 'auto';
            }

            var item = this.refs.$size.$("[value=" + value + "]");

            if (item) {
                item.addClass('selected');
            }
        }
    }, {
        key: "selectBackgroundRepeat",
        value: function selectBackgroundRepeat(value) {
            var selectedItem = this.refs.$repeat.$('.selected');
            if (selectedItem) selectedItem.removeClass('selected');

            var item = this.refs.$repeat.$("[value=" + value + "]");

            if (item) {
                item.addClass('selected');
            }
        }
    }, {
        key: 'click $repeat button',
        value: function click$repeatButton(e) {
            var _this5 = this;

            this.read('/item/current/image', function (image) {
                image.backgroundRepeat = e.$delegateTarget.val();
                _this5.selectBackgroundRepeat(image.backgroundRepeat);
                _this5.dispatch('/item/set', image);
            });
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: "refresh",
        value: function refresh() {
            var _this6 = this;

            this.read('/item/current/image', function (image) {
                _this6.children.$width.refresh(image.backgroundSizeWidth);
                _this6.children.$height.refresh(image.backgroundSizeHeight);
                _this6.selectBackgroundSize(image.backgroundSize);
                _this6.selectBackgroundRepeat(image.backgroundRepeat);
            });
        }
    }]);
    return BackgroundSize;
}(UIElement);

var PageSize = function (_UIElement) {
    inherits(PageSize, _UIElement);

    function PageSize() {
        classCallCheck(this, PageSize);
        return possibleConstructorReturn(this, (PageSize.__proto__ || Object.getPrototypeOf(PageSize)).apply(this, arguments));
    }

    createClass(PageSize, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item size\'>\n                <div class=\'title\'>page size\n                    <span>\n                        <button type="button" ref="$rect">rect</button>\n                    </span>\n                </div>\n                <div class=\'items\'>\n                    <div>\n                        <label>Width</label>\n                        <div>\n                            <input type=\'number\' ref="$width"> <span>px</span>\n                        </div>\n                        <label>Height</label>\n                        <div>\n                            <input type=\'number\' ref="$height"> <span>px</span>\n                        </div>\n                    </div>   \n                                 \n                </div>\n            </div>\n        ';
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this2 = this;

            this.read('/item/current/page', function (item) {
                if (item.style && item.style.width) {
                    _this2.refs.$width.val(item.style.width.replace('px', ''));
                }

                if (item.style && item.style.height) {
                    _this2.refs.$height.val(item.style.height.replace('px', ''));
                }
            });
        }
    }, {
        key: 'click $rect',
        value: function click$rect(e) {
            var _this3 = this;

            this.read('/item/current/page', function (item) {
                item.style.width = _this3.refs.$width.int() + 'px';
                item.style.height = item.style.width;
                _this3.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'input $width',
        value: function input$width() {
            var _this4 = this;

            this.read('/item/current/page', function (item) {
                item.style.width = _this4.refs.$width.int() + 'px';
                _this4.dispatch('/item/set', item);
            });
        }
    }, {
        key: 'input $height',
        value: function input$height() {
            var _this5 = this;

            this.read('/item/current/page', function (item) {
                item.style.height = item.style.width;
                _this5.dispatch('/item/set', item);
            });
        }
    }]);
    return PageSize;
}(UIElement);

var PageName = function (_UIElement) {
    inherits(PageName, _UIElement);

    function PageName() {
        classCallCheck(this, PageName);
        return possibleConstructorReturn(this, (PageName.__proto__ || Object.getPrototypeOf(PageName)).apply(this, arguments));
    }

    createClass(PageName, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item name\'>\n                <div class=\'items\'>            \n                    <div>\n                        <label>page name</label>\n                        <div>\n                            <input type=\'text\' ref="$name" class=\'full\'> \n                        </div>\n                    </div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this2 = this;

            this.read('/item/current/page', function (item) {
                var name = '';
                if (item) {
                    name = item.name;
                }

                _this2.refs.$name.val(name);
            });
        }
    }, {
        key: 'input $name',
        value: function input$name() {
            var _this3 = this;

            this.read('/item/current/page', function (item) {
                item.name = _this3.refs.$name.val();
                _this3.dispatch('/item/set', item);
            });
        }
    }]);
    return PageName;
}(UIElement);

var PageExport = function (_UIElement) {
    inherits(PageExport, _UIElement);

    function PageExport() {
        classCallCheck(this, PageExport);
        return possibleConstructorReturn(this, (PageExport.__proto__ || Object.getPrototypeOf(PageExport)).apply(this, arguments));
    }

    createClass(PageExport, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item export\'>\n                <div class=\'items\'>\n                    <div>\n                        <label>Export</label>\n                        <button type="button" ref="$export">view</button>\n                    </div>   \n                                 \n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'click $export',
        value: function click$export(e) {
            this.emit('showExport');
        }
    }]);
    return PageExport;
}(UIElement);

var BlendList = function (_BasePropertyItem) {
    inherits(BlendList, _BasePropertyItem);

    function BlendList() {
        classCallCheck(this, BlendList);
        return possibleConstructorReturn(this, (BlendList.__proto__ || Object.getPrototypeOf(BlendList)).apply(this, arguments));
    }

    createClass(BlendList, [{
        key: 'template',
        value: function template() {
            return '\n        <div class=\'property-item blend\'>\n            <div class=\'title\' ref="$title">Blend - <span class=\'description\' ref="$desc"></span></div>\n            <div class=\'items max-height\'>         \n                <div class="blend-list" ref="$blendList"></div>\n            </div>\n        </div>\n        ';
        }
    }, {
        key: 'load $blendList',
        value: function load$blendList() {
            var _this2 = this;

            var list = this.read('/blend/list');

            var item = this.read('/item/current/layer');
            if (!item) {
                return '';
            }

            return '<div>' + list.map(function (blend) {

                var selected = blend == item.style['background-blend-mode'] ? 'selected' : '';
                return '\n                        <div class=\'blend-item ' + selected + '\' data-mode="' + blend + '">\n                            <div class="blend-item-view-container">\n                                <div class="blend-item-blend-view"  style=\'' + _this2.read('/blend/toStringWithoutDimension', item, blend) + '\'></div>\n                                <div class="blend-item-text">' + blend + '</div>\n                            </div>\n                        </div>';
            }).join('') + '</div>';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this3 = this;

            this.load();

            this.read('/item/current/layer', function (layer) {
                _this3.refs.$desc.html(layer.style['background-blend-mode']);
            });
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'click.self $blendList .blend-item',
        value: function clickSelf$blendListBlendItem(e) {
            var item = this.read('/item/current/layer');

            if (!item) return;

            item.style['background-blend-mode'] = e.$delegateTarget.attr('data-mode');

            this.dispatch('/item/set', item, true);
            this.refresh();
        }
    }]);
    return BlendList;
}(BasePropertyItem);

var MixBlendList = function (_BasePropertyItem) {
    inherits(MixBlendList, _BasePropertyItem);

    function MixBlendList() {
        classCallCheck(this, MixBlendList);
        return possibleConstructorReturn(this, (MixBlendList.__proto__ || Object.getPrototypeOf(MixBlendList)).apply(this, arguments));
    }

    createClass(MixBlendList, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item mix-blend-list\'>\n                <div class=\'title\' ref="$title">Mix Blend - <span class=\'description\' ref="$desc"></span></div>\n                <div class=\'items max-height\'>                    \n                    <div class=\'mix-blend-list blend-list-tab\'>\n                        <div class="blend-list" ref="$mixBlendList"></div>            \n                    </div>   \n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'load $mixBlendList',
        value: function load$mixBlendList() {
            var _this2 = this;

            var list = this.read('/blend/list');
            var item = this.read('/item/current/layer');
            if (!item) {
                return '';
            }

            return '<div>' + list.map(function (blend) {

                var selected = blend == item.style['mix-blend-mode'] ? 'selected' : '';
                return '\n                        <div class=\'blend-item ' + selected + '\' data-mode="' + blend + '">\n                            <div class="blend-item-view-container">\n                                <div class="blend-item-blend-view"  style=\'' + _this2.read('/blend/toStringWithoutDimension', item, '', blend) + '\'></div>\n                                <div class="blend-item-text">' + blend + '</div>\n                            </div>\n                        </div>';
            }).join('') + '</div>';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this3 = this;

            this.load();

            this.read('/item/current/layer', function (layer) {
                _this3.refs.$desc.html(layer.style['mix-blend-mode']);
            });
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'click.self $mixBlendList .blend-item',
        value: function clickSelf$mixBlendListBlendItem(e) {
            var item = this.read('/item/current/layer');

            if (!item) return;

            item.style['mix-blend-mode'] = e.$delegateTarget.attr('data-mode');

            this.dispatch('/item/set', item, true);

            this.refresh();
        }
    }]);
    return MixBlendList;
}(BasePropertyItem);

var FilterList$1 = function (_BasePropertyItem) {
    inherits(FilterList, _BasePropertyItem);

    function FilterList() {
        classCallCheck(this, FilterList);
        return possibleConstructorReturn(this, (FilterList.__proto__ || Object.getPrototypeOf(FilterList)).apply(this, arguments));
    }

    createClass(FilterList, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item filters\'>\n                <div class=\'title\' ref="$title">Filter - <span class=\'description\' ref="$desc"></span></div>\n                <div class=\'items no-padding\'>                    \n                    <div class="filter-list" ref="$filterList">\n                        \n                    </div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'makeInputItem',
        value: function makeInputItem(id, viewObject, dataObject) {

            var value = dataObject.value;

            if (typeof value == 'undefined') {
                value = viewObject.defaultValue;
            }

            if (viewObject.type == 'range') {
                return '\n                <div>\n                    <span class=\'title\'>\n                        <label><input type="checkbox" ' + (dataObject.checked ? 'checked="checked"' : '') + ' data-filter-id="' + id + '" /> ' + viewObject.title + ' </label>\n                    </span>\n                    <span class=\'range\'><input type="range" min="' + viewObject.min + '" max="' + viewObject.max + '" step="' + viewObject.step + '" value="' + value + '" data-filter-id="' + id + '" /></span>\n                    <span class=\'input\'><input type="number" min="' + viewObject.min + '" max="' + viewObject.max + '" step="' + viewObject.step + '" value="' + value + '" data-filter-id="' + id + '"/></span>\n                    <span class=\'unit\'>' + viewObject.unit + '</span>\n                </div>\n            ';
            }

            return '<div>\n\n        </div>';
        }
    }, {
        key: 'load $filterList',
        value: function load$filterList() {
            var _this2 = this;

            var layer = this.read('/item/current/layer');

            if (!layer) return '';

            var defaultFilterList = this.read('/layer/filter/list');
            var filters = this.getFilterList();

            return Object.keys(defaultFilterList).map(function (id) {
                var viewObject = defaultFilterList[id];
                var dataObject = filters[id] || {};

                return '\n                <div class=\'filter-item\' data-filter="' + id + '">\n                    <div class="filter-item-input">\n                        ' + _this2.makeInputItem(id, viewObject, dataObject) + '\n                    </div>\n                </div>';
            });
        }
    }, {
        key: 'refreshFilter',
        value: function refreshFilter(id) {
            var _this3 = this;

            this.read('/item/current/layer', function (layer) {
                var filter = layer.filters[id];

                if (filter) {
                    var $dom = _this3.$el.$('[data-filter=' + id + ']');

                    $dom.$('.input [data-filter-id=' + id + ']').val(filter.value);
                    $dom.$('.range [data-filter-id=' + id + ']').val(filter.value);
                }
            });
            this.refreshFilterList();
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.load();
            this.refreshFilterList();
        }
    }, {
        key: 'refreshFilterList',
        value: function refreshFilterList() {
            var _this4 = this;

            this.read('/item/current/layer', function (layer) {
                _this4.refs.$desc.html(_this4.read('/layer/make/filter', layer.filters));
            });
        }
    }, {
        key: 'getFilterList',
        value: function getFilterList() {

            var layer = this.read('/item/current/layer');

            if (!layer) return [];

            return layer.filters || [];
        }
    }, {
        key: 'click $filterList input[type=checkbox]',
        value: function click$filterListInputTypeCheckbox(e) {
            var _this5 = this;

            var id = e.$delegateTarget.attr('data-filter-id');

            this.read('/item/current/layer', function (layer) {
                if (!layer.filters[id]) {
                    layer.filters[id] = { checked: false };
                }

                layer.filters[id].checked = e.$delegateTarget.el.checked;

                _this5.dispatch('/item/set', layer);
                _this5.refreshFilterList();
            });
        }
    }, {
        key: 'change:input $filterList input[type=range]',
        value: function changeInput$filterListInputTypeRange(e) {
            var _this6 = this;

            var id = e.$delegateTarget.attr('data-filter-id');

            this.read('/item/current/layer', function (layer) {

                if (!layer.filters) {
                    layer.filters = {};
                }

                if (!layer.filters[id]) {
                    layer.filters[id] = {};
                }

                layer.filters[id].value = e.$delegateTarget.val();

                _this6.dispatch('/item/set', layer);
                _this6.refreshFilter(id);
            });
        }
    }, {
        key: 'input $filterList input[type=number]',
        value: function input$filterListInputTypeNumber(e) {
            var _this7 = this;

            var id = e.$delegateTarget.attr('data-filter-id');

            this.read('/item/current/layer', function (layer) {
                layer.filters[id].value = e.$delegateTarget.val();

                if (!layer.filters) {
                    layer.filters = {};
                }

                if (!layer.filters[id]) {
                    layer.filters[id] = {};
                }

                _this7.dispatch('/item/set', layer);
                _this7.refreshFilter(id);
            });
        }
    }]);
    return FilterList;
}(BasePropertyItem);

var BackgroundColor = function (_UIElement) {
    inherits(BackgroundColor, _UIElement);

    function BackgroundColor() {
        classCallCheck(this, BackgroundColor);
        return possibleConstructorReturn(this, (BackgroundColor.__proto__ || Object.getPrototypeOf(BackgroundColor)).apply(this, arguments));
    }

    createClass(BackgroundColor, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'property-item background-color show\'>\n                <div class=\'items\'>            \n                    <div>\n                        <label>Background Color</label>\n                        <div style=\'cursor:pointer;\' ref="$colorview" title="Click me!!">\n                            <span class=\'color\' ref="$color"></span>\n                            <span class=\'color-text\' ref="$colortext"></span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this2 = this;

            this.read('/item/current/layer', function (layer) {
                _this2.refs.$color.css('background-color', layer.style['background-color']);
                _this2.refs.$colortext.text(layer.style['background-color']);
            });
        }
    }, {
        key: 'click $colorview',
        value: function click$colorview() {
            this.emit('toggleLayerColorPicker');
        }
    }]);
    return BackgroundColor;
}(UIElement);

var LayerColorPickerPanel = function (_UIElement) {
    inherits(LayerColorPickerPanel, _UIElement);

    function LayerColorPickerPanel() {
        classCallCheck(this, LayerColorPickerPanel);
        return possibleConstructorReturn(this, (LayerColorPickerPanel.__proto__ || Object.getPrototypeOf(LayerColorPickerPanel)).apply(this, arguments));
    }

    createClass(LayerColorPickerPanel, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-item layer-colorpicker'>\n                <div class='items'>            \n                    <ColorPicker></ColorPicker>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return { ColorPicker: ColorPickerLayer };
        }
    }, {
        key: '@toggleLayerColorPicker',
        value: function toggleLayerColorPicker() {
            this.$el.toggleClass('show');
        }
    }]);
    return LayerColorPickerPanel;
}(UIElement);

// import BackgroundRepeat from "./BackgroundRepeat";
var items = {
    BackgroundColor: BackgroundColor,
    BlendList: BlendList,
    MixBlendList: MixBlendList,
    FilterList: FilterList$1,
    PageExport: PageExport,
    PageSize: PageSize,
    PageName: PageName,
    // BackgroundRepeat,
    BackgroundSize: BackgroundSize,
    Transform3d: Transform3d,
    Transform: Transform,
    ColorSampleList: ColorSampleList,
    ImageTypeSelect: ImageTypeSelect,
    LayerColorPickerPanel: LayerColorPickerPanel,
    ColorPickerPanel: ColorPickerPanel,
    ColorStepsInfo: ColorStepsInfo,
    ColorSteps: ColorSteps,
    Name: Name,
    Size: Size,
    Position: Position,
    Radius: Radius,
    Clip: Clip,
    SampleList: SampleList

};

var LayerView = function (_UIElement) {
    inherits(LayerView, _UIElement);

    function LayerView() {
        classCallCheck(this, LayerView);
        return possibleConstructorReturn(this, (LayerView.__proto__ || Object.getPrototypeOf(LayerView)).apply(this, arguments));
    }

    createClass(LayerView, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-view'>\n                <Name></Name>                \n                <BackgroundColor></BackgroundColor> \n                <LayerColorPickerPanel></LayerColorPickerPanel>                \n                <size></size>\n                <radius></radius>                \n                <transform></transform>\n                <transform3d></transform3d>                \n                <BlendList></BlendList>\n                <MixBlendList></MixBlendList>\n                <FilterList></FilterList>                \n\n            </div> \n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return items;
        }
    }]);
    return LayerView;
}(UIElement);

var LayerMenuTab = function (_BaseTab) {
    inherits(LayerMenuTab, _BaseTab);

    function LayerMenuTab() {
        classCallCheck(this, LayerMenuTab);
        return possibleConstructorReturn(this, (LayerMenuTab.__proto__ || Object.getPrototypeOf(LayerMenuTab)).apply(this, arguments));
    }

    createClass(LayerMenuTab, [{
        key: 'components',
        value: function components() {
            return {
                LayerView: LayerView
            };
        }
    }, {
        key: 'template',
        value: function template() {

            return '\n            <div>\n                <LayerView></LayerView>\n            </div>    \n        ';
        }
    }]);
    return LayerMenuTab;
}(BaseTab);

var ImageView = function (_UIElement) {
    inherits(ImageView, _UIElement);

    function ImageView() {
        classCallCheck(this, ImageView);
        return possibleConstructorReturn(this, (ImageView.__proto__ || Object.getPrototypeOf(ImageView)).apply(this, arguments));
    }

    createClass(ImageView, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-view'>\n                <SampleList></SampleList>                                   \n                <ImageTypeSelect></ImageTypeSelect>            \n                <ColorPickerPanel></ColorPickerPanel>\n                <ColorSteps></ColorSteps>\n                <ColorStepsInfo></ColorStepsInfo>\n            </div>  \n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return items;
        }
    }]);
    return ImageView;
}(UIElement);

var ImageMenuTab = function (_BaseTab) {
    inherits(ImageMenuTab, _BaseTab);

    function ImageMenuTab() {
        classCallCheck(this, ImageMenuTab);
        return possibleConstructorReturn(this, (ImageMenuTab.__proto__ || Object.getPrototypeOf(ImageMenuTab)).apply(this, arguments));
    }

    createClass(ImageMenuTab, [{
        key: 'components',
        value: function components() {
            return {
                ImageView: ImageView
            };
        }
    }, {
        key: 'template',
        value: function template() {

            return '<div>\n                    <ImageView></ImageView>\n            </div>\n        ';
        }
    }]);
    return ImageMenuTab;
}(BaseTab);

var FeatureControl = function (_UIElement) {
    inherits(FeatureControl, _UIElement);

    function FeatureControl() {
        classCallCheck(this, FeatureControl);
        return possibleConstructorReturn(this, (FeatureControl.__proto__ || Object.getPrototypeOf(FeatureControl)).apply(this, arguments));
    }

    createClass(FeatureControl, [{
        key: "template",
        value: function template() {
            return "\n            <div class='feature-control'>\n                <div class='feature layer-feature' data-type='layer'>\n                    <LayerMenuTab></LayerMenuTab>\n                </div>              \n                <div class='feature image-feature' data-type='image'>\n                    <ImageMenuTab></ImageMenuTab>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return {
                LayerMenuTab: LayerMenuTab,
                ImageMenuTab: ImageMenuTab
            };
        }
    }, {
        key: "selectFeature",
        value: function selectFeature() {
            var obj = this.read('/item/current');
            var selectedFeature = this.$el.$('.feature.selected');

            if (selectedFeature) selectedFeature.removeClass('selected');

            var selectType = 'layer';

            if (obj.itemType == 'layer') {
                selectType = 'layer';
            } else if (obj.itemType == 'image') {
                var layer = this.read('/item/current/layer');

                if (layer.selectTime > obj.selectTime) {
                    selectType = 'layer';
                } else {
                    selectType = 'image';
                }
            }

            this.$el.$(".feature[data-type=" + selectType + "]").addClass('selected');
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.selectFeature();
        }
    }]);
    return FeatureControl;
}(UIElement);

var GradientAngle = function (_UIElement) {
    inherits(GradientAngle, _UIElement);

    function GradientAngle() {
        classCallCheck(this, GradientAngle);
        return possibleConstructorReturn(this, (GradientAngle.__proto__ || Object.getPrototypeOf(GradientAngle)).apply(this, arguments));
    }

    createClass(GradientAngle, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'drag-angle-rect\'>\n                <div class="drag-angle" ref="$dragAngle">\n                    <div ref="$angleText" class="angle-text"></div>\n                    <div ref="$dragPointer" class="drag-pointer"></div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {

            if (this.isShow()) {
                this.$el.show();

                this.refreshUI();
            } else {
                this.$el.hide();
            }
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            if (!this.read('/item/is/mode', 'image')) return false;

            var item = this.read('/item/current/image');

            if (!item) return false;

            if (!this.read('/image/type/isLinear', item.type)) {
                return false;
            }

            return this.read('/tool/get', 'guide.angle');
        }
    }, {
        key: 'getCurrentXY',
        value: function getCurrentXY(e, angle, radius, centerX, centerY) {
            return e ? e.xy : getXYInCircle(angle, radius, centerX, centerY);
        }
    }, {
        key: 'getRectangle',
        value: function getRectangle() {
            var width = this.refs.$dragAngle.width();
            var height = this.refs.$dragAngle.height();
            var radius = Math.floor(width / 2 * 0.7);

            var _refs$$dragAngle$offs = this.refs.$dragAngle.offset(),
                left = _refs$$dragAngle$offs.left,
                top = _refs$$dragAngle$offs.top;

            var minX = left;
            var minY = top;
            var centerX = minX + width / 2;
            var centerY = minY + height / 2;

            return { minX: minX, minY: minY, width: width, height: height, radius: radius, centerX: centerX, centerY: centerY };
        }
    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {
            var image = this.read('/item/current/image');
            if (!image) return 0;

            var angle = this.read('/image/angle', image.angle);
            return angle - 90;
        }
    }, {
        key: 'refreshAngleText',
        value: function refreshAngleText(angleText) {
            this.refs.$angleText.text(angleText + ' °');
        }
    }, {
        key: 'refreshUI',
        value: function refreshUI(e) {
            var _getRectangle = this.getRectangle(),
                minX = _getRectangle.minX,
                minY = _getRectangle.minY,
                radius = _getRectangle.radius,
                centerX = _getRectangle.centerX,
                centerY = _getRectangle.centerY;

            var _getCurrentXY = this.getCurrentXY(e, this.getDefaultValue(), radius, centerX, centerY),
                x = _getCurrentXY.x,
                y = _getCurrentXY.y;

            var rx = x - centerX,
                ry = y - centerY,
                angle = caculateAngle(rx, ry);

            {
                var _getCurrentXY2 = this.getCurrentXY(null, angle, radius, centerX, centerY),
                    x = _getCurrentXY2.x,
                    y = _getCurrentXY2.y;
            }

            // set drag pointer position 
            this.refs.$dragPointer.px('left', x - minX);
            this.refs.$dragPointer.px('top', y - minY);

            var lastAngle = Math.round(angle + 90) % 360;

            this.refreshAngleText(lastAngle);

            if (e) {

                this.setAngle(lastAngle);
            }
        }
    }, {
        key: 'setAngle',
        value: function setAngle(angle) {
            var _this2 = this;

            this.read('/item/current/image', function (item) {
                item.angle = angle;

                _this2.dispatch('/item/set', item);
            });
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: '@changeTool',
        value: function changeTool() {
            this.$el.toggle(this.isShow());
        }

        // Event Bindings 

    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.isDown = false;
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            if (this.isDown) {
                this.refreshUI(e);
            }
        }
    }, {
        key: 'pointerstart $drag_pointer',
        value: function pointerstart$drag_pointer(e) {
            e.preventDefault();
            this.isDown = true;
        }
    }, {
        key: 'pointerstart $dragAngle',
        value: function pointerstart$dragAngle(e) {
            this.isDown = true;
            this.refreshUI(e);
        }
    }]);
    return GradientAngle;
}(UIElement);

var DEFINE_POSITIONS = {
    'center': ['center', 'center'],
    'right': ['right', 'center'],
    'top': ['center', 'top'],
    'left': ['left', 'center'],
    'bottom': ['center', 'bottom']
};

var GradientPosition = function (_UIElement) {
    inherits(GradientPosition, _UIElement);

    function GradientPosition() {
        classCallCheck(this, GradientPosition);
        return possibleConstructorReturn(this, (GradientPosition.__proto__ || Object.getPrototypeOf(GradientPosition)).apply(this, arguments));
    }

    createClass(GradientPosition, [{
        key: 'template',
        value: function template() {
            return '\n            <div class="drag-position">\n                <div ref="$dragPointer" class="drag-pointer"></div>\n            </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {

            if (this.isShow()) {
                this.$el.show();
                this.refreshUI();
            } else {
                this.$el.hide();
            }
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            if (!this.read('/item/is/mode', 'image')) return false;

            var item = this.read('/item/current/image');
            if (!item) return false;

            if (!this.read('/image/type/isRadial', item.type)) {
                return false;
            }

            return this.read('/tool/get', 'guide.angle');
        }
    }, {
        key: 'getCurrentXY',
        value: function getCurrentXY(e, position) {

            if (e) {
                var xy = e.xy;

                return [xy.x, xy.y];
            }

            var _getRectangle = this.getRectangle(),
                minX = _getRectangle.minX,
                minY = _getRectangle.minY,
                maxX = _getRectangle.maxX,
                maxY = _getRectangle.maxY,
                width = _getRectangle.width,
                height = _getRectangle.height;

            var p = position;
            if (typeof p == 'string' && DEFINE_POSITIONS[p]) {
                p = DEFINE_POSITIONS[p];
            } else if (typeof p === 'string') {
                p = p.split(' ');
            }

            p = p.map(function (item, index) {
                if (item == 'center') {
                    if (index == 0) {
                        return minX + width / 2;
                    } else if (index == 1) {
                        return minY + height / 2;
                    }
                } else if (item === 'left') {
                    return minX;
                } else if (item === 'right') {
                    return maxX;
                } else if (item === 'top') {
                    return minY;
                } else if (item === 'bottom') {
                    return maxY;
                } else {
                    if (index == 0) {
                        return minX * width * (+item / 100);
                    } else if (index == 1) {
                        return minY * height * (+item / 100);
                    }
                }
            });

            return p;
        }
    }, {
        key: 'getRectangle',
        value: function getRectangle() {
            var width = this.$el.width();
            var height = this.$el.height();
            var minX = this.$el.offsetLeft();
            var minY = this.$el.offsetTop();

            var maxX = minX + width;
            var maxY = minY + height;

            return { minX: minX, minY: minY, maxX: maxX, maxY: maxY, width: width, height: height };
        }
    }, {
        key: 'getDefaultValue',
        value: function getDefaultValue() {

            var item = this.read('/item/current/image');

            if (!item) return '';

            return item.radialPosition || '';
        }
    }, {
        key: 'refreshUI',
        value: function refreshUI(e) {
            var _getRectangle2 = this.getRectangle(),
                minX = _getRectangle2.minX,
                minY = _getRectangle2.minY,
                maxX = _getRectangle2.maxX,
                maxY = _getRectangle2.maxY,
                width = _getRectangle2.width,
                height = _getRectangle2.height;

            var _getCurrentXY = this.getCurrentXY(e, this.getDefaultValue()),
                _getCurrentXY2 = slicedToArray(_getCurrentXY, 2),
                x = _getCurrentXY2[0],
                y = _getCurrentXY2[1];

            x = Math.max(Math.min(maxX, x), minX);
            y = Math.max(Math.min(maxY, y), minY);

            var left = x - minX;
            var top = y - minY;

            this.refs.$dragPointer.px('left', left);
            this.refs.$dragPointer.px('top', top);

            if (e) {

                this.setRadialPosition([Math.floor(left / width * 100) + '%', Math.floor(top / height * 100) + '%']);
            }
        }
    }, {
        key: 'setRadialPosition',
        value: function setRadialPosition(radialPosition) {
            var _this2 = this;

            this.read('/item/current/image', function (image) {
                image.radialPosition = radialPosition;
                _this2.dispatch('/item/set', image);
            });
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: '@changeTool',
        value: function changeTool() {
            this.$el.toggle(this.isShow());
        }

        // Event Bindings 

    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.isDown = false;
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            if (this.isDown) {
                this.refreshUI(e);
            }
        }
    }, {
        key: 'pointerstart $dragPointer',
        value: function pointerstart$dragPointer(e) {
            e.preventDefault();
            this.isDown = true;
        }
    }, {
        key: 'pointerstart $el',
        value: function pointerstart$el(e) {
            this.isDown = true;
            // this.refreshUI(e);        
        }
    }, {
        key: 'dblclick $dragPointer',
        value: function dblclick$dragPointer(e) {
            e.preventDefault();
            this.setRadialPosition('center');
            this.refreshUI();
        }
    }]);
    return GradientPosition;
}(UIElement);

var PredefinedLinearGradientAngle = function (_UIElement) {
    inherits(PredefinedLinearGradientAngle, _UIElement);

    function PredefinedLinearGradientAngle() {
        classCallCheck(this, PredefinedLinearGradientAngle);
        return possibleConstructorReturn(this, (PredefinedLinearGradientAngle.__proto__ || Object.getPrototypeOf(PredefinedLinearGradientAngle)).apply(this, arguments));
    }

    createClass(PredefinedLinearGradientAngle, [{
        key: 'template',
        value: function template() {
            return '\n            <div class="predefined-angluar-group">\n                <button type="button" data-value="to right"></button>                          \n                <button type="button" data-value="to left"></button>                                                  \n                <button type="button" data-value="to top"></button>                            \n                <button type="button" data-value="to bottom"></button>                                        \n                <button type="button" data-value="to top right"></button>                                \n                <button type="button" data-value="to bottom right"></button>                                    \n                <button type="button" data-value="to bottom left"></button>\n                <button type="button" data-value="to top left"></button>\n            </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.$el.toggle(this.isShow());
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            if (!this.read('/item/is/mode', 'image')) return false;
            var image = this.read('/item/current/image');

            if (!image) {
                return false;
            }

            return this.read('/tool/get', 'guide.angle') && this.read('/image/type/isLinear', image.type);
        }
    }, {
        key: 'click.self $el button',
        value: function clickSelf$elButton(e) {
            var _this2 = this;

            this.read('/item/current/image', function (item) {
                item.angle = e.$delegateTarget.attr('data-value');

                _this2.dispatch('/item/set', item);
            });
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: '@changeTool',
        value: function changeTool() {
            this.refresh();
        }
    }]);
    return PredefinedLinearGradientAngle;
}(UIElement);

var PredefinedRadialGradientPosition = function (_UIElement) {
    inherits(PredefinedRadialGradientPosition, _UIElement);

    function PredefinedRadialGradientPosition() {
        classCallCheck(this, PredefinedRadialGradientPosition);
        return possibleConstructorReturn(this, (PredefinedRadialGradientPosition.__proto__ || Object.getPrototypeOf(PredefinedRadialGradientPosition)).apply(this, arguments));
    }

    createClass(PredefinedRadialGradientPosition, [{
        key: 'template',
        value: function template() {
            return ' \n            <div class="predefined-angluar-group radial-position">\n                <button type="button" data-value="top"></button>                          \n                <button type="button" data-value="left"></button>                                                  \n                <button type="button" data-value="bottom"></button>                            \n                <button type="button" data-value="right"></button>                                        \n            </div>\n        ';
        }
    }, {
        key: 'click $el button',
        value: function click$elButton(e) {

            var item = this.read('/item/current/image');

            if (item) {
                item.radialPosition = e.$delegateTarget.attr('data-value');
                this.dispatch('/item/set', item);
            }
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.$el.toggle(this.isShow());
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            if (!this.read('/item/is/mode', 'image')) return false;

            var image = this.read('/item/current/image');

            if (!image) {
                return false;
            }

            return this.read('/tool/get', 'guide.angle') && this.read('/image/type/isRadial', image.type);
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: '@changeTool',
        value: function changeTool() {
            this.refresh();
        }
    }]);
    return PredefinedRadialGradientPosition;
}(UIElement);

var PredefinedPageResizer = function (_UIElement) {
    inherits(PredefinedPageResizer, _UIElement);

    function PredefinedPageResizer() {
        classCallCheck(this, PredefinedPageResizer);
        return possibleConstructorReturn(this, (PredefinedPageResizer.__proto__ || Object.getPrototypeOf(PredefinedPageResizer)).apply(this, arguments));
    }

    createClass(PredefinedPageResizer, [{
        key: 'initialize',
        value: function initialize() {
            get(PredefinedPageResizer.prototype.__proto__ || Object.getPrototypeOf(PredefinedPageResizer.prototype), 'initialize', this).call(this);

            this.$board = this.parent.refs.$board;
            this.$page = this.parent.refs.$page;
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n            <div class="predefined-page-resizer">\n                <button type="button" data-value="to right"></button>\n                <!--<button type="button" data-value="to left"></button>-->\n                <!--<button type="button" data-value="to top"></button>-->\n                <button type="button" data-value="to bottom"></button>\n                <!--<button type="button" data-value="to top right"></button>-->\n                <button type="button" data-value="to bottom right"></button>\n                <!--<button type="button" data-value="to bottom left"></button>-->\n                <!--<button type="button" data-value="to top left"></button>-->\n            </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var isShow = this.isShow();
            this.$el.toggle(isShow);

            if (isShow) {
                this.setPosition();
            }
        }
    }, {
        key: 'setPosition',
        value: function setPosition() {
            var page = this.read('/item/current/page');

            if (!page) return;

            var style = page.style;

            var width = style.width;
            var height = style.height;

            var boardOffset = this.$board.offset();
            var pageOffset = this.$page.offset();

            var x = pageOffset.left - boardOffset.left + 'px';
            var y = pageOffset.top - boardOffset.top + 'px';

            this.$el.css({
                width: width, height: height,
                left: x, top: y
            });
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            return this.read('/item/is/mode', 'page');
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'change',
        value: function change() {
            var style1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var style2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            var style = Object.assign({}, style1, style2);

            Object.keys(style).forEach(function (key) {
                style[key] = style[key] + 'px';
            });

            var page = this.read('/item/current/page');
            page.style = Object.assign(page.style, style);
            this.dispatch('/item/set', page);
            this.refresh();
        }
    }, {
        key: 'changeX',
        value: function changeX(dx) {
            var width = this.width + dx;

            this.change({ width: width + 'px' });
        }
    }, {
        key: 'changeY',
        value: function changeY(dy) {
            var height = this.height + dy;

            this.change({ height: height + 'px' });
        }
    }, {
        key: 'changeXY',
        value: function changeXY(dx, dy) {
            var width = this.width + dx;
            var height = this.height + dy;

            this.change({ width: width + 'px', height: height + 'px' });
        }
    }, {
        key: 'toTop',
        value: function toTop() {
            var dy = this.xy.y - this.targetXY.y;
            var height = this.height + dy;

            return { height: height };
        }
    }, {
        key: 'toBottom',
        value: function toBottom() {
            var dy = this.targetXY.y - this.xy.y;
            var height = this.height + dy * 2;

            return { height: height };
        }
    }, {
        key: 'toRight',
        value: function toRight() {
            var dx = this.targetXY.x - this.xy.x;
            var width = this.width + dx * 2;

            return { width: width };
        }
    }, {
        key: 'toLeft',
        value: function toLeft() {
            var dx = this.xy.x - this.targetXY.x;
            var width = this.width + dx;

            return { width: width };
        }
    }, {
        key: 'resize',
        value: function resize() {

            if (this.currentType == 'to top') {
                this.change(this.toTop());
            } else if (this.currentType == 'to bottom') {
                this.change(this.toBottom());
            } else if (this.currentType == 'to right') {
                this.change(this.toRight());
            } else if (this.currentType == 'to left') {
                this.change(this.toLeft());
            } else if (this.currentType == 'to bottom left') {
                this.change(this.toBottom(), this.toLeft());
            } else if (this.currentType == 'to bottom right') {
                this.change(this.toBottom(), this.toRight());
            } else if (this.currentType == 'to top right') {
                this.change(this.toTop(), this.toRight());
            } else if (this.currentType == 'to top left') {
                this.change(this.toTop(), this.toLeft());
            }
        }
    }, {
        key: 'pointerstart $el [data-value]',
        value: function pointerstart$elDataValue(e) {
            var type = e.$delegateTarget.attr('data-value');
            this.currentType = type;
            this.xy = e.xy;
            this.page = this.read('/item/current/page');
            this.width = parseParamNumber$2(this.page.style.width);
            this.height = parseParamNumber$2(this.page.style.height);
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            if (this.xy) {
                this.targetXY = e.xy;

                this.resize();
            }
        }
    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.currentType = null;
            this.xy = null;
        }
    }]);
    return PredefinedPageResizer;
}(UIElement);

var TopLeftRadius = function (_UIElement) {
    inherits(TopLeftRadius, _UIElement);

    function TopLeftRadius() {
        classCallCheck(this, TopLeftRadius);
        return possibleConstructorReturn(this, (TopLeftRadius.__proto__ || Object.getPrototypeOf(TopLeftRadius)).apply(this, arguments));
    }

    createClass(TopLeftRadius, [{
        key: 'initialize',
        value: function initialize() {
            get(TopLeftRadius.prototype.__proto__ || Object.getPrototypeOf(TopLeftRadius.prototype), 'initialize', this).call(this);

            this.radiusKey = 'border-top-left-radius';
        }
    }, {
        key: 'template',
        value: function template() {
            return '<button type=\'button\' data-value=\'radius top left\'></button>';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var isShow = this.isShow();

            this.$el.toggle(isShow);
            if (isShow) {
                this.setPosition();
            }
        }
    }, {
        key: 'setPosition',
        value: function setPosition() {
            var layer = this.read('/item/current/layer');

            if (!layer) return;

            var width = layer.style.width;
            var height = layer.style.height;
            var x = layer.style.x;
            var y = layer.style.y;

            this.setRadiusPosition(x, y, width, height, layer);
        }
    }, {
        key: 'setRadiusPosition',
        value: function setRadiusPosition(x, y, width, height, layer) {

            var radius = layer.style[this.radiusKey] || '0px';
            this.$el.css('left', radius);
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            var layer = this.read('/item/current/layer');
            if (!layer) return false;

            if (layer.fixedRadius) return false;
            return this.read('/item/is/mode', 'layer', 'image');
        }
    }, {
        key: 'getRealRadius',
        value: function getRealRadius(radius, dx) {
            var minX = 0;
            var maxX = this.layerWidth;

            return Math.max(Math.min(maxX, radius + dx), minX);
        }
    }, {
        key: 'resize',
        value: function resize() {

            var dx = this.targetXY.x - this.xy.x;

            //        console.log(dx);

            var radius = this.getRealRadius(this.layerRadius, dx);
            this.layer.style[this.radiusKey] = radius + 'px';

            this.dispatch('/item/set', this.layer);
            this.refresh();
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'pointerstart',
        value: function pointerstart(e) {

            var layer = this.read('/item/current/layer');

            if (!layer) return;

            this.xy = e.xy;
            this.layer = layer;

            this.layerRadius = +(layer.style[this.radiusKey] || '0px').replace('px', '');

            this.layerWidth = +this.layer.style.width.replace('px', '');
            this.layerHeight = +this.layer.style.height.replace('px', '');
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            if (this.xy) {
                this.targetXY = e.xy;

                this.resize();
            }
        }
    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.xy = null;
            this.moveX = null;
            this.moveY = null;
        }
    }]);
    return TopLeftRadius;
}(UIElement);

var TopRightRadius = function (_TopLeftRadius) {
    inherits(TopRightRadius, _TopLeftRadius);

    function TopRightRadius() {
        classCallCheck(this, TopRightRadius);
        return possibleConstructorReturn(this, (TopRightRadius.__proto__ || Object.getPrototypeOf(TopRightRadius)).apply(this, arguments));
    }

    createClass(TopRightRadius, [{
        key: 'initialize',
        value: function initialize() {
            get(TopRightRadius.prototype.__proto__ || Object.getPrototypeOf(TopRightRadius.prototype), 'initialize', this).call(this);

            this.radiusKey = 'border-top-right-radius';
        }
    }, {
        key: 'template',
        value: function template() {
            return '<button type=\'button\' data-value=\'radius top right\'></button>';
        }
    }, {
        key: 'setRadiusPosition',
        value: function setRadiusPosition(x, y, width, height, layer) {
            var radius = layer.style[this.radiusKey] || '0px';
            this.$el.css('right', radius);
        }
    }, {
        key: 'getRealRadius',
        value: function getRealRadius(radius, dx) {
            var minX = 0;
            var maxX = this.layerWidth;

            return Math.max(Math.min(maxX, radius - dx), minX);
        }
    }]);
    return TopRightRadius;
}(TopLeftRadius);

var BottomLeftRadius = function (_TopLeftRadius) {
    inherits(BottomLeftRadius, _TopLeftRadius);

    function BottomLeftRadius() {
        classCallCheck(this, BottomLeftRadius);
        return possibleConstructorReturn(this, (BottomLeftRadius.__proto__ || Object.getPrototypeOf(BottomLeftRadius)).apply(this, arguments));
    }

    createClass(BottomLeftRadius, [{
        key: 'initialize',
        value: function initialize() {
            get(BottomLeftRadius.prototype.__proto__ || Object.getPrototypeOf(BottomLeftRadius.prototype), 'initialize', this).call(this);

            this.radiusKey = 'border-bottom-left-radius';
        }
    }, {
        key: 'template',
        value: function template() {
            return '<button type=\'button\' data-value=\'radius bottom left\'></button>';
        }
    }]);
    return BottomLeftRadius;
}(TopLeftRadius);

var BottomRightRadius = function (_TopRightRadius) {
    inherits(BottomRightRadius, _TopRightRadius);

    function BottomRightRadius() {
        classCallCheck(this, BottomRightRadius);
        return possibleConstructorReturn(this, (BottomRightRadius.__proto__ || Object.getPrototypeOf(BottomRightRadius)).apply(this, arguments));
    }

    createClass(BottomRightRadius, [{
        key: "initialize",
        value: function initialize() {
            get(BottomRightRadius.prototype.__proto__ || Object.getPrototypeOf(BottomRightRadius.prototype), "initialize", this).call(this);

            this.radiusKey = 'border-bottom-right-radius';
        }
    }, {
        key: "template",
        value: function template() {
            return "<button type='button' data-value='radius bottom right'></button>";
        }
    }]);
    return BottomRightRadius;
}(TopRightRadius);

var LayerRotate = function (_UIElement) {
    inherits(LayerRotate, _UIElement);

    function LayerRotate() {
        classCallCheck(this, LayerRotate);
        return possibleConstructorReturn(this, (LayerRotate.__proto__ || Object.getPrototypeOf(LayerRotate)).apply(this, arguments));
    }

    createClass(LayerRotate, [{
        key: 'initialize',
        value: function initialize() {
            get(LayerRotate.prototype.__proto__ || Object.getPrototypeOf(LayerRotate.prototype), 'initialize', this).call(this);

            this.$board = this.parent.$board;
            this.$page = this.parent.$page;
        }
    }, {
        key: 'template',
        value: function template() {
            return '<button type=\'button\' data-value=\'layer rotate\'></button>';
        }
    }, {
        key: 'resize',
        value: function resize() {

            var angle = caculateAngle(this.targetXY.x - this.layerCenterX, this.targetXY.y - this.layerCenterY);

            this.layer.style.rotate = Math.floor(angle) - 270;

            this.dispatch('/item/set', this.layer);
        }
    }, {
        key: 'pointerstart',
        value: function pointerstart(e) {

            var layer = this.read('/item/current/layer');

            if (!layer) return;

            this.xy = e.xy;
            this.layer = layer;

            this.$dom = this.read('/item/dom', layer.id);

            if (this.$dom) {
                var rect = this.$dom.rect();
                this.layerCenterX = rect.left + rect.width / 2;
                this.layerCenterY = rect.top + rect.height / 2;
            }
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            if (this.xy) {
                this.targetXY = e.xy;

                this.resize();
            }
        }
    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.xy = null;
            this.moveX = null;
            this.moveY = null;
        }
    }]);
    return LayerRotate;
}(UIElement);

var Radius$2 = function (_TopLeftRadius) {
    inherits(Radius, _TopLeftRadius);

    function Radius() {
        classCallCheck(this, Radius);
        return possibleConstructorReturn(this, (Radius.__proto__ || Object.getPrototypeOf(Radius)).apply(this, arguments));
    }

    createClass(Radius, [{
        key: 'initialize',
        value: function initialize() {
            get(Radius.prototype.__proto__ || Object.getPrototypeOf(Radius.prototype), 'initialize', this).call(this);

            this.radiusKey = 'border-radius';
        }
    }, {
        key: 'template',
        value: function template() {
            return '<button type=\'button\' data-value=\'radius\'></button>';
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            var layer = this.read('/item/current/layer');
            if (!layer) return false;

            return !!layer.fixedRadius;
        }
    }]);
    return Radius;
}(TopLeftRadius);

var PredefinedLayerResizer = function (_UIElement) {
    inherits(PredefinedLayerResizer, _UIElement);

    function PredefinedLayerResizer() {
        classCallCheck(this, PredefinedLayerResizer);
        return possibleConstructorReturn(this, (PredefinedLayerResizer.__proto__ || Object.getPrototypeOf(PredefinedLayerResizer)).apply(this, arguments));
    }

    createClass(PredefinedLayerResizer, [{
        key: 'initialize',
        value: function initialize() {
            get(PredefinedLayerResizer.prototype.__proto__ || Object.getPrototypeOf(PredefinedLayerResizer.prototype), 'initialize', this).call(this);

            this.$board = this.parent.refs.$board;
            this.$page = this.parent.refs.$page;
        }
    }, {
        key: 'components',
        value: function components() {
            return { TopLeftRadius: TopLeftRadius, TopRightRadius: TopRightRadius, BottomLeftRadius: BottomLeftRadius, BottomRightRadius: BottomRightRadius, LayerRotate: LayerRotate, Radius: Radius$2 };
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n            <div class="predefined-layer-resizer">\n                <div class=\'button-group\' ref=\'$buttonGroup\'>\n                    <button type="button" data-value="to right"></button>\n                    <button type="button" data-value="to left"></button>\n                    <button type="button" data-value="to top"></button>\n                    <button type="button" data-value="to bottom"></button>\n                    <button type="button" data-value="to top right"></button>\n                    <button type="button" data-value="to bottom right"></button>\n                    <button type="button" data-value="to bottom left"></button>\n                    <button type="button" data-value="to top left"></button>\n                </div>\n\n                <Radius></Radius>\n                <TopLeftRadius></TopLeftRadius>\n                <TopRightRadius></TopRightRadius>\n                <BottomLeftRadius></BottomLeftRadius>\n                <BottomRightRadius></BottomRightRadius>\n\n                <LayerRotate></LayerRotate>\n\n                <div class="guide-horizontal"></div>\n                <div class="guide-vertical"></div>\n            </div>\n        ';
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var isShow = this.isShow();
            this.$el.toggle(isShow);

            if (isShow) {
                this.setPosition();
            }
        }
    }, {
        key: 'caculatePosition',
        value: function caculatePosition(list, key, align) {
            var unit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'px';


            var valueList = list.filter(function (it) {
                return it.align == align;
            }).map(function (it) {
                return it[key];
            });

            if (valueList.length) {
                return Math.max.apply(Math, [Number.MIN_SAFE_INTEGER].concat(toConsumableArray(valueList))) + unit;
            }

            return undefined;
        }
    }, {
        key: 'setPosition',
        value: function setPosition() {
            var layer = this.read('/item/current/layer');

            if (!layer) return;

            var style = layer.style;

            var width = style.width;
            var height = style.height;
            var x = style.x;
            var y = style.y;

            var boardOffset = this.$board.offset();
            var pageOffset = this.$page.offset();

            x = parseParamNumber$1(x, function (x) {
                return x + pageOffset.left - boardOffset.left;
            }) + 'px';
            y = parseParamNumber$1(y, function (y) {
                return y + pageOffset.top - boardOffset.top;
            }) + 'px';

            this.$el.css({
                width: width, height: height,
                left: x, top: y,
                transform: this.read('/layer/make/transform', layer)
            });

            var rotate = layer.style.rotate || 0;

            if (rotate == 0) {
                this.refs.$buttonGroup.show();
            } else {
                this.refs.$buttonGroup.hide();
            }
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            return this.read('/item/is/mode', 'layer');
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'caculateRightSize',
        value: function caculateRightSize(item, list) {
            var x = this.caculatePosition(list, 'x', 'right');

            if (typeof x != 'undefined') {
                var newWidth = Math.abs(this.moveX - parseParamNumber$1(x));
                item.style.width = newWidth + 'px';
            }
        }
    }, {
        key: 'caculateLeftSize',
        value: function caculateLeftSize(item, list) {
            var x = this.caculatePosition(list, 'x', 'left');

            if (typeof x != 'undefined') {
                var newWidth = this.width + (this.moveX - parseParamNumber$1(x));

                item.style.x = x;
                item.style.width = newWidth + 'px';
            }
        }
    }, {
        key: 'caculateBottomSize',
        value: function caculateBottomSize(item, list) {
            var y = this.caculatePosition(list, 'y', 'bottom');

            if (typeof y != 'undefined') {
                var newHeight = Math.abs(this.moveY - parseParamNumber$1(y));
                item.style.height = newHeight + 'px';
            }
        }
    }, {
        key: 'caculateTopSize',
        value: function caculateTopSize(item, list) {
            var y = this.caculatePosition(list, 'y', 'top');

            if (typeof y != 'undefined') {
                var newHeight = this.height + (this.moveY - parseParamNumber$1(y));

                item.style.y = y;
                item.style.height = newHeight + 'px';
            }
        }
    }, {
        key: 'resizeItem',
        value: function resizeItem(item, list) {
            if (this.currentType == 'to right') {
                // 오른쪽 왼쪽 크기를 맞추기 
                this.caculateRightSize(item, list);
            } else if (this.currentType == 'to bottom') {
                // 아래위 크기 맞추기 
                this.caculateBottomSize(item, list);
            } else if (this.currentType == 'to bottom left') {
                // 아래위 크기 맞추기 
                this.caculateBottomSize(item, list);
                this.caculateLeftSize(item, list);
            } else if (this.currentType == 'to bottom right') {
                // 아래위 크기 맞추기 
                this.caculateBottomSize(item, list);
                this.caculateRightSize(item, list);
            } else if (this.currentType == 'to left') {
                this.caculateLeftSize(item, list);
            } else if (this.currentType == 'to top') {
                this.caculateTopSize(item, list);
            } else if (this.currentType == 'to top right') {
                this.caculateTopSize(item, list);
                this.caculateRightSize(item, list);
            } else if (this.currentType == 'to top left') {
                this.caculateTopSize(item, list);
                this.caculateLeftSize(item, list);
            }
        }
    }, {
        key: 'caculateSnap',
        value: function caculateSnap(item) {

            var list = this.read('/guide/line/layer', 3);

            if (list.length) {
                this.resizeItem(item, list);
            }

            return item;
        }
    }, {
        key: 'change',
        value: function change() {
            var style1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var style2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            var style = Object.assign({}, style1, style2);

            Object.keys(style).forEach(function (key) {
                style[key] = style[key] + 'px';
            });

            var item = this.read('/item/current/layer');

            item.style = Object.assign(item.style, style);

            item = this.caculateSnap(item);

            this.dispatch('/item/set', item);
            this.setPosition();
        }
    }, {
        key: 'toRight',
        value: function toRight() {
            var dx = this.targetXY.x - this.xy.x;

            if (dx < 0 && Math.abs(dx) > this.width) {
                var width = Math.abs(dx) - this.width;
                var x = this.moveX - width;
                return { x: x, width: width };
            } else {
                var width = this.width + dx;
                return { width: width };
            }
        }
    }, {
        key: 'toLeft',
        value: function toLeft() {
            // top + height 
            var dx = this.xy.x - this.targetXY.x;
            var x = this.moveX - dx;
            var width = this.width + dx;

            if (dx < 0 && Math.abs(dx) > this.width) {
                var width = Math.abs(dx) - this.width;
                var x = this.moveX + this.width;
                return { x: x, width: width };
            } else {
                var x = this.moveX - dx;
                var width = this.width + dx;
                return { x: x, width: width };
            }
        }
    }, {
        key: 'toBottom',
        value: function toBottom() {
            var dy = this.targetXY.y - this.xy.y;

            if (dy < 0 && Math.abs(dy) > this.height) {
                var height = Math.abs(dy) - this.height;
                var y = this.moveY - height;
                return { y: y, height: height };
            } else {
                var height = this.height + dy;
                return { height: height };
            }
        }
    }, {
        key: 'toTop',
        value: function toTop() {
            var dy = this.xy.y - this.targetXY.y;

            if (dy < 0 && Math.abs(dy) > this.height) {
                var height = Math.abs(dy) - this.height;
                var y = this.moveY + this.height;

                return { y: y, height: height };
            } else {
                var y = this.moveY - dy;
                var height = this.height + dy;

                return { y: y, height: height };
            }
        }
    }, {
        key: 'resize',
        value: function resize() {

            if (this.currentType == 'to top') {
                this.change(this.toTop());
            } else if (this.currentType == 'to bottom') {
                this.change(this.toBottom());
            } else if (this.currentType == 'to right') {
                this.change(this.toRight());
            } else if (this.currentType == 'to left') {
                this.change(this.toLeft());
            } else if (this.currentType == 'to bottom left') {
                this.change(this.toBottom(), this.toLeft());
            } else if (this.currentType == 'to bottom right') {
                this.change(this.toBottom(), this.toRight());
            } else if (this.currentType == 'to top right') {
                this.change(this.toTop(), this.toRight());
            } else if (this.currentType == 'to top left') {
                this.change(this.toTop(), this.toLeft());
            }
        }
    }, {
        key: 'pointerstart $el [data-value]',
        value: function pointerstart$elDataValue(e) {

            var layer = this.read('/item/current/layer');

            if (!layer) return;

            var type = e.$delegateTarget.attr('data-value');
            this.currentType = type;
            this.xy = e.xy;
            this.layer = layer;
            this.width = parseParamNumber$1(layer.style.width);
            this.height = parseParamNumber$1(layer.style.height);
            this.moveX = parseParamNumber$1(layer.style.x);
            this.moveY = parseParamNumber$1(layer.style.y);
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            if (this.xy) {
                this.targetXY = e.xy;
                this.$page.addClass('moving');

                this.resize();
            }
        }
    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            this.currentType = null;
            this.xy = null;
            this.moveX = null;
            this.moveY = null;
            this.$page.removeClass('moving');
        }
    }]);
    return PredefinedLayerResizer;
}(UIElement);

var MoveGuide = function (_UIElement) {
    inherits(MoveGuide, _UIElement);

    function MoveGuide() {
        classCallCheck(this, MoveGuide);
        return possibleConstructorReturn(this, (MoveGuide.__proto__ || Object.getPrototypeOf(MoveGuide)).apply(this, arguments));
    }

    createClass(MoveGuide, [{
        key: 'initialize',
        value: function initialize() {
            get(MoveGuide.prototype.__proto__ || Object.getPrototypeOf(MoveGuide.prototype), 'initialize', this).call(this);

            this.$board = this.parent.refs.$board;
            this.$page = this.parent.refs.$page;
        }
    }, {
        key: 'template',
        value: function template() {
            return '\n            <div class="move-guide">\n\n            </div>\n        ';
        }
    }, {
        key: 'load $el',
        value: function load$el() {
            var list = this.read('/guide/line/layer');

            var bo = this.$board.offset();
            var po = this.$page.offset();

            var top = po.top - bo.top + this.$board.scrollTop();
            var left = po.left - bo.left + this.$board.scrollLeft();

            // console.log(top, left, bo, po);

            return list.map(function (axis) {
                if (axis.type == '-') {
                    return '<div class=\'line\' style=\'left: 0px; top: ' + (axis.y + top) + 'px; right: 0px; height: 1px;\'></div>';
                } else {
                    return '<div class=\'line\' style=\'left: ' + (axis.x + left) + 'px; top: 0px; bottom: 0px; width: 1px;\'></div>';
                }
            });
        }
    }, {
        key: 'refresh',
        value: function refresh() {

            var isShow = this.isShow();

            this.$el.toggle(isShow);
            if (isShow) {
                this.load();
            }
        }
    }, {
        key: 'isShow',
        value: function isShow() {
            return this.$page.hasClass('moving');
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }]);
    return MoveGuide;
}(UIElement);

var SubFeatureControl = function (_UIElement) {
    inherits(SubFeatureControl, _UIElement);

    function SubFeatureControl() {
        classCallCheck(this, SubFeatureControl);
        return possibleConstructorReturn(this, (SubFeatureControl.__proto__ || Object.getPrototypeOf(SubFeatureControl)).apply(this, arguments));
    }

    createClass(SubFeatureControl, [{
        key: "template",
        value: function template() {
            return "\n            <div class='sub-feature-control'>         \n                <div class='feature'>\n                    <div class=\"property-view\">\n                        <BackgroundSize></BackgroundSize>\n                    </div>\n                    <div class=\"property-view\" ref=\"$linear\">\n                        <PredefinedLinearGradientAngle></PredefinedLinearGradientAngle>\n                        <GradientAngle></GradientAngle>                            \n                    </div>\n                    <div class=\"property-view\" ref=\"$radial\">\n                        <PredefinedRadialGradientAngle></PredefinedRadialGradientAngle>                    \n                        <PredefinedRadialGradientPosition></PredefinedRadialGradientPosition>\n                        <GradientPosition></GradientPosition>\n                    </div>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return _extends({
                PredefinedRadialGradientAngle: PredefinedRadialGradientAngle,
                GradientAngle: GradientAngle,
                GradientPosition: GradientPosition,
                PredefinedLinearGradientAngle: PredefinedLinearGradientAngle,
                PredefinedRadialGradientPosition: PredefinedRadialGradientPosition
            }, items);
        }
    }, {
        key: "refresh",
        value: function refresh() {
            this.$el.toggle(this.isShow());
            this.refs.$linear.toggleClass('hide', !this.isLinearShow());
            this.refs.$radial.toggleClass('hide', !this.isRadialShow());
        }
    }, {
        key: "isShow",
        value: function isShow() {
            if (!this.read('/item/is/mode', 'image')) return false;
            var image = this.read('/item/current/image');

            if (!image) {
                return false;
            }

            return true;
        }
    }, {
        key: "isLinearShow",
        value: function isLinearShow() {
            if (!this.read('/item/is/mode', 'image')) return false;

            var item = this.read('/item/current/image');

            if (!item) return false;

            if (!this.read('/image/type/isLinear', item.type)) {
                return false;
            }

            return this.read('/tool/get', 'guide.angle');
        }
    }, {
        key: "isRadialShow",
        value: function isRadialShow() {
            if (!this.read('/item/is/mode', 'image')) return false;

            var item = this.read('/item/current/image');
            if (!item) return false;

            if (!this.read('/image/type/isRadial', item.type)) {
                return false;
            }

            return this.read('/tool/get', 'guide.angle');
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }]);
    return SubFeatureControl;
}(UIElement);

var GradientView = function (_BaseTab) {
    inherits(GradientView, _BaseTab);

    function GradientView() {
        classCallCheck(this, GradientView);
        return possibleConstructorReturn(this, (GradientView.__proto__ || Object.getPrototypeOf(GradientView)).apply(this, arguments));
    }

    createClass(GradientView, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'page-view\'>\n                <div class=\'page-content\' ref="$board">\n                    <div class="page-canvas">\n                        <div class="gradient-color-view-container" ref="$page">\n                            <div class="gradient-color-view" ref="$colorview"></div>            \n\n                        </div>       \n                        <PredefinedPageResizer></PredefinedPageResizer>\n                        <PredefinedLayerResizer></PredefinedLayerResizer>                        \n                        <MoveGuide></MoveGuide>                          \n                    </div>          \n                </div>\n \n                <SubFeatureControl></SubFeatureControl>\n            </div>\n        ';
        }
    }, {
        key: 'components',
        value: function components() {
            return {
                SubFeatureControl: SubFeatureControl,
                MoveGuide: MoveGuide,
                PredefinedPageResizer: PredefinedPageResizer,
                PredefinedLayerResizer: PredefinedLayerResizer
            };
        }
    }, {
        key: 'load $colorview',
        value: function load$colorview() {
            var _this2 = this;

            var page = this.read('/item/current/page');

            if (!page) {
                return '';
            }

            var editMode = this.read('/item/get/editMode');

            return this.read('/item/map/children', page.id, function (item, index) {

                switch (editMode) {
                    case EDITOR_MODE_IMAGE_IMAGE:
                    case EDITOR_MODE_IMAGE_LINEAR:
                    case EDITOR_MODE_IMAGE_RADIAL:
                    case EDITOR_MODE_IMAGE_STATIC:

                        var image = _this2.read('/item/current/image');

                        if (image.parentId == item.id) {
                            return '<div class=\'layer\' item-layer-id="' + item.id + '" title="' + (index + 1) + '. ' + (item.name || 'Layer') + '" style=\'' + _this2.read('/layer/toString', item, true, image) + '\'></div>';
                        }
                }

                return '<div class=\'layer\' item-layer-id="' + item.id + '" title="' + (index + 1) + '. ' + (item.name || 'Layer') + '" style=\'' + _this2.read('/layer/toString', item, true) + '\'></div>';
            });
        }
    }, {
        key: 'refresh',
        value: function refresh(isDrag) {
            this.setBackgroundColor();
            this.load();

            
        }
    }, {
        key: 'makePageCSS',
        value: function makePageCSS(page) {
            return Object.assign({
                overflow: page.clip ? 'hidden' : ''
            }, page.style || {});
        }
    }, {
        key: 'setBackgroundColor',
        value: function setBackgroundColor() {

            var page = this.read('/item/current/page');
            this.refs.$page.css(this.makePageCSS(page));

            var item = this.read('/item/current/page');

            this.refs.$page.toggle(item);

            if (item) {
                if (item.itemType == 'page') {
                    var list = this.read('/item/list/children', item.id);
                    this.refs.$colorview.toggle(list.length);
                }
            }
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: '@changeTool',
        value: function changeTool() {
            this.refresh();
        }
    }, {
        key: 'checkPage',
        value: function checkPage(e) {
            return e.target == this.refs.$colorview.el;
        }
    }, {
        key: 'click.self $page .layer',
        value: function clickSelf$pageLayer(e) {
            var id = e.$delegateTarget.attr('item-layer-id');
            if (id) {
                this.run('/item/select/mode', 'layer');
                this.dispatch('/item/select', id);
            }
        }
    }, {
        key: 'selectPageMode',
        value: function selectPageMode() {
            this.dispatch('/item/select/mode', 'page');
        }
    }, {
        key: 'click $page',
        value: function click$page(e) {
            if (!e.$delegateTarget) {
                this.selectPageMode();
            } else if (!e.$delegateTarget.hasClass('layer')) {
                this.selectPageMode();
            }
        }
    }, {
        key: 'click.self $el .page-canvas',
        value: function clickSelf$elPageCanvas(e) {
            this.selectPageMode();
        }
    }, {
        key: 'click $colorview',
        value: function click$colorview(e) {
            var _this3 = this;

            this.read('/item/current/layer', function (layer) {
                _this3.dispatch('/item/select', layer.id);
                _this3.refresh();
            });
        }
    }, {
        key: 'pointerstart $page .layer',
        value: function pointerstart$pageLayer(e) {
            this.isDown = true;
            this.xy = e.xy;
            this.$layer = e.$delegateTarget;
            this.layer = this.read('/item/get', e.$delegateTarget.attr('item-layer-id'));
            this.moveX = +(this.layer.style.x || 0).replace('px', '');
            this.moveY = +(this.layer.style.y || 0).replace('px', '');

            this.dispatch('/item/select', this.layer.id);
        }
    }, {
        key: 'updatePosition',
        value: function updatePosition() {
            var style1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var style2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var style = Object.assign({}, style1, style2);

            Object.keys(style).forEach(function (key) {
                style[key] = style[key] + 'px';
            });

            var item = this.layer;
            item.style = Object.assign(item.style, style);

            var list = this.read('/guide/snap/layer', item, 3);

            if (list.length) {
                var _list = slicedToArray(list, 2),
                    x = _list[0],
                    y = _list[1];

                if (typeof x != 'undefined') {
                    item.style.x = x + 'px';
                }

                if (typeof y != 'undefined') {
                    item.style.y = y + 'px';
                }
            }

            this.$layer.css({
                left: item.style.x,
                top: item.style.y
            });
            this.dispatch('/item/set', item);
            this.refresh(true);
        }
    }, {
        key: 'moveXY',
        value: function moveXY(dx, dy) {
            var x = this.moveX + dx;
            var y = this.moveY + dy;

            this.updatePosition({ x: x, y: y });
        }
    }, {
        key: 'pointermove document',
        value: function pointermoveDocument(e) {
            if (this.isDown) {
                this.refs.$page.addClass('moving');
                this.targetXY = e.xy;

                this.moveXY(this.targetXY.x - this.xy.x, this.targetXY.y - this.xy.y);
            }
        }
    }, {
        key: 'pointerend document',
        value: function pointerendDocument(e) {
            if (this.isDown) {
                this.isDown = false;
                this.layer = null;
                this.refs.$page.removeClass('moving');
            }
        }
    }]);
    return GradientView;
}(BaseTab);

var LayerList = function (_UIElement) {
    inherits(LayerList, _UIElement);

    function LayerList() {
        classCallCheck(this, LayerList);
        return possibleConstructorReturn(this, (LayerList.__proto__ || Object.getPrototypeOf(LayerList)).apply(this, arguments));
    }

    createClass(LayerList, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'layers\'>\n                <div class=\'title\'> \n                    <h1>Layers</h1>\n                    <div class="tools">\n                        <button type="button" class=\'add-layer\' ref="$addLayer">+</button>\n                    </div>\n                </div>             \n                <div class="layer-list" ref="$layerList"></div>\n            </div>\n        ';
        }
    }, {
        key: 'makeItemNode',
        value: function makeItemNode(node, index) {
            var item = this.read('/item/get', node.id);

            var layer = this.read('/item/current/layer');

            var selectedId = '';
            if (layer) selectedId = layer.id;

            if (item.itemType == 'layer') {
                return this.makeItemNodeLayer(item, selectedId, index);
            }
        }
    }, {
        key: 'makeItemNodeLayer',
        value: function makeItemNodeLayer(item, selectedId) {
            var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            var selected = item.id == selectedId ? 'selected' : '';
            return '\n            <div class=\'tree-item ' + selected + '\' id="' + item.id + '" type=\'layer\' draggable="true">\n                <div class="item-view-container">\n                    <div class="item-view"  style=\'' + this.read('/layer/toString', item, false) + '\'></div>\n                </div>\n                <div class="item-title"> \n                    ' + (index + 1) + '. ' + (item.name || 'Layer ') + ' \n                    <button type="button" class=\'delete-item\' item-id=\'' + item.id + '\' title="Remove">&times;</button>\n                </div>\n                <div class=\'item-tools\'>\n                    <button type="button" class=\'copy-item\' item-id=\'' + item.id + '\' title="Copy">+</button>\n                </div>                            \n            </div>\n            ';
        }
    }, {
        key: 'load $layerList',
        value: function load$layerList() {
            var _this2 = this;

            var page = this.read('/item/current/page');

            if (!page) {
                return '';
            }

            return this.read('/item/map/children', page.id, function (item, index) {
                return _this2.makeItemNode(item, index);
            });
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.load();
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'click $addLayer',
        value: function click$addLayer(e) {
            var _this3 = this;

            this.read('/item/current/page', function (page) {
                _this3.dispatch('/item/add', 'layer', true, page.id);
                _this3.refresh();
            });
        }
    }, {
        key: 'click.self $layerList .tree-item',
        value: function clickSelf$layerListTreeItem(e) {

            this.dispatch('/item/select', e.$delegateTarget.attr('id'));
            this.refresh();

            if (e.$delegateTarget.attr('type') == 'layer') {
                this.emit('@selectLayer');
            }
        }
    }, {
        key: 'dragstart $layerList .tree-item',
        value: function dragstart$layerListTreeItem(e) {
            this.draggedLayer = e.$delegateTarget;
            this.draggedLayer.css('opacity', 0.5);
            // e.preventDefault();
        }
    }, {
        key: 'dragend $layerList .tree-item',
        value: function dragend$layerListTreeItem(e) {

            if (this.draggedLayer) {
                this.draggedLayer.css('opacity', 1);
            }
        }
    }, {
        key: 'dragover $layerList .tree-item',
        value: function dragover$layerListTreeItem(e) {
            e.preventDefault();
        }
    }, {
        key: 'drop.self $layerList .tree-item',
        value: function dropSelf$layerListTreeItem(e) {
            e.preventDefault();

            var destId = e.$delegateTarget.attr('id');
            var sourceId = this.draggedLayer.attr('id');

            this.draggedLayer = null;
            this.dispatch('/item/move/in', destId, sourceId);
            this.refresh();
        }
    }, {
        key: 'drop $layerList',
        value: function drop$layerList(e) {
            e.preventDefault();

            if (this.draggedLayer) {
                var sourceId = this.draggedLayer.attr('id');

                this.draggedLayer = null;
                this.dispatch('/item/move/last', sourceId);
                this.refresh();
            }
        }
    }, {
        key: 'click $layerList .copy-item',
        value: function click$layerListCopyItem(e) {
            this.dispatch('/item/addCopy/layer', e.$delegateTarget.attr('item-id'));
            this.refresh();
        }
    }, {
        key: 'click $layerList .delete-item',
        value: function click$layerListDeleteItem(e) {
            this.dispatch('/item/remove', e.$delegateTarget.attr('item-id'));
            this.refresh();
        }
    }]);
    return LayerList;
}(UIElement);

var ImageList = function (_UIElement) {
    inherits(ImageList, _UIElement);

    function ImageList() {
        classCallCheck(this, ImageList);
        return possibleConstructorReturn(this, (ImageList.__proto__ || Object.getPrototypeOf(ImageList)).apply(this, arguments));
    }

    createClass(ImageList, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'images\'>\n                <div class=\'image-tools\'>   \n                    <div class=\'menu-buttons\'>\n                        <div class=\'gradient-type\' ref="$gradientType">\n                            <div class="gradient-item static" data-type="static" title="Static Color"></div>\n                            <div class="gradient-item linear" data-type="linear" title="Linear Gradient"></div>\n                            <div class="gradient-item radial" data-type="radial" title="Radial Gradient"></div>\n                            <div class="gradient-item repeating-linear" data-type="repeating-linear" title="repeating Linear Gradient"></div>\n                            <div class="gradient-item repeating-radial" data-type="repeating-radial" title="repeating Radial Gradient"></div>\n                            <div class="gradient-item image" data-type="image" title="Background Image">\n                                <div class="m1"></div>\n                                <div class="m2"></div>\n                                <div class="m3"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="image-list" ref="$imageList">\n\n                    </div>\n                </div>\n            </div>\n        ';
        }
    }, {
        key: 'makeItemNodeImage',
        value: function makeItemNodeImage(item) {
            var selected = item.selected ? 'selected' : '';
            return '\n            <div class=\'tree-item ' + selected + '\' id="' + item.id + '" draggable="true" >\n                <div class="item-view-container">\n                    <div class="item-view"  style=\'' + this.read('/image/toString', item) + '\'></div>\n                </div>\n                <div class=\'item-tools\'>\n                    <button type="button" class=\'delete-item\' item-id=\'' + item.id + '\' title="Remove">&times;</button>                \n                    <button type="button" class=\'copy-item\' item-id=\'' + item.id + '\' title="Copy">&times;</button>\n                </div>            \n            </div>\n            ';
        }
    }, {
        key: 'load $imageList',
        value: function load$imageList() {
            var _this2 = this;

            var item = this.read('/item/current/layer');

            if (!item) {
                var page = this.read('/item/current/page');
                if (page) {
                    var list = this.read('/item/list/children', page.id);
                    if (list.length) {
                        item = { id: list[0] };
                    } else {
                        return '';
                    }
                }
            }

            return this.read('/item/map/children', item.id, function (item) {
                return _this2.makeItemNodeImage(item);
            });
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.load();
        }
    }, {
        key: '@changeEditor',
        value: function changeEditor() {
            this.refresh();
        }
    }, {
        key: 'isNotSelected',
        value: function isNotSelected(e) {
            return !e.$delegateTarget.hasClass('selected');
        }
    }, {
        key: 'click.self.isNotSelected $imageList .tree-item',
        value: function clickSelfIsNotSelected$imageListTreeItem(e) {
            var id = e.$delegateTarget.attr('id');

            if (id) {
                this.dispatch('/item/select', id);
                this.refresh();
            }
        }
    }, {
        key: 'click $gradientType .gradient-item',
        value: function click$gradientTypeGradientItem(e) {
            var _this3 = this;

            this.read('/item/current/layer', function (item) {

                var type = e.$delegateTarget.attr('data-type');

                _this3.dispatch('/item/add/image', type, true, item.id);
                _this3.refresh();
            });
        }
    }, {
        key: 'dragstart $imageList .tree-item',
        value: function dragstart$imageListTreeItem(e) {
            this.draggedImage = e.$delegateTarget;
            this.draggedImage.css('opacity', 0.5);
            // e.preventDefault();
        }
    }, {
        key: 'dragend $imageList .tree-item',
        value: function dragend$imageListTreeItem(e) {

            if (this.draggedImage) {
                this.draggedImage.css('opacity', 1);
            }
        }
    }, {
        key: 'dragover $imageList .tree-item',
        value: function dragover$imageListTreeItem(e) {
            e.preventDefault();
        }
    }, {
        key: 'drop.self $imageList .tree-item',
        value: function dropSelf$imageListTreeItem(e) {
            e.preventDefault();

            var destId = e.$delegateTarget.attr('id');
            var sourceId = this.draggedImage.attr('id');

            this.draggedImage = null;
            this.dispatch('/item/move/in', destId, sourceId);
            this.refresh();
        }
    }, {
        key: 'drop $imageList',
        value: function drop$imageList(e) {
            e.preventDefault();

            if (this.draggedImage) {
                var sourceId = this.draggedImage.attr('id');

                this.draggedImage = null;
                this.dispatch('/item/move/last', sourceId);
                this.refresh();
            }
        }
    }, {
        key: 'click $imageList .copy-item',
        value: function click$imageListCopyItem(e) {
            this.dispatch('/item/addCopy/image', e.$delegateTarget.attr('item-id'));
            this.refresh();
        }
    }, {
        key: 'click $imageList .delete-item',
        value: function click$imageListDeleteItem(e) {
            this.dispatch('/item/remove', e.$delegateTarget.attr('item-id'));
            this.refresh();
        }
    }]);
    return ImageList;
}(UIElement);

var PropertyView = function (_UIElement) {
    inherits(PropertyView, _UIElement);

    function PropertyView() {
        classCallCheck(this, PropertyView);
        return possibleConstructorReturn(this, (PropertyView.__proto__ || Object.getPrototypeOf(PropertyView)).apply(this, arguments));
    }

    createClass(PropertyView, [{
        key: "template",
        value: function template() {
            return "\n            <div class='property-view inline'>\n                <PageName></PageName>\n                <PageSize></PageSize>\n                <clip></clip>\n                <PageExport></PageExport>\n            </div>\n        ";
        }
    }, {
        key: "components",
        value: function components() {
            return items;
        }
    }]);
    return PropertyView;
}(UIElement);

var ExportView = function (_UIElement) {
    inherits(ExportView, _UIElement);

    function ExportView() {
        classCallCheck(this, ExportView);
        return possibleConstructorReturn(this, (ExportView.__proto__ || Object.getPrototypeOf(ExportView)).apply(this, arguments));
    }

    createClass(ExportView, [{
        key: "template",
        value: function template() {
            return "\n            <div class='export-view'>\n                <div class=\"color-view\">\n                    <div class=\"close\" ref=\"$close\">&times;</div>        \n                    <div class=\"codeview\">        \n                        <textarea ref=\"$code\"></textarea>\n                    </div>\n                    <div class='preview' ref=\"$preview\"></div>\n                </div>\n            </div>\n        ";
        }
    }, {
        key: "afterRender",
        value: function afterRender() {
            this.cm = CodeMirror.fromTextArea(this.refs.$code.el, {
                lineNumbers: true,
                readOnly: true,
                lineWrapping: true,
                mode: "text/html"
            });
        }
    }, {
        key: "makePageCSS",
        value: function makePageCSS(page) {
            var obj = Object.assign({
                position: 'relative',
                overflow: page.clip ? 'hidden' : ''
            }, page.style || {});

            return this.read('/css/toString', obj);
        }
    }, {
        key: "loadCode",
        value: function loadCode() {
            var _this2 = this;

            var page = this.read('/item/current/page');

            if (!page) {
                return '';
            }

            var pageStyle = this.makePageCSS(page);

            var html = "<div id=\"page-1\" style=\"" + pageStyle + "\">\n" + this.read('/item/map/children', page.id, function (item, index) {
                return "\t<div id=\"layer-" + (index + 1) + "\" style=\"" + _this2.read('/layer/toExport', item, true) + "\"></div>";
            }).join('\n') + "\n</div>";

            if (this.cm) {
                this.cm.setValue(html);
                this.cm.refresh();
            }

            this.refs.$preview.html(html);
        }
    }, {
        key: "refresh",
        value: function refresh() {
            this.loadCode();
        }
    }, {
        key: 'click $close',
        value: function click$close(e) {
            this.$el.hide();
        }
    }, {
        key: '@toggleExport',
        value: function toggleExport() {
            this.$el.toggle();
        }
    }, {
        key: '@showExport',
        value: function showExport() {
            this.$el.show();
            this.refresh();
        }
    }, {
        key: '@hideExport',
        value: function hideExport() {
            this.$el.hide();
        }
    }]);
    return ExportView;
}(UIElement);

var Timeline = function (_UIElement) {
    inherits(Timeline, _UIElement);

    function Timeline() {
        classCallCheck(this, Timeline);
        return possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).apply(this, arguments));
    }

    createClass(Timeline, [{
        key: "template",
        value: function template() {
            return "\n            <div class='timeline-view'>\n                <div class=\"timeline-header\" ref=\"$header\">\n                    Timeline\n                </div>\n                <div class='timeline-body\"></div>\n            </div>\n        ";
        }
    }, {
        key: 'click $header',
        value: function click$header() {
            this.parent.toggleTimeline();
        }
    }]);
    return Timeline;
}(UIElement);

var DropView = function (_UIElement) {
    inherits(DropView, _UIElement);

    function DropView() {
        classCallCheck(this, DropView);
        return possibleConstructorReturn(this, (DropView.__proto__ || Object.getPrototypeOf(DropView)).apply(this, arguments));
    }

    createClass(DropView, [{
        key: 'template',
        value: function template() {
            return '\n            <div class=\'drop-view\'>\n                <div class=\'drop-overview\'></div>\n            </div>\n        ';
        }
    }, {
        key: 'dragover document',
        value: function dragoverDocument(e) {
            e.preventDefault();
            this.$el.show();
        }
    }, {
        key: 'dragout document',
        value: function dragoutDocument(e) {
            e.preventDefault();
            this.$el.hide();
        }
    }, {
        key: 'drop document',
        value: function dropDocument(e) {
            var _this2 = this;

            e.preventDefault();

            var files = [].concat(toConsumableArray(e.dataTransfer.files));

            this.read('/item/current/layer', function (layer) {
                _this2.read('/image/get/file', files, function (img) {
                    _this2.dispatch('/item/add/image/file', img, true, layer.id);
                });
            });
        }
    }]);
    return DropView;
}(UIElement);

var XDImageEditor = function (_BaseImageEditor) {
    inherits(XDImageEditor, _BaseImageEditor);

    function XDImageEditor() {
        classCallCheck(this, XDImageEditor);
        return possibleConstructorReturn(this, (XDImageEditor.__proto__ || Object.getPrototypeOf(XDImageEditor)).apply(this, arguments));
    }

    createClass(XDImageEditor, [{
        key: 'template',
        value: function template() {
            return '\n\n            <div class="layout-main">\n                <div class="layout-header">\n                    <h1 class="header-title">EASYLOGIC</h1>\n                    <div class="page-tab-menu">\n                        <PageList></PageList>\n                    </div>\n                </div>\n                <div class="layout-top">\n                    <PropertyView></PropertyView>\n                </div>\n                <div class="layout-left">      \n                    <LayerList></LayerList>\n                    <ImageList></ImageList>\n                </div>\n                <div class="layout-body">\n                    <GradientView></GradientView>                      \n                </div>                \n                <div class="layout-right">\n                    <FeatureControl></FeatureControl>\n                </div>\n                <div class="layout-footer">\n                    <Timeline></Timeline>\n                </div>\n                <ExportView></ExportView>\n                <DropView></DropView>\n            </div>\n        ';
        }
    }, {
        key: 'components',
        value: function components() {
            return {
                DropView: DropView,
                ExportView: ExportView,
                PropertyView: PropertyView,
                GradientView: GradientView,
                PageList: PageList,
                FeatureControl: FeatureControl,
                LayerList: LayerList,
                SubFeatureControl: SubFeatureControl,
                ImageList: ImageList,
                Timeline: Timeline
            };
        }
    }, {
        key: 'loadStart',
        value: function loadStart(isAdd) {
            var _this2 = this;

            this.dispatch('/storage/load', function (isLoaded) {
                if (!isLoaded && isAdd) {
                    _this2.run('/item/add/page', true);
                }
            });
        }
    }, {
        key: 'toggleTimeline',
        value: function toggleTimeline() {
            this.$el.toggleClass('show-timeline');
        }
    }]);
    return XDImageEditor;
}(BaseImageEditor);

var ImageEditor = {
    createImageEditor: function createImageEditor() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { type: 'xd' };

        switch (opts.type) {
            default:
                return new XDImageEditor(opts);
        }
    },

    ImageEditor: XDImageEditor
};

var colorpicker_class = 'codemirror-colorview';
var colorpicker_background_class = 'codemirror-colorview-background';
// Excluded tokens do not show color views..
var excluded_token = ['comment'];

function onChange(cm, evt) {
    if (evt.origin == 'setValue') {
        // if content is changed by setValue method, it initialize markers
        cm.state.colorpicker.close_color_picker();
        cm.state.colorpicker.init_color_update();
        cm.state.colorpicker.style_color_update();
    } else {
        cm.state.colorpicker.style_color_update(cm.getCursor().line);
    }
}

function onUpdate(cm, evt) {
    if (!cm.state.colorpicker.isUpdate) {
        cm.state.colorpicker.isUpdate = true;
        cm.state.colorpicker.close_color_picker();
        cm.state.colorpicker.init_color_update();
        cm.state.colorpicker.style_color_update();
    }
}

function onRefresh(cm, evt) {
    onChange(cm, { origin: 'setValue' });
}

function onKeyup(cm, evt) {
    cm.state.colorpicker.keyup(evt);
}

function onMousedown(cm, evt) {
    if (cm.state.colorpicker.is_edit_mode()) {
        cm.state.colorpicker.check_mousedown(evt);
    }
}

function onPaste(cm, evt) {
    onChange(cm, { origin: 'setValue' });
}

function onScroll(cm) {
    cm.state.colorpicker.close_color_picker();
}

function debounce$1(callback, delay) {

    var t = undefined;

    return function (cm, e) {
        if (t) {
            clearTimeout(t);
        }

        t = setTimeout(function () {
            callback(cm, e);
        }, delay || 300);
    };
}

function has_class(el, cls) {
    if (!el || !el.className) {
        return false;
    } else {
        var newClass = ' ' + el.className + ' ';
        return newClass.indexOf(' ' + cls + ' ') > -1;
    }
}

var ColorView$2 = function () {
    function ColorView(cm, opt) {
        classCallCheck(this, ColorView);

        if (typeof opt == 'boolean') {
            opt = { mode: 'edit' };
        } else {
            opt = Object.assign({ mode: 'edit' }, opt || {});
        }

        this.opt = opt;
        this.cm = cm;
        this.markers = {};

        // set excluded token 
        this.excluded_token = this.opt.excluded_token || excluded_token;

        if (this.opt.colorpicker) {
            this.colorpicker = this.opt.colorpicker(this.opt);
        } else {
            this.colorpicker = ColorPicker.create(this.opt);
        }

        this.init_event();
    }

    createClass(ColorView, [{
        key: 'init_event',
        value: function init_event() {

            this.cm.on('mousedown', onMousedown);
            this.cm.on('keyup', onKeyup);
            this.cm.on('change', onChange);
            this.cm.on('update', onUpdate);
            this.cm.on('refresh', onRefresh);

            // create paste callback
            this.onPasteCallback = function (cm, callback) {
                return function (evt) {
                    callback.call(this, cm, evt);
                };
            }(this.cm, onPaste);

            this.cm.getWrapperElement().addEventListener('paste', this.onPasteCallback);

            if (this.is_edit_mode()) {
                this.cm.on('scroll', debounce$1(onScroll, 50));
            }
        }
    }, {
        key: 'is_edit_mode',
        value: function is_edit_mode() {
            return this.opt.mode == 'edit';
        }
    }, {
        key: 'is_view_mode',
        value: function is_view_mode() {
            return this.opt.mode == 'view';
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.cm.off('mousedown', onMousedown);
            this.cm.off('keyup', onKeyup);
            this.cm.off('change', onChange);
            this.cm.getWrapperElement().removeEventListener('paste', this.onPasteCallback);

            if (this.is_edit_mode()) {
                this.cm.off('scroll');
            }
        }
    }, {
        key: 'hasClass',
        value: function hasClass(el, className) {
            if (!el.className) {
                return false;
            } else {
                var newClass = ' ' + el.className + ' ';
                return newClass.indexOf(' ' + className + ' ') > -1;
            }
        }
    }, {
        key: 'check_mousedown',
        value: function check_mousedown(evt) {
            if (this.hasClass(evt.target, colorpicker_background_class)) {
                this.open_color_picker(evt.target.parentNode);
            } else {
                this.close_color_picker();
            }
        }
    }, {
        key: 'popup_color_picker',
        value: function popup_color_picker(defalutColor) {
            var cursor = this.cm.getCursor();
            var self = this;
            var colorMarker = {
                lineNo: cursor.line,
                ch: cursor.ch,
                color: defalutColor || '#FFFFFF',
                isShortCut: true
            };

            Object.keys(this.markers).forEach(function (key) {
                var searchKey = "#" + key;
                if (searchKey.indexOf("#" + colorMarker.lineNo + ":") > -1) {
                    var marker = self.markers[key];

                    if (marker.ch <= colorMarker.ch && colorMarker.ch <= marker.ch + marker.color.length) {
                        // when cursor has marker
                        colorMarker.ch = marker.ch;
                        colorMarker.color = marker.color;
                        colorMarker.nameColor = marker.nameColor;
                    }
                }
            });

            this.open_color_picker(colorMarker);
        }
    }, {
        key: 'open_color_picker',
        value: function open_color_picker(el) {
            var lineNo = el.lineNo;
            var ch = el.ch;
            var nameColor = el.nameColor;
            var color = el.color;

            if (this.colorpicker) {
                var self = this;
                var prevColor = color;
                var pos = this.cm.charCoords({ line: lineNo, ch: ch });
                this.colorpicker.show({
                    left: pos.left,
                    top: pos.bottom,
                    isShortCut: el.isShortCut || false,
                    hideDelay: self.opt.hideDelay || 2000
                }, nameColor || color, function (newColor) {
                    self.cm.replaceRange(newColor, { line: lineNo, ch: ch }, { line: lineNo, ch: ch + prevColor.length }, '*colorpicker');
                    prevColor = newColor;
                });
            }
        }
    }, {
        key: 'close_color_picker',
        value: function close_color_picker(el) {
            if (this.colorpicker) {
                this.colorpicker.hide();
            }
        }
    }, {
        key: 'key',
        value: function key(lineNo, ch) {
            return [lineNo, ch].join(":");
        }
    }, {
        key: 'keyup',
        value: function keyup(evt) {

            if (this.colorpicker) {
                if (evt.key == 'Escape') {
                    this.colorpicker.hide();
                } else if (this.colorpicker.isShortCut == false) {
                    this.colorpicker.hide();
                }
            }
        }
    }, {
        key: 'init_color_update',
        value: function init_color_update() {
            this.markers = {}; // initialize marker list
        }
    }, {
        key: 'style_color_update',
        value: function style_color_update(lineHandle) {
            if (lineHandle) {
                this.match(lineHandle);
            } else {
                var max = this.cm.lineCount();

                for (var lineNo = 0; lineNo < max; lineNo++) {
                    this.match(lineNo);
                }
            }
        }
    }, {
        key: 'empty_marker',
        value: function empty_marker(lineNo, lineHandle) {
            var list = lineHandle.markedSpans || [];

            for (var i = 0, len = list.length; i < len; i++) {
                var key = this.key(lineNo, list[i].from);

                if (key && has_class(list[i].marker.replacedWith, colorpicker_class)) {
                    delete this.markers[key];
                    list[i].marker.clear();
                }
            }
        }
    }, {
        key: 'match_result',
        value: function match_result(lineHandle) {
            return Color$1.matches(lineHandle.text);
        }
    }, {
        key: 'submatch',
        value: function submatch(lineNo, lineHandle) {
            var _this = this;

            this.empty_marker(lineNo, lineHandle);

            var result = this.match_result(lineHandle);
            var obj = { next: 0 };

            result.forEach(function (item) {
                _this.render(obj, lineNo, lineHandle, item.color, item.nameColor);
            });
        }
    }, {
        key: 'match',
        value: function match(lineNo) {
            var lineHandle = this.cm.getLineHandle(lineNo);
            var self = this;
            this.cm.operation(function () {
                self.submatch(lineNo, lineHandle);
            });
        }
    }, {
        key: 'make_element',
        value: function make_element() {
            var el = document.createElement('div');

            el.className = colorpicker_class;

            if (this.is_edit_mode()) {
                el.title = "open color picker";
            } else {
                el.title = "";
            }

            el.back_element = this.make_background_element();
            el.appendChild(el.back_element);

            return el;
        }
    }, {
        key: 'make_background_element',
        value: function make_background_element() {
            var el = document.createElement('div');

            el.className = colorpicker_background_class;

            return el;
        }
    }, {
        key: 'set_state',
        value: function set_state(lineNo, start, color, nameColor) {
            var marker = this.create_marker(lineNo, start);

            marker.lineNo = lineNo;
            marker.ch = start;
            marker.color = color;
            marker.nameColor = nameColor;

            return marker;
        }
    }, {
        key: 'create_marker',
        value: function create_marker(lineNo, start) {

            if (!this.has_marker(lineNo, start)) {
                this.init_marker(lineNo, start);
            }

            return this.get_marker(lineNo, start);
        }
    }, {
        key: 'init_marker',
        value: function init_marker(lineNo, start) {
            this.markers[this.key(lineNo, start)] = this.make_element();
        }
    }, {
        key: 'has_marker',
        value: function has_marker(lineNo, start) {
            return !!this.get_marker(lineNo, start);
        }
    }, {
        key: 'get_marker',
        value: function get_marker(lineNo, start) {
            var key = this.key(lineNo, start);
            return this.markers[key];
        }
    }, {
        key: 'update_element',
        value: function update_element(el, color) {
            el.back_element.style.backgroundColor = color;
        }
    }, {
        key: 'set_mark',
        value: function set_mark(line, ch, el) {
            this.cm.setBookmark({ line: line, ch: ch }, { widget: el, handleMouseEvents: true });
        }
    }, {
        key: 'is_excluded_token',
        value: function is_excluded_token(line, ch) {
            var type = this.cm.getTokenTypeAt({ line: line, ch: ch });
            var count = 0;
            for (var i = 0, len = this.excluded_token.length; i < len; i++) {
                if (type === this.excluded_token[i]) {
                    count++;
                    break;
                }
            }

            return count > 0; // true is that it has a excluded token 
        }
    }, {
        key: 'render',
        value: function render(cursor, lineNo, lineHandle, color, nameColor) {
            var start = lineHandle.text.indexOf(color, cursor.next);

            if (this.is_excluded_token(lineNo, start) === true) {
                // excluded token do not show.
                return;
            }

            cursor.next = start + color.length;

            if (this.has_marker(lineNo, start)) {
                this.update_element(this.create_marker(lineNo, start), nameColor || color);
                this.set_state(lineNo, start, color, nameColor);
                return;
            }

            var el = this.create_marker(lineNo, start);

            this.update_element(el, nameColor || color);

            this.set_state(lineNo, start, color, nameColor || color);
            this.set_mark(lineNo, start, el);
        }
    }]);
    return ColorView;
}();

if (window.CodeMirror) {

    CodeMirror$1.defineOption("colorpicker", false, function (cm, val, old) {
        if (old && old != CodeMirror$1.Init) {

            if (cm.state.colorpicker) {
                cm.state.colorpicker.destroy();
                cm.state.colorpicker = null;
            }
            // remove event listener
        }

        if (val) {
            cm.state.colorpicker = new ColorView$2(cm, val);
        }
    });
}

var index = _extends({}, Util, ColorPicker, ImageEditor);

return index;

})));
