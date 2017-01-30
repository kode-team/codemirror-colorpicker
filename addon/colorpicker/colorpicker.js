(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("./foldcode"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "./foldcode"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {

    CodeMirror.defineExtension("colorpicker", function () {

        var cm  = this; 

         var color = {

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

                    return "#" + [r,g,b].join("").toUpperCase();
                } else if (type == 'rgb') {
                    if (typeof obj.a == 'undefined') {
                        return "rgb(" + [obj.r, obj.g, obj.b].join(",") + ")";
                    } else {
                        return "rgba(" + [obj.r, obj.g, obj.b, obj.a].join(",") + ")";
                    }
                } else if (type == 'hsl') {
                    if (typeof obj.a == 'undefined') {
                        return "hsl(" + [obj.h, obj.s, obj.l].join(",") + ")";
                    } else {
                        return "hsla(" + [obj.h, obj.s, obj.l, obj.a].join(",") + ")";
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
                    if (str.indexOf("rgb(") > -1) {
                        var arr = str.replace("rgb(", "").replace(")","").split(",");

                        for(var i = 0, len = arr.length; i < len; i++) {
                            arr[i] = parseInt(color.trim(arr[i]), 10);
                        }

                        return { type : 'rgb', r : arr[0], g : arr[1], b : arr[2], a : 1	};
                    } else if (str.indexOf("rgba(") > -1) {
                        var arr = str.replace("rgba(", "").replace(")","").split(",");

                        for(var i = 0, len = arr.length; i < len; i++) {

                            if (len - 1 == i) {
                                arr[i] = parseFloat(color.trim(arr[i]));
                            } else {
                                arr[i] = parseInt(color.trim(arr[i]), 10);
                            }
                        }

                        return { type : 'rgba',  r : arr[0], g : arr[1], b : arr[2], a : arr[3]};
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
            }
        };

        var hue_color = [
            { rgb : '#ff0000', start : .0 },
            { rgb : '#ffff00', start : .17 },
            { rgb : '#00ff00', start : .33 },
            { rgb : '#00ffff', start : .50 },
            { rgb : '#0000ff', start : .67 },
            { rgb : '#ff00ff', start : .83 },
            { rgb : '#ff0000', start : 1 }
        ];

        var $root, $hue, $color, $value, $saturation, $drag_pointer, $drag_bar,
            $control, $controlPattern, $controlColor, $hueContainer, $opacity, $opacityContainer,
            $opacityInput, $opacity_drag_bar, $information, $informationTitle1, $informationTitle2,
            $informationTitle3, $informationTitle4, $informationInput1, $informationInput2,
            $informationInput3, $informationInput4;

        var colorpickerCallback = function () {};
        var counter = 0; 
        var cached = {};
        var isColorPickerShow = false;


        function createDom(tag, className, attr) {
            return new dom(tag, className, attr);
        }

        function dom(tag, className, attr) {
            var el  = document.createElement(tag);

            this.uniqId = counter++;

            el.className = className;

            attr = attr || {};

            for(var k in attr) {
                el.setAttribute(k, attr[k]);
            }

            this.el = el;  
        }


        dom.prototype.html = function (html) {
            this.el.innerHTML = html;

            return this;  
        }        

        dom.prototype.empty = function () {
            return this.html('');
        }

        dom.prototype.append = function (el) {

            if (typeof el == 'string') {
                this.el.appendChild(document.createTextNode(el));
            } else {
                this.el.appendChild(el.el || el);
            }

            return this; 
        }

        dom.prototype.appendTo = function (target) {
            var t = target.el ? target.el : target; 

            t.appendChild(this.el);

            return this; 
        }

        dom.prototype.remove = function () {
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }

            return this; 
        }

        dom.prototype.text = function () {
            return this.el.textContent;
        }

        dom.prototype.css = function (key, value) {
            if (arguments.length == 2) {
                this.el.style[key] = value; 
            } else if (arguments.length == 1) {

                if (typeof key == 'string') {
                    return getComputedStyle(this.el)[key];
                } else {
                    var keys = key || {};
                    for(var k in keys) {
                        this.el.style[k] = keys[k];
                    }
                }
                
            }

            return this; 
        }

        dom.prototype.offset = function () {
            var rect = this.el.getBoundingClientRect();

            return {
                top: rect.top + document.body.scrollTop,
                left: rect.left + document.body.scrollLeft
            };
        }   

        dom.prototype.width = function () {
            return this.el.offsetWidth; 
        }

        dom.prototype.height = function () {
            return this.el.offsetHeight; 
        }

        dom.prototype.dataKey = function (key) {
            return this.uniqId + '.' + key; 
        }

        dom.prototype.data = function (key, value) {
            if (arguments.length == 2) {
                cached[this.dataKey(key)] = value; 
            } else if (arguments.length == 1) {
                return cached[this.dataKey(key)];
            } else {
                var keys = Object.keys(cached);
                
                var id = this.uniqId + ".";
                return keys.filter(function (key) {
                    if (key.indexOf(uniqId) == 0) {
                       return true;      
                    }

                    return false; 
                }).map(function (value) {
                    return cached[value];
                })
            }

            return this; 
        }

        dom.prototype.val = function (value) {
            if (arguments.length == 0) {
                return this.el.value; 
            } else if (arguments.length == 1) {
                this.el.value = value; 
            }

            return this; 
        }

        dom.prototype.int = function () {
            return parseInt(this.val(), 10);
        }

        dom.prototype.show = function () {
            return this.css('display', 'block');
        }

        dom.prototype.hide = function () {
            return this.css('display', 'none');
        }

        function setInputColor(evtType) {
            var rgb = null;

            if (evtType == 'hex') {
                rgb = color.parse($informationInput1.val());

                $informationInput2.val(rgb.r);
                $informationInput3.val(rgb.g);
                $informationInput4.val(rgb.b);

            } else if (evtType == 'rgb') {
                $informationInput1.val(color.format({
                    r : $informationInput2.int(),
                    g : $informationInput3.int(),
                    b : $informationInput4.int()
                }, 'hex'));

                rgb = color.parse($informationInput1.val());

            } else {
                var str = getColor('hex');

                $informationInput1.val( str);

                rgb = color.parse($informationInput1.val());
                $informationInput2.val( rgb.r);
                $informationInput3.val( rgb.g);
                $informationInput4.val( rgb.b);
            }

            // set alpha
            rgb.a = caculateOpacity();

            // set background
            $controlColor.css('background-color', color.format(rgb, 'hex'));
            $opacityInput.val(Math.floor(rgb.a * 100) + "%");

            if (typeof colorpickerCallback == 'function') {

                if (!isNaN(rgb.a)) {
                    colorpickerCallback(color.format(rgb, 'hex' ), rgb);
                }
   
            }
        }

        function setMainColor(e) {
            var offset = $color.offset();
            var w = $color.width();
            var h = $color.height();

            var x = e.clientX - offset.left;
            var y = e.clientY - offset.top;

            if (x < 0) x = 0;
            else if (x > w) x = w;

            if (y < 0) y = 0;
            else if (y > h) y = h;

            $drag_pointer.css({
                left: (x - 5) + 'px',
                top: (y - 5) + 'px'
            });
            
            $drag_pointer.data('pos', { x: x, y : y});

            setInputColor();
        }

        function scale (startColor, endColor, t) {
            var obj = {
                r : parseInt(startColor.r + (endColor.r - startColor.r) * t, 10) ,
                g : parseInt(startColor.g + (endColor.g - startColor.g) * t, 10),
                b : parseInt(startColor.b + (endColor.b - startColor.b) * t, 10)
            };

            return color.format(obj, 'hex');

        }

        function checkHueColor(p) {
            var startColor, endColor;

            for(var i = 0; i < hue_color.length;i++) {
                if (hue_color[i].start >= p) {
                    startColor = hue_color[i-1];
                    endColor = hue_color[i];
                    break;
                }
            }

            if (startColor && endColor) {
                return scale(startColor, endColor, (p - startColor.start)/(endColor.start - startColor.start));
            }

            return hue_color[0];
        }

        function setHueColor(e) {
            var min = $hueContainer.offset().left;
            var max = min + $hueContainer.width();
            var current = pos(e).clientX;

            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            var x = ($hue.width() * (dist/100));

            $drag_bar.css({
                left: (x -Math.ceil($drag_bar.width()/2)) + 'px'
            });
            
            $drag_bar.data('pos', { x : x});

            var hueColor = checkHueColor(dist/100);

            $color.css("background-color", hueColor);

            setInputColor();
        }

        function setOpacity(e) {
            var min = $opacity.offset().left;
            var max = min + $opacity.width();
            var current = pos(e).clientX;

            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            var x = ($opacity.width() * (dist/100));

            $opacity_drag_bar.css({
                left: (x -Math.ceil($opacity_drag_bar.width()/2)) + 'px'
            });
            
            $opacity_drag_bar.data('pos', { x : x });

            setInputColor();
        }

        function caculateOpacity() {
            var opacityPos = $opacity_drag_bar.data('pos') || { x : 0 };
            var a = Math.round((opacityPos.x / $opacity.width()) * 100) / 100;

            return a;
        }

        function calculateColor() {
            var pos = $drag_pointer.data('pos') || { x : 0, y : 0 };
            var huePos = $drag_bar.data('pos') || { x : 0 };

            var width = $color.width();
            var height = $color.height();

            var h = (huePos.x / $hue.width()) * 360;
            var s = (pos.x / width);
            var v = ((height - pos.y) / height);

            if (width == 0) {
                h = 0;
                s = 0;
                v = 0;
            }

            var rgb = color.HSVtoRGB(h, s, v);
            rgb.a = caculateOpacity();

            return rgb;
        }

        function pos(e) {
            if (e.touches && e.touches[0]) {
                return e.touches[0];
            }

            return e;
        }

        function checkNumberKey(e) {
            var code = e.which,
                isExcept = false;

            if(code == 37 || code == 39 || code == 8 || code == 46 || code == 9)
                isExcept = true;

            if(!isExcept && (code < 48 || code > 57))
                return false;

            return true;
        }

        function setRGBtoHexColor(e) {
            var r = $informationInput2.val(),
                g = $informationInput3.val(),
                b = $informationInput4.val();

            if(r == "" || g == "" || b == "") return;

            if(parseInt(r) > 255) $informationInput2.val(255);
            else $informationInput2.val(parseInt(r));

            if(parseInt(g) > 255) $informationInput3.val(255);
            else $informationInput3.val(parseInt(g));

            if(parseInt(b) > 255) $informationInput4.val(255);
            else $informationInput4.val(parseInt(b));

            initColor(color.format({
                r: $informationInput2.int(),
                g: $informationInput3.int(),
                b: $informationInput4.int()
            }, "hex"), "rgb");
        }

        function initColor(newColor, evtType, callback) {
            var c = newColor || "#FF0000",
                rgb = color.parse(c);

            $color.css("background-color", c);

            var hsv = color.RGBtoHSV(rgb.r, rgb.g, rgb.b),
                x = $color.width() * hsv.s,
                y = $color.height() * ( 1 - hsv.v);

            $drag_pointer.css({
                left : (x - 5) + "px",
                top : (y - 5) + "px"
            });
            
            $drag_pointer.data('pos', { x  : x, y : y });

            var hueX = $hue.width() * (hsv.h / 360);

            $drag_bar.css({
                left : (hueX - 7.5) + 'px'
            });
            
            $drag_bar.data('pos', { x : hueX });

            var opacityX = $opacity.width() * (rgb.a || 0);

            $opacity_drag_bar.css({
                left : (opacityX - 7.5) + 'px'
            });
            
            $opacity_drag_bar.data('pos', { x : opacityX });

            setInputColor(evtType);

            if (callback) {
                colorpickerCallback = callback; 
            }

        }

        function addEvent (dom, eventName, callback) {
            dom.addEventListener(eventName, callback);
        }

        function removeEvent(dom, eventName, callback) {
            dom.removeEventListener(eventName, callback);
        }

        function initEvent() {
            addEvent($color.el, 'mousedown', function(e) {
                $color.data('isDown', true);
                setMainColor(e);
            });

            addEvent($color.el, 'mouseup', function(e) {
                $color.data('isDown', false);
            });

            addEvent($drag_bar.el, 'mousedown', function(e) {
                e.preventDefault();
                $hue.data('isDown', true);
            });

            addEvent($opacity_drag_bar.el, 'mousedown', function(e) {
                e.preventDefault();
                $opacity.data('isDown', true);
            });

            addEvent($hueContainer.el, 'mousedown', function(e) {
                $hue.data('isDown', true);
                setHueColor(e);
            });

            addEvent($opacityContainer.el, 'mousedown', function(e) {
                $opacity.data('isDown', true);
                setOpacity(e);
            });

            addEvent($informationInput1.el, 'keydown', function(e) {
                if(e.which < 65 || e.which > 70) {
                    return checkNumberKey(e);
                }
            });
            addEvent($informationInput1.el, 'keyup', function(e) {
                var code = $informationInput1.val();

                if(code.charAt(0) == '#' && code.length == 7) {
                    initColor(code, 'hex');
                }
            });

            addEvent($informationInput2.el, 'keydown', checkNumberKey);
            addEvent($informationInput2.el, 'keyup', setRGBtoHexColor);
            addEvent($informationInput3.el, 'keydown', checkNumberKey);
            addEvent($informationInput3.el, 'keyup', setRGBtoHexColor);
            addEvent($informationInput4.el, 'keydown', checkNumberKey);
            addEvent($informationInput4.el, 'keyup', setRGBtoHexColor);

            addEvent(document, 'mouseup', function (e) {
                $color.data('isDown', false);
                $hue.data('isDown', false);
                $opacity.data('isDown', false);
            });

            addEvent(document, 'mousemove', function (e) {
                if ($color.data('isDown')) {
                    setMainColor(e);
                }

                if ($hue.data('isDown')) {
                    setHueColor(e);
                }

                if ($opacity.data('isDown')) {
                    setOpacity(e);
                }
            });
        }

        function init() {
            self = this, opts = this.options;

            $root = new dom('div', 'codemirror-colorpicker');
            $color = new dom('div', 'color');
            $drag_pointer = new dom('div', 'drag-pointer' );
            $value = new dom( 'div', 'value' );
            $saturation = new dom('div', 'saturation' );

            $control = new dom('div', 'control' );
            $controlPattern = new dom('div', 'empty' );
            $controlColor = new dom('div', 'color' );
            $hue = new dom('div', 'hue' );
            $hueContainer = new dom('div', 'hue-container' );
            $drag_bar = new dom('div', 'drag-bar' );
            $opacity = new dom('div', 'opacity' );
            $opacityContainer = new dom('div', 'opacity-container' );
            $opacityInput = new dom('input', 'input', {'type': 'text', 'disabled': true });
            $opacity_drag_bar = new dom('div', 'drag-bar2' );

            $information = new dom('div', 'information' );
            $informationTitle1 = new dom('div', 'title' ).html("HEX");
            $informationTitle2 = new dom('div', 'title' ).html("R");
            $informationTitle3 = new dom('div', 'title' ).html("G");
            $informationTitle4 = new dom('div', 'title' ).html("B");
            $informationInput1 = new dom('input', 'input', {'type': 'text', 'maxlength': 7 });
            $informationInput2 = new dom('input', 'input', {'type': 'text', 'maxlength': 3  });
            $informationInput3 = new dom('input', 'input', {'type': 'text', 'maxlength': 3  });
            $informationInput4 = new dom('input', 'input', {'type': 'text', 'maxlength': 3  });

            $value.append($drag_pointer);
            $saturation.append($value);
            $color.append($saturation);

            $hueContainer.append($drag_bar);
            $hue.append($hueContainer);

            $opacityContainer.append($opacity_drag_bar);
            $opacity.append($opacityContainer);

            $control.append($hue);
            $control.append($opacity);
            $control.append($opacityInput);
            $control.append($controlPattern);
            $control.append($controlColor);

            $information.append($informationInput1);
            $information.append($informationInput2);
            $information.append($informationInput3);
            $information.append($informationInput4);
            $information.append($informationTitle1);
            $information.append($informationTitle2);
            $information.append($informationTitle3);
            $information.append($informationTitle4);

            $root.append($color);
            $root.append($control);
            $root.append($information);

            initHueColors();
            initEvent();
            initColor();
        };

        function initHueColors () {
            for(var i = 0, len = hue_color.length; i < len; i++) {
                var hue = hue_color[i];

                var obj = color.parse(hue.rgb);

                hue.r = obj.r;
                hue.g = obj.g;
                hue.b = obj.b; 
            }
        }

        /**
         * public methods 
         */
        function setColor(value) {
            if(typeof(value) == "object") {
                if(!value.r || !value.g || !value.b)
                    return;

                initColor(color.format(value, "hex"));
            } else if(typeof(value) == "string") {
                if(value.charAt(0) != "#")
                    return;

                initColor(value);
            }
        }

        function getColor(type) {
            var rgb = calculateColor();

            if (type) {
                if (type == 'hex') {
                    if (rgb.a < 1) {
                        type = 'rgb';
                    }
                }
                return color.format(rgb, type);
            }

            return rgb;
        }


        function show (line, ch, color,  callback) {
            $root.appendTo(document.body);
            $root.show();
            isColorPickerShow = true; 
            initColor(color, 'hex', function (colorString, rgb) {
                callback(colorString);
            });     
            var pos = cm.charCoords({line : line, ch : ch });       

            $root.css({
                position: 'absolute',
                left : pos.left + 'px',
                top : (pos.bottom) + 'px'
            });

        }

        function hide () {
            if (isColorPickerShow) {
                $root.hide();
                $root.remove();
                isColorPickerShow = false; 
            }

        }

        init();

        return {
            show: show,
            hide: hide,
            setColor: setColor,
            getColor: getColor 
        }
    })

});
