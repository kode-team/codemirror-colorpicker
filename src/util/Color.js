import ColorNames from './ColorNames'
import kmeans  from './Kmeans'
import ImageLoader from './ImageLoader'

const color_regexp = /(#(?:[\da-f]{3}){1,2}|rgb\((?:\s*\d{1,3},\s*){2}\d{1,3}\s*\)|rgba\((?:\s*\d{1,3},\s*){3}\d*\.?\d+\s*\)|hsl\(\s*\d{1,3}(?:,\s*\d{1,3}%){2}\s*\)|hsla\(\s*\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\s*\)|([\w_\-]+))/gi;

const color = {

    matches: function (str, hasColorName = false) {
        const matches = str.match(color_regexp);
        let result = [];

        if (!matches) {
            return result;
        }


        var obj = { next: 0 };
        for (var i = 0, len = matches.length; i < len; i++) {

            if (matches[i].indexOf('#') > -1 || matches[i].indexOf('rgb') > -1 || matches[i].indexOf('hsl') > -1) {
                result.push({ color: matches[i] });
            } else {

                if (hasColorName) {
                    var nameColor = ColorNames.getColorByName(matches[i]);

                    if (nameColor) {
                        result.push({ color: matches[i], nameColor: nameColor });
                    }
                }

            }
        }

        var pos = { next: 0 }
        result.forEach(item => {
            const startIndex = str.indexOf(item.color, pos.next);

            item.startIndex = startIndex;
            item.endIndex = startIndex + item.color.length;

            pos.next = item.endIndex;
        });

        return result;
    },

    trim: function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    },

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
    format: function (obj, type) {

        if (Array.isArray(obj)) {
            obj = { r : obj[0], g : obj[1], b : obj[2], a : obj[3] }
        }

        if (type == 'hex') {
            var r = obj.r.toString(16);
            if (obj.r < 16) r = "0" + r;

            var g = obj.g.toString(16);
            if (obj.g < 16) g = "0" + g;

            var b = obj.b.toString(16);
            if (obj.b < 16) b = "0" + b;

            return `#${r}${g}${b}`;
        } else if (type == 'rgb') {
            if (obj.a == 1 || typeof obj.a == 'undefined') {
                return `rgb(${obj.r},${obj.g},${obj.b})`;
            } else {
                return `rgba(${obj.r},${obj.g},${obj.b},${obj.a})`;
            }
        } else if (type == 'hsl') {
            if (obj.a == 1 || typeof obj.a == 'undefined') {
                return `hsl(${obj.h},${obj.s}%,${obj.l}%)`;
            } else {
                return `hsla(${obj.h},${obj.s}%,${obj.l}%,${obj.a})`;
            }
        }

        return obj;
    },

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
    parse: function (str) {
        if (typeof str == 'string') {

            if (ColorNames.isColorName(str)) {
                str = ColorNames.getColorByName(str);
            }

            if (str.indexOf("rgb(") > -1) {
                var arr = str.replace("rgb(", "").replace(")", "").split(",");

                for (var i = 0, len = arr.length; i < len; i++) {
                    arr[i] = parseInt(color.trim(arr[i]), 10);
                }

                return { type: 'rgb', r: arr[0], g: arr[1], b: arr[2], a: 1 };
            } else if (str.indexOf("rgba(") > -1) {
                var arr = str.replace("rgba(", "").replace(")", "").split(",");

                for (var i = 0, len = arr.length; i < len; i++) {

                    if (len - 1 == i) {
                        arr[i] = parseFloat(color.trim(arr[i]));
                    } else {
                        arr[i] = parseInt(color.trim(arr[i]), 10);
                    }
                }

                return { type: 'rgb', r: arr[0], g: arr[1], b: arr[2], a: arr[3] };
            } else if (str.indexOf("hsl(") > -1) {
                var arr = str.replace("hsl(", "").replace(")", "").split(",");

                for (var i = 0, len = arr.length; i < len; i++) {
                    arr[i] = parseFloat(color.trim(arr[i]));
                }

                var obj = { type: 'hsl', h: arr[0], s: arr[1], l: arr[2], a: 1 };

                var temp = color.HSLtoRGB(obj.h, obj.s, obj.l);

                obj.r = temp.r;
                obj.g = temp.g;
                obj.b = temp.b;

                return obj;
            } else if (str.indexOf("hsla(") > -1) {
                var arr = str.replace("hsla(", "").replace(")", "").split(",");

                for (var i = 0, len = arr.length; i < len; i++) {

                    if (len - 1 == i) {
                        arr[i] = parseFloat(color.trim(arr[i]));
                    } else {
                        arr[i] = parseInt(color.trim(arr[i]), 10);
                    }
                }

                var obj = { type: 'hsl', h: arr[0], s: arr[1], l: arr[2], a: arr[3] };

                var temp = color.HSLtoRGB(obj.h, obj.s, obj.l);

                obj.r = temp.r;
                obj.g = temp.g;
                obj.b = temp.b;

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

                return { type: 'hex', r: arr[0], g: arr[1], b: arr[2], a: 1 };
            }
        } else if (typeof str == 'number') {
            if (0x000000 <= str && str <= 0xffffff) {
                const r = (str & 0xff0000) >> 16;
                const g = (str & 0x00ff00) >> 8;
                const b = (str & 0x0000ff) >> 0;

                return { type: 'hex', r, g, b, a: 1 };
            } else if (0x00000000 <= str && str <= 0xffffffff) {
                const r = (str & 0xff000000) >> 24;
                const g = (str & 0x00ff0000) >> 16;
                const b = (str & 0x0000ff00) >> 8;
                let a = (str & 0x000000ff) / 255;

                return { type: 'hex', r, g, b, a };

            }
        }

        return str;

    },

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
    HSVtoRGB: function (h, s, v) {

        if (arguments.length == 1) {
            var { h, s, v } = arguments[0];
        }

        var H = h;
        var S = s;
        var V = v;

        if (H == 360) {
            H = 0;
        }

        const C = S * V;
        const X = C * (1 - Math.abs((H / 60) % 2 - 1));
        const m = V - C;

        let temp = [];

        if (0 <= H && H < 60) { temp = [C, X, 0]; }
        else if (60 <= H && H < 120) { temp = [X, C, 0]; }
        else if (120 <= H && H < 180) { temp = [0, C, X]; }
        else if (180 <= H && H < 240) { temp = [0, X, C]; }
        else if (240 <= H && H < 300) { temp = [X, 0, C]; }
        else if (300 <= H && H < 360) { temp = [C, 0, X]; }

        return {
            r: Math.round((temp[0] + m) * 255),
            g: Math.round((temp[1] + m) * 255),
            b: Math.round((temp[2] + m) * 255)
        };
    },

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
    RGBtoHSV: function (r, g, b) {

        if (arguments.length == 1) {
            var { r, g, b } = arguments[0];
        }

        const R1 = r / 255;
        const G1 = g / 255;
        const B1 = b / 255;

        const MaxC = Math.max(R1, G1, B1);
        const MinC = Math.min(R1, G1, B1);

        const DeltaC = MaxC - MinC;

        var H = 0;

        if (DeltaC == 0) { H = 0; }
        else if (MaxC == R1) {
            H = 60 * (((G1 - B1) / DeltaC) % 6);
        } else if (MaxC == G1) {
            H = 60 * (((B1 - R1) / DeltaC) + 2);
        } else if (MaxC == B1) {
            H = 60 * (((R1 - G1) / DeltaC) + 4);
        }

        if (H < 0) {
            H = 360 + H;
        }

        var S = 0;

        if (MaxC == 0) S = 0;
        else S = DeltaC / MaxC;

        var V = MaxC;

        return { h: H, s: S, v: V };
    },

    HSVtoHSL: function (h, s, v) {

        if (arguments.length == 1) {
            var { h, s, v } = arguments[0];
        }

        const rgb = this.HSVtoRGB(h, s, v);

        return this.RGBtoHSL(rgb.r, rgb.g, rgb.b);
    },

    RGBtoCMYK: function (r, g, b) {

        if (arguments.length == 1) {
            var { r, g, b } = arguments[0];
        }

        const R1 = r / 255;
        const G1 = g / 255;
        const B1 = b / 255;

        const K = 1 - Math.max(R1, G1, B1);
        const C = (1 - R1 - K) / (1 - K);
        const M = (1 - G1 - K) / (1 - K);
        const Y = (1 - B1 - K) / (1 - K);

        return { c: C, m: M, y: Y, k: K };
    },

    CMYKtoRGB: function (c, m, y, k) {

        if (arguments.length == 1) {
            var { c, m, y, k } = arguments[0];
        }

        const R = 255 * (1 - c) * (1 - k);
        const G = 255 * (1 - m) * (1 - k);
        const B = 255 * (1 - y) * (1 - k);

        return { r: R, g: G, b: B }
    },

    RGBtoHSL: function (r, g, b) {

        if (arguments.length == 1) {
            var { r, g, b } = arguments[0];
        }

        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    },

    HUEtoRGB: function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    },

    HSLtoHSV: function (h, s, l) {

        if (arguments.length == 1) {
            var { h, s, v } = arguments[0];
        }
        const rgb = this.HSLtoRGB(h, s, l);

        return this.RGBtoHSV(rgb.r, rgb.g, rgb.b);
    },

    HSLtoRGB: function (h, s, l) {

        if (arguments.length == 1) {
            var { h, s, v } = arguments[0];
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
            r = this.HUEtoRGB(p, q, h + 1 / 3);
            g = this.HUEtoRGB(p, q, h);
            b = this.HUEtoRGB(p, q, h - 1 / 3);
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    },
    c: function (r, g, b) {

        if (arguments.length == 1) {
            var { r, g, b } = arguments[0];
        }
        return this.gray((r + g + b) / 3 > 90 ? 0 : 255);
    },
    gray: function (gray) {
        return { r: gray, g: gray, b: gray };
    },
    RGBtoSimpleGray: function (r, g, b) {

        if (arguments.length == 1) {
            var { r, g, b } = arguments[0];
        }
        return this.gray(Math.ceil((r + g + b) / 3));
    },
    RGBtoGray: function (r, g, b) {

        if (arguments.length == 1) {
            var { r, g, b } = arguments[0];
        }
        return this.gray(this.RGBtoYCrCb(r, g, b).y);
    },
    RGBtoYCrCb: function (r, g, b) {

        if (arguments.length == 1) {
            var { r, g, b } = arguments[0];
        }
        const Y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        const Cb = 0.564 * (b - Y)
        const Cr = 0.713 * (r - Y)

        return { y: Math.ceil(Y), cr: Cr, cb: Cb };
    },
    YCrCbtoRGB: function (y, cr, cb, bit = 0) {

        if (arguments.length == 1) {
            var { y, cr, cb, bit = 0 } = arguments[0];
        }
        const R = y + 1.402 * (cr - bit);
        const G = y - 0.344 * (cb - bit) - 0.714 * (cr - bit);
        const B = y + 1.772 * (cb - bit);

        return { r: Math.ceil(R), g: Math.ceil(G), b: Math.ceil(B) }
    },
    interpolateRGB(startColor, endColor, t) {
        var obj = {
            r: parseInt(startColor.r + (endColor.r - startColor.r) * t, 10),
            g: parseInt(startColor.g + (endColor.g - startColor.g) * t, 10),
            b: parseInt(startColor.b + (endColor.b - startColor.b) * t, 10)
        };

        return color.format(obj, 'hex');

    },
    scale(scale, count = 5) {
        if (!scale) return [];

        scale = scale || [];
        var len = scale.length;

        var colors = [];
        for (var i = 0; i < len - 1; i++) {
            var start = this.parse(scale[i]);
            var end = this.parse(scale[i + 1]);

            for (var index = 0; index < count; index++) {
                colors.push(this.interpolateRGB(start, end, (index / count)));
            }

        }
        return colors;
    },

    scaleHSV (color, target = 'h', count = 9, format = 'rgb', min = 0, max = 1, dist = 100) {
        var colorObj = this.parse(color);
        var hsv = this.RGBtoHSV(colorObj);
        var unit = ((max - min) * dist / count);

        var results = [];
        for(var i = 1; i <= count; i++) {
            hsv[target] = Math.abs((dist - unit * i) / dist);
            results.push(this.format(this.HSVtoRGB(hsv), format));
        } 
        
        return results; 
    },
    scaleH (color, count = 9, format = 'rgb', min = 0, max = 360) {
        return this.scaleHSV(color, 'h', count, format, min , max, 1);
    },
    scaleS (color, count = 9, format = 'rgb', min = 0, max = 1) {
        return this.scaleHSV(color, 's', count, format, min , max, 100);
    },
    scaleV (color, count = 9, format = 'rgb', min = 0, max = 1) {
        return this.scaleHSV(color, 'v', count, format, min , max, 100);
    },
    palette : function (colors, k = 6, format = 'hex') {

        if (colors.length > k) {
            colors = kmeans(colors, k);
        }

        return colors.map(c => {
            return this.format(c, format);
        });
    },
    ImageToRGB : function (url, callbackOrOption = {}, callback) {

        if (!callback) {
            var img = new ImageLoader(url); 
            img.loadImage(() => {
                if (typeof callbackOrOption == 'function') {
                    callbackOrOption(img.toRGB());
                }
                
            })
        } else if (callback) {
            var img = new ImageLoader(url, callbackOrOption); 
            img.loadImage(() => {
                if (typeof callback == 'function') {
                    callback(img.toRGB());
                }

            })
        }

    }
}

color.scale.parula = function (count) {
    return color.scale(['#352a87', '#0f5cdd', '#00b5a6', '#ffc337', '#fdff00'], count);
};

color.scale.jet = function (count) {
    return color.scale(['#00008f', '#0020ff', '#00ffff', '#51ff77', '#fdff00', '#ff0000', '#800000'], count);
}

color.scale.hsv = function (count) {
    return color.scale(['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'], count);
}

color.scale.hot = function (count) {
    return color.scale(['#0b0000', '#ff0000', '#ffff00', '#ffffff'], count);
}
color.scale.pink = function (count) { 
    return color.scale(['#1e0000', '#bd7b7b', '#e7e5b2', '#ffffff'], count); 
}

color.scale.bone = function (count) { 
    return color.scale(['#000000', '#4a4a68', '#a6c6c6', '#ffffff'], count); 
}

color.scale.copper = function (count) { 
    return color.scale(['#000000', '#3d2618', '#9d623e', '#ffa167', '#ffc77f'], count);
}

export default color; 