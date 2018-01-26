import ColorNames from './ColorNames'


const color = {

    trim : function (str) {
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
    format : function(obj, type) {
        if (type == 'hex') {
            var r = obj.r.toString(16);
            if (obj.r < 16) r = "0" + r;

            var g = obj.g.toString(16);
            if (obj.g < 16) g = "0" + g;

            var b = obj.b.toString(16);
            if (obj.b < 16) b = "0" + b;

            return "#" + [r, g, b].join("");
        } else if (type == 'rgb') {
            if (typeof obj.a == 'undefined') {
                return "rgb(" + [obj.r, obj.g, obj.b].join(",") + ")";
            } else {
                return "rgba(" + [obj.r, obj.g, obj.b, obj.a].join(",") + ")";
            }
        } else if (type == 'hsl') {
            if (typeof obj.a == 'undefined') {
                return "hsl(" + [obj.h, obj.s + '%', obj.l + '%'].join(",") + ")";
            } else {
                return "hsla(" + [obj.h, obj.s + '%', obj.l + '%', obj.a].join(",") + ")";
            }
        }

        return obj;
    },

    /**
     * @method rgb
     *
     * parse string to rgb color
     *
     * 		color.rgb("#FF0000") === { r : 255, g : 0, b : 0 }
     *
     * 		color.rgb("rgb(255, 0, 0)") == { r : 255, g : 0, b : }
     *
     * @param {String} str color string
     * @returns {Object}  rgb object
     */
    parse : function (str) {
        if (typeof str == 'string') {

            if (ColorNames.isColorName(str)) {
                str = CodeNames.getColorByName(str);
            }

            if (str.indexOf("rgb(") > -1) {
                var arr = str.replace("rgb(", "").replace(")","").split(",");

                for(var i = 0, len = arr.length; i < len; i++) {
                    arr[i] = parseInt(color.trim(arr[i]), 10);
                }

                return { type : 'rgb', r : arr[0], g : arr[1], b : arr[2], a : 1	};
            } else if (str.indexOf("rgba(") > -1) {
                var arr = str.replace("rgba(", "").replace(")", "").split(",");

                for (var i = 0, len = arr.length; i < len; i++) {

                    if (len - 1 == i) {
                        arr[i] = parseFloat(color.trim(arr[i]));
                    } else {
                        arr[i] = parseInt(color.trim(arr[i]), 10);
                    }
                }

                return {type: 'rgb', r: arr[0], g: arr[1], b: arr[2], a: arr[3]};
            } else if (str.indexOf("hsl(") > -1) {
                var arr = str.replace("hsl(", "").replace(")","").split(",");

                for(var i = 0, len = arr.length; i < len; i++) {
                    arr[i] = parseInt(color.trim(arr[i]), 10);
                }

                var obj = { type : 'hsl', h : arr[0], s : arr[1], l : arr[2], a : 1	};

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

                var obj = {type: 'hsl', h: arr[0], s: arr[1], l: arr[2], a: arr[3]};

                var temp = color.HSLtoRGB(obj.h, obj.s, obj.l);

                obj.r = temp.r;
                obj.g = temp.g;
                obj.b = temp.b;

                return obj;
            } else if (str.indexOf("#") == 0) {

                str = str.replace("#", "");

                var arr = [];
                if (str.length == 3) {
                    for(var i = 0, len = str.length; i < len; i++) {
                        var char = str.substr(i, 1);
                        arr.push(parseInt(char+char, 16));
                    }
                } else {
                    for(var i = 0, len = str.length; i < len; i+=2) {
                        arr.push(parseInt(str.substr(i, 2), 16));
                    }
                }

                return { type : 'hex', r : arr[0], g : arr[1], b : arr[2], a : 1	};
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
    HSVtoRGB : function (H, S, V) {

        if (H == 360) {
            H = 0;
        }

        var C = S * V;
        var X = C * (1 -  Math.abs((H/60) % 2 -1)  );
        var m = V - C;

        var temp = [];

        if (0 <= H && H < 60) { temp = [C, X, 0]; }
        else if (60 <= H && H < 120) { temp = [X, C, 0]; }
        else if (120 <= H && H < 180) { temp = [0, C, X]; }
        else if (180 <= H && H < 240) { temp = [0, X, C]; }
        else if (240 <= H && H < 300) { temp = [X, 0, C]; }
        else if (300 <= H && H < 360) { temp = [C, 0, X]; }

        return {
            r : Math.ceil((temp[0] + m) * 255),
            g : Math.ceil((temp[1] + m) * 255),
            b : Math.ceil((temp[2] + m) * 255)
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
    RGBtoHSV : function (R, G, B) {

        var R1 = R / 255;
        var G1 = G / 255;
        var B1 = B / 255;

        var MaxC = Math.max(R1, G1, B1);
        var MinC = Math.min(R1, G1, B1);

        var DeltaC = MaxC - MinC;

        var H = 0;

        if (DeltaC == 0) { H = 0; }
        else if (MaxC == R1) {
            H = 60 * (( (G1 - B1) / DeltaC) % 6);
        } else if (MaxC == G1) {
            H  = 60 * (( (B1 - R1) / DeltaC) + 2);
        } else if (MaxC == B1) {
            H  = 60 * (( (R1 - G1) / DeltaC) + 4);
        }

        if (H < 0) {
            H = 360 + H;
        }

        var S = 0;

        if (MaxC == 0) S = 0;
        else S = DeltaC / MaxC;

        var V = MaxC;

        return { h : H, s : S, v :  V };
    },

    RGBtoHSL : function (r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h : Math.round(h * 360) , s : Math.round(s * 100), l : Math.round(l * 100)};
    },

    HUEtoRGB : function (p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    },

    HSLtoRGB : function (h, s, l) {
        var r, g, b;

        h /= 360;
        s /= 100;
        l /= 100;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = this.HUEtoRGB(p, q, h + 1/3);
            g = this.HUEtoRGB(p, q, h);
            b = this.HUEtoRGB(p, q, h - 1/3);
        }

        return { r : r * 255, g : g * 255, b : b * 255 };
    },
    scale (startColor, endColor, t) {
        var obj = {
            r : parseInt(startColor.r + (endColor.r - startColor.r) * t, 10) ,
            g : parseInt(startColor.g + (endColor.g - startColor.g) * t, 10),
            b : parseInt(startColor.b + (endColor.b - startColor.b) * t, 10)
        };
    
        return color.format(obj, 'hex');
    
    },
    checkHueColor(p) {
        var startColor, endColor;
    
        for(var i = 0; i < hue_color.length;i++) {
            if (hue_color[i].start >= p) {
                startColor = hue_color[i-1];
                endColor = hue_color[i];
                break;
            }
        }
    
        if (startColor && endColor) {
            return this.scale(startColor, endColor, (p - startColor.start)/(endColor.start - startColor.start));
        }
    
        return hue_color[0].rgb;
    }
}

const hue_color = [
    { rgb : '#ff0000', start : .0 },
    { rgb : '#ffff00', start : .17 },
    { rgb : '#00ff00', start : .33 },
    { rgb : '#00ffff', start : .50 },
    { rgb : '#0000ff', start : .67 },
    { rgb : '#ff00ff', start : .83 },
    { rgb : '#ff0000', start : 1 }
];


function initHueColors () {
    for(var i = 0, len = hue_color.length; i < len; i++) {
        var hue = hue_color[i];

        var obj = color.parse(hue.rgb);

        hue.r = obj.r;
        hue.g = obj.g;
        hue.b = obj.b;
    }
}

initHueColors();


export default {
    color : color,
    hue_color : hue_color
}