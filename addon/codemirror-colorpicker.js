(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var CodeMirrorColorPicker = (function (CodeMirror) {
'use strict';

CodeMirror = CodeMirror && CodeMirror.hasOwnProperty('default') ? CodeMirror['default'] : CodeMirror;

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

        Object.keys(histogram).forEach(function (color$$1) {

            if (!omit[color$$1]) {

                var array = histogram[color$$1];
                var ymax = Math.max.apply(Math, array);
                var unitWith = width / array.length;

                context.fillStyle = color$$1;
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
            var grayIndex = Math.round(color.brightness(pixels[i], pixels[i + 1], pixels[i + 2]));
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

            var ctx = this.context;
            var img = new Image();
            img.onload = function () {
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

var color_regexp = /(#(?:[\da-f]{3}){1,2}|rgb\((?:\s*\d{1,3},\s*){2}\d{1,3}\s*\)|rgba\((?:\s*\d{1,3},\s*){3}\d*\.?\d+\s*\)|hsl\(\s*\d{1,3}(?:,\s*\d{1,3}%){2}\s*\)|hsla\(\s*\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\s*\)|([\w_\-]+))/gi;
var color_split = ',';
var color = {

    matches: function matches(str) {
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
    },

    convertMatches: function convertMatches(str) {
        var matches = this.matches(str);

        matches.forEach(function (it, index) {
            str = str.replace(it.color, '@' + index);
        });

        return { str: str, matches: matches };
    },

    convertMatchesArray: function convertMatchesArray(str) {
        var _this = this;

        var splitStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : color_split;

        var ret = this.convertMatches(str);
        return ret.str.split(splitStr).map(function (it, index) {
            it = _this.trim(it);

            if (ret.matches[index]) {
                it = it.replace('@' + index, ret.matches[index].color);
            }

            return it;
        });
    },

    reverseMatches: function reverseMatches(str, matches) {
        matches.forEach(function (it, index) {
            str = str.replace('@' + index, it.color);
        });

        return str;
    },

    trim: function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    },

    round: function round(n) {
        var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        return Math.round(n * k) / k;
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
    format: function format(obj, type) {
        var defaultColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgba(0, 0, 0, 0)';


        if (Array.isArray(obj)) {
            obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] };
        }

        if (type == 'hex') {
            return this.hex(obj);
        } else if (type == 'rgb') {
            return this.rgb(obj, defaultColor);
        } else if (type == 'hsl') {
            return this.hsl(obj);
        }

        return obj;
    },
    hex: function hex(obj) {
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
    },
    rgb: function rgb(obj) {
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
    },
    hsl: function hsl(obj) {
        if (Array.isArray(obj)) {
            obj = { r: obj[0], g: obj[1], b: obj[2], a: obj[3] };
        }

        if (obj.a == 1 || typeof obj.a == 'undefined') {
            return 'hsl(' + obj.h + ',' + obj.s + '%,' + obj.l + '%)';
        } else {
            return 'hsla(' + obj.h + ',' + obj.s + '%,' + obj.l + '%,' + obj.a + ')';
        }
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
    parse: function parse(str) {
        if (typeof str == 'string') {

            if (ColorNames.isColorName(str)) {
                str = ColorNames.getColorByName(str);
            }

            if (str.indexOf("rgb(") > -1) {
                var arr = str.replace("rgb(", "").replace(")", "").split(",");

                for (var i = 0, len = arr.length; i < len; i++) {
                    arr[i] = parseInt(color.trim(arr[i]), 10);
                }

                var obj = { type: 'rgb', r: arr[0], g: arr[1], b: arr[2], a: 1 };

                obj = Object.assign(obj, this.RGBtoHSL(obj));

                return obj;
            } else if (str.indexOf("rgba(") > -1) {
                var arr = str.replace("rgba(", "").replace(")", "").split(",");

                for (var i = 0, len = arr.length; i < len; i++) {

                    if (len - 1 == i) {
                        arr[i] = parseFloat(color.trim(arr[i]));
                    } else {
                        arr[i] = parseInt(color.trim(arr[i]), 10);
                    }
                }

                var obj = { type: 'rgb', r: arr[0], g: arr[1], b: arr[2], a: arr[3] };

                obj = Object.assign(obj, this.RGBtoHSL(obj));

                return obj;
            } else if (str.indexOf("hsl(") > -1) {
                var arr = str.replace("hsl(", "").replace(")", "").split(",");

                for (var i = 0, len = arr.length; i < len; i++) {
                    arr[i] = parseFloat(color.trim(arr[i]));
                }

                var obj = { type: 'hsl', h: arr[0], s: arr[1], l: arr[2], a: 1 };

                obj = Object.assign(obj, this.HSLtoRGB(obj));

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

                obj = Object.assign(obj, color.HSLtoRGB(obj));

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

                obj = Object.assign(obj, this.RGBtoHSL(obj));

                return obj;
            }
        } else if (typeof str == 'number') {
            if (0x000000 <= str && str <= 0xffffff) {
                var r = (str & 0xff0000) >> 16;
                var g = (str & 0x00ff00) >> 8;
                var b = (str & 0x0000ff) >> 0;

                var obj = { type: 'hex', r: r, g: g, b: b, a: 1 };
                obj = Object.assign(obj, this.RGBtoHSL(obj));
                return obj;
            } else if (0x00000000 <= str && str <= 0xffffffff) {
                var _r = (str & 0xff000000) >> 24;
                var _g = (str & 0x00ff0000) >> 16;
                var _b = (str & 0x0000ff00) >> 8;
                var a = (str & 0x000000ff) / 255;

                var obj = { type: 'hex', r: _r, g: _g, b: _b, a: a };
                obj = Object.assign(obj, this.RGBtoHSL(obj));
                return obj;
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
    HSVtoRGB: function HSVtoRGB(h, s, v) {

        if (arguments.length == 1) {
            var _arguments$ = arguments[0],
                h = _arguments$.h,
                s = _arguments$.s,
                v = _arguments$.v;
        }

        var H = h;
        var S = s;
        var V = v;

        if (H == 360) {
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
            r: this.round((temp[0] + m) * 255),
            g: this.round((temp[1] + m) * 255),
            b: this.round((temp[2] + m) * 255)
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
    RGBtoHSV: function RGBtoHSV(r, g, b) {

        if (arguments.length == 1) {
            var _arguments$2 = arguments[0],
                r = _arguments$2.r,
                g = _arguments$2.g,
                b = _arguments$2.b;
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
    },
    HSVtoHSL: function HSVtoHSL(h, s, v) {

        if (arguments.length == 1) {
            var _arguments$3 = arguments[0],
                h = _arguments$3.h,
                s = _arguments$3.s,
                v = _arguments$3.v;
        }

        var rgb = this.HSVtoRGB(h, s, v);

        return this.RGBtoHSL(rgb.r, rgb.g, rgb.b);
    },
    RGBtoCMYK: function RGBtoCMYK(r, g, b) {

        if (arguments.length == 1) {
            var _arguments$4 = arguments[0],
                r = _arguments$4.r,
                g = _arguments$4.g,
                b = _arguments$4.b;
        }

        var R1 = r / 255;
        var G1 = g / 255;
        var B1 = b / 255;

        var K = 1 - Math.max(R1, G1, B1);
        var C = (1 - R1 - K) / (1 - K);
        var M = (1 - G1 - K) / (1 - K);
        var Y = (1 - B1 - K) / (1 - K);

        return { c: C, m: M, y: Y, k: K };
    },
    CMYKtoRGB: function CMYKtoRGB(c, m, y, k) {

        if (arguments.length == 1) {
            var _arguments$5 = arguments[0],
                c = _arguments$5.c,
                m = _arguments$5.m,
                y = _arguments$5.y,
                k = _arguments$5.k;
        }

        var R = 255 * (1 - c) * (1 - k);
        var G = 255 * (1 - m) * (1 - k);
        var B = 255 * (1 - y) * (1 - k);

        return { r: R, g: G, b: B };
    },
    RGBtoHSL: function RGBtoHSL(r, g, b) {

        if (arguments.length == 1) {
            var _arguments$6 = arguments[0],
                r = _arguments$6.r,
                g = _arguments$6.g,
                b = _arguments$6.b;
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

        return { h: this.round(h * 360), s: this.round(s * 100), l: this.round(l * 100) };
    },
    HUEtoRGB: function HUEtoRGB(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    },
    HSLtoHSV: function HSLtoHSV(h, s, l) {

        if (arguments.length == 1) {
            var _arguments$7 = arguments[0],
                h = _arguments$7.h,
                s = _arguments$7.s,
                v = _arguments$7.v;
        }
        var rgb = this.HSLtoRGB(h, s, l);

        return this.RGBtoHSV(rgb.r, rgb.g, rgb.b);
    },
    HSLtoRGB: function HSLtoRGB(h, s, l) {

        if (arguments.length == 1) {
            var _arguments$8 = arguments[0],
                h = _arguments$8.h,
                s = _arguments$8.s,
                l = _arguments$8.l;
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

        return { r: this.round(r * 255), g: this.round(g * 255), b: this.round(b * 255) };
    },
    c: function c(r, g, b) {

        if (arguments.length == 1) {
            var _arguments$9 = arguments[0],
                r = _arguments$9.r,
                g = _arguments$9.g,
                b = _arguments$9.b;
        }
        return this.gray((r + g + b) / 3 > 90 ? 0 : 255);
    },
    gray: function gray(_gray) {
        return { r: _gray, g: _gray, b: _gray };
    },
    RGBtoSimpleGray: function RGBtoSimpleGray(r, g, b) {

        if (arguments.length == 1) {
            var _arguments$10 = arguments[0],
                r = _arguments$10.r,
                g = _arguments$10.g,
                b = _arguments$10.b;
        }
        return this.gray(Math.ceil((r + g + b) / 3));
    },
    RGBtoGray: function RGBtoGray(r, g, b) {

        if (arguments.length == 1) {
            var _arguments$11 = arguments[0],
                r = _arguments$11.r,
                g = _arguments$11.g,
                b = _arguments$11.b;
        }
        return this.gray(this.RGBtoYCrCb(r, g, b).y);
    },
    brightness: function brightness(r, g, b) {
        return Math.ceil(r * 0.2126 + g * 0.7152 + b * 0.0722);
    },
    RGBtoYCrCb: function RGBtoYCrCb(r, g, b) {

        if (arguments.length == 1) {
            var _arguments$12 = arguments[0],
                r = _arguments$12.r,
                g = _arguments$12.g,
                b = _arguments$12.b;
        }
        var Y = this.brightness(r, g, b);
        var Cb = 0.564 * (b - Y);
        var Cr = 0.713 * (r - Y);

        return { y: Y, cr: Cr, cb: Cb };
    },
    YCrCbtoRGB: function YCrCbtoRGB(y, cr, cb, bit) {

        if (arguments.length == 1) {
            var _arguments$13 = arguments[0],
                y = _arguments$13.y,
                cr = _arguments$13.cr,
                cb = _arguments$13.cb,
                bit = _arguments$13.bit;

            bit = bit || 0;
        }
        var R = y + 1.402 * (cr - bit);
        var G = y - 0.344 * (cb - bit) - 0.714 * (cr - bit);
        var B = y + 1.772 * (cb - bit);

        return { r: Math.ceil(R), g: Math.ceil(G), b: Math.ceil(B) };
    },
    ReverseRGB: function ReverseRGB(n) {
        return n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : 12.92 * n;
    },
    XYZtoRGB: function XYZtoRGB(x, y, z) {
        if (arguments.length == 1) {
            var _arguments$14 = arguments[0],
                x = _arguments$14.x,
                y = _arguments$14.y,
                z = _arguments$14.z;
        }
        //X, Y and Z input refer to a D65/2° standard illuminant.
        //sR, sG and sB (standard RGB) output range = 0 ÷ 255

        var X = x / 100.0;
        var Y = y / 100.0;
        var Z = z / 100.0;

        var R = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
        var G = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
        var B = X * 0.0557 + Y * -0.2040 + Z * 1.0570;

        R = this.ReverseRGB(R);
        G = this.ReverseRGB(G);
        B = this.ReverseRGB(B);

        var r = this.round(R * 255);
        var g = this.round(G * 255);
        var b = this.round(B * 255);

        return { r: r, g: g, b: b };
    },
    PivotRGB: function PivotRGB(n) {
        return (n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) * 100;
    },
    RGBtoXYZ: function RGBtoXYZ(r, g, b) {
        //sR, sG and sB (Standard RGB) input range = 0 ÷ 255
        //X, Y and Z output refer to a D65/2° standard illuminant.
        if (arguments.length == 1) {
            var _arguments$15 = arguments[0],
                r = _arguments$15.r,
                g = _arguments$15.g,
                b = _arguments$15.b;
        }

        var R = r / 255;
        var G = g / 255;
        var B = b / 255;

        R = this.PivotRGB(R);
        G = this.PivotRGB(G);
        B = this.PivotRGB(B);

        var x = R * 0.4124 + G * 0.3576 + B * 0.1805;
        var y = R * 0.2126 + G * 0.7152 + B * 0.0722;
        var z = R * 0.0193 + G * 0.1192 + B * 0.9505;

        return { x: x, y: y, z: z };
    },
    ReverseXyz: function ReverseXyz(n) {
        return Math.pow(n, 3) > 0.008856 ? Math.pow(n, 3) : (n - 16 / 116) / 7.787;
    },
    LABtoXYZ: function LABtoXYZ(l, a, b) {
        if (arguments.length == 1) {
            var _arguments$16 = arguments[0],
                l = _arguments$16.l,
                a = _arguments$16.a,
                b = _arguments$16.b;
        }
        //Reference-X, Y and Z refer to specific illuminants and observers.
        //Common reference values are available below in this same page.

        var Y = (l + 16) / 116;
        var X = a / 500 + Y;
        var Z = Y - b / 200;

        Y = this.ReverseXyz(Y);
        X = this.ReverseXyz(X);
        Z = this.ReverseXyz(Z);

        var x = X * 95.047;
        var y = Y * 100.000;
        var z = Z * 108.883;

        return { x: x, y: y, z: z };
    },
    PivotXyz: function PivotXyz(n) {
        return n > 0.008856 ? Math.pow(n, 1 / 3) : (7.787 * n + 16) / 116;
    },
    XYZtoLAB: function XYZtoLAB(x, y, z) {
        if (arguments.length == 1) {
            var _arguments$17 = arguments[0],
                x = _arguments$17.x,
                y = _arguments$17.y,
                z = _arguments$17.z;
        }

        //Reference-X, Y and Z refer to specific illuminants and observers.
        //Common reference values are available below in this same page.
        // Observer= 2°, Illuminant= D65

        var X = x / 95.047;
        var Y = y / 100.00;
        var Z = z / 108.883;

        X = this.PivotXyz(X);
        Y = this.PivotXyz(Y);
        Z = this.PivotXyz(Z);

        var l = 116 * Y - 16;
        var a = 500 * (X - Y);
        var b = 200 * (Y - Z);

        return { l: l, a: a, b: b };
    },
    RGBtoLAB: function RGBtoLAB(r, g, b) {
        if (arguments.length == 1) {
            var _arguments$18 = arguments[0],
                r = _arguments$18.r,
                g = _arguments$18.g,
                b = _arguments$18.b;
        }
        return this.XYZtoLAB(this.RGBtoXYZ(r, g, b));
    },
    LABtoRGB: function LABtoRGB(l, a, b) {
        if (arguments.length == 1) {
            var _arguments$19 = arguments[0],
                l = _arguments$19.l,
                a = _arguments$19.a,
                b = _arguments$19.b;
        }
        return this.XYZtoRGB(this.LABtoXYZ(l, a, b));
    },
    blend: function blend(startColor, endColor) {
        var ratio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
        var format = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

        var s = this.parse(startColor);
        var e = this.parse(endColor);

        return this.interpolateRGB(s, e, ratio, format);
    },
    mix: function mix(startcolor, endColor) {
        var ratio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
        var format = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

        return this.blend(startcolor, endColor, ratio, format);
    },


    /**
     * 
     * @param {Color|String} c 
     */
    contrast: function contrast(c) {
        c = this.parse(c);
        var contrast = (Math.round(c.r * 299) + Math.round(c.g * 587) + Math.round(c.b * 114)) / 1000;
        return contrast;
    },
    contrastColor: function contrastColor(c) {
        return this.contrast(c) >= 128 ? 'black' : 'white';
    },


    /**
     * @deprecated
     * 
     * instead of this,  use blend function 
     *  
     * @param {*} startColor 
     * @param {*} endColor 
     * @param {*} t 
     */
    interpolateRGB: function interpolateRGB(startColor, endColor) {
        var t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
        var format = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

        var obj = {
            r: this.round(startColor.r + (endColor.r - startColor.r) * t),
            g: this.round(startColor.g + (endColor.g - startColor.g) * t),
            b: this.round(startColor.b + (endColor.b - startColor.b) * t),
            a: this.round(startColor.a + (endColor.a - startColor.a) * t, 100)
        };

        return this.format(obj, obj.a < 1 ? 'rgb' : format);
    },
    scale: function scale(_scale) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

        if (!_scale) return [];

        if (typeof _scale === 'string') {
            _scale = this.convertMatchesArray(_scale);
        }

        _scale = _scale || [];
        var len = _scale.length;

        var colors = [];
        for (var i = 0; i < len - 1; i++) {
            for (var index = 0; index < count; index++) {
                colors.push(this.blend(_scale[i], _scale[i + 1], index / count));
            }
        }
        return colors;
    },
    parseGradient: function parseGradient(colors) {
        var _this2 = this;

        if (typeof colors == 'string') {
            colors = this.convertMatchesArray(colors);
        }

        colors = colors.map(function (it) {
            if (typeof it == 'string') {
                var ret = _this2.convertMatches(it);
                var arr = _this2.trim(ret.str).split(' ');

                if (arr[1]) {
                    if (arr[1].includes('%')) {
                        arr[1] = parseFloat(arr[1].replace(/%/, '')) / 100;
                    } else {
                        arr[1] = parseFloat(arr[1]);
                    }
                } else {
                    arr[1] = '*';
                }

                arr[0] = _this2.reverseMatches(arr[0], ret.matches);

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
    },
    gradient: function gradient(colors) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

        colors = this.parseGradient(colors);

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

            newColors = newColors.concat(this.scale([startColor, endColor], colorCount), [endColor]);

            allCount -= colorCount;
        }
        return newColors;
    },
    scaleHSV: function scaleHSV(color) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'h';
        var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 9;
        var format = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'rgb';
        var min = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var max = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
        var dist = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 100;

        var colorObj = this.parse(color);
        var hsv = this.RGBtoHSV(colorObj);
        var unit = (max - min) * dist / count;

        var results = [];
        for (var i = 1; i <= count; i++) {
            hsv[target] = Math.abs((dist - unit * i) / dist);
            results.push(this.format(this.HSVtoRGB(hsv), format));
        }

        return results;
    },
    scaleH: function scaleH(color) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9;
        var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgb';
        var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 360;

        return this.scaleHSV(color, 'h', count, format, min, max, 1);
    },
    scaleS: function scaleS(color) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9;
        var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgb';
        var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

        return this.scaleHSV(color, 's', count, format, min, max, 100);
    },
    scaleV: function scaleV(color) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9;
        var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgb';
        var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

        return this.scaleHSV(color, 'v', count, format, min, max, 100);
    },
    palette: function palette(colors) {
        var _this3 = this;

        var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
        var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'hex';


        if (colors.length > k) {
            colors = kmeans(colors, k);
        }

        return colors.map(function (c) {
            return _this3.format(c, format);
        });
    },
    ImageToRGB: function ImageToRGB(url) {
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
    },
    ImageToCanvas: function ImageToCanvas(url, filter, callback) {
        var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { frameTimer: 'full' };

        var img = new ImageLoader(url);
        img.loadImage(function () {
            img.toArray(filter, function (canvas) {
                if (typeof callback == 'function') {
                    callback(canvas);
                }
            }, Object.assign({
                returnTo: 'canvas'
            }, opt));
        });
    },
    ImageToURL: function ImageToURL(url, filter, callback) {
        var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { frameTimer: 'full' };

        var img = new ImageLoader(url);
        img.loadImage(function () {
            img.toArray(filter, function (datauri) {
                if (typeof callback == 'function') {
                    callback(datauri);
                }
            }, opt);
        });
    },
    histogram: function histogram(url, callback) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var img = new ImageLoader(url);
        img.loadImage(function () {
            if (typeof callback == 'function') {
                callback(img.toHistogram(opt));
            }
        });
    },
    ImageToHistogram: function ImageToHistogram(url, callback) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { width: 200, height: 100 };


        var img = new ImageLoader(url);
        img.loadImage(function () {
            Canvas.createHistogram(opt.width || 200, opt.height || 100, img.toHistogram(opt), function (canvas) {
                if (typeof callback == 'function') callback(canvas.toDataURL('image/png'));
            }, opt);
        });
    }
};

color.scale.parula = function (count) {
    return color.scale(['#352a87', '#0f5cdd', '#00b5a6', '#ffc337', '#fdff00'], count);
};

color.scale.jet = function (count) {
    return color.scale(['#00008f', '#0020ff', '#00ffff', '#51ff77', '#fdff00', '#ff0000', '#800000'], count);
};

color.scale.hsv = function (count) {
    return color.scale(['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'], count);
};

color.scale.hot = function (count) {
    return color.scale(['#0b0000', '#ff0000', '#ffff00', '#ffffff'], count);
};
color.scale.pink = function (count) {
    return color.scale(['#1e0000', '#bd7b7b', '#e7e5b2', '#ffffff'], count);
};

color.scale.bone = function (count) {
    return color.scale(['#000000', '#4a4a68', '#a6c6c6', '#ffffff'], count);
};

color.scale.copper = function (count) {
    return color.scale(['#000000', '#3d2618', '#9d623e', '#ffa167', '#ffc77f'], count);
};

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
        return color.interpolateRGB(startColor, endColor, (p - startColor.start) / (endColor.start - startColor.start));
    }

    return hue_color[0].rgb;
}

function initHueColors() {
    for (var i = 0, len = hue_color.length; i < len; i++) {
        var hue = hue_color[i];

        var obj = color.parse(hue.rgb);

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

var image = {
    crop: crop,
    resize: resize,
    flipH: flipH,
    flipV: flipV,
    rotate: rotate,
    rotateDegree: rotateDegree,
    'rotate-degree': rotateDegree
};

function bitonal(darkColor, lightColor) {
    var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

    var $darkColor = color.parse(darkColor);
    var $lightColor = color.parse(lightColor);
    var $threshold = threshold;

    return pixel(function () {
        var thresholdColor = $r + $g + $b <= $threshold ? $darkColor : $lightColor;

        $r = thresholdColor.r;
        $g = thresholdColor.g;
        $b = thresholdColor.b;
    }, {
        $darkColor: $darkColor,
        $lightColor: $lightColor,
        $threshold: $threshold
    });
}

function brightness() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    amount = parseParamNumber$1(amount);
    var $C = Math.floor(255 * (amount / 100));

    return pixel(function () {
        $r += $C;
        $g += $C;
        $b += $C;
    }, { $C: $C });
}

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

function contrast() {
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

function gradient() {
    // 전체 매개변수 기준으로 파싱 
    // 색이 아닌 것 기준으로 scale 변수로 인식 

    var params = [].concat(Array.prototype.slice.call(arguments));

    if (params.length === 1 && typeof params[0] === 'string') {
        params = color.convertMatchesArray(params[0]);
    }

    params = params.map(function (arg) {
        var res = color.matches(arg);

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

    var $colors = color.gradient(params, $scale).map(function (c) {
        var _Color$parse = color.parse(c),
            r = _Color$parse.r,
            g = _Color$parse.g,
            b = _Color$parse.b,
            a = _Color$parse.a;

        return { r: r, g: g, b: b, a: a };
    });

    return pixel(function () {
        var colorIndex = $clamp($Color.brightness($r, $g, $b));
        var newColorIndex = $clamp(Math.floor(colorIndex * ($scale / 256)));
        var color$$1 = $colors[newColorIndex];

        $r = color$$1.r;
        $g = color$$1.g;
        $b = color$$1.b;
        $a = $clamp(Math.floor(color$$1.a * 256));
    }, {
        $colors: $colors,
        $scale: $scale
    });
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

function sepia() {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    amount = parseParamNumber$1(amount);
    var C = amount / 100;
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
    brightness: brightness,
    clip: clip,
    contrast: contrast,
    gamma: gamma,
    gradient: gradient,
    grayscale: grayscale,
    hue: hue,
    invert: invert,
    noise: noise,
    opacity: opacity,
    saturation: saturation,
    sepia: sepia,
    shade: shade,
    solarize: solarize,
    threshold: threshold,
    'threshold-color': thresholdColor,
    tint: tint
};

function blur () {
    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    amount = parseParamNumber$1(amount);

    return convolution(createBlurMatrix(amount));
}

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

var matrix = {
     blur: blur,
     emboss: emboss,
     gaussianBlur: gaussianBlur,
     'gaussian-blur': gaussianBlur,
     gaussianBlur5x: gaussianBlur5x,
     'gaussian-blur-5x': gaussianBlur5x,
     grayscale2: grayscale2,
     identity: identity,
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
    return filter('kirsch-horizontal kirsch-vertical');
}

function sobel() {
    return filter('sobel-horizontal sobel-vertical');
}

function vintage() {
    return filter('brightness(15) saturation(-20) gamma(1.8)');
}

var multi$1 = {
    kirsch: kirsch,
    sobel: sobel,
    vintage: vintage
};

var ImageFilter$1 = _extends({}, image, pixel$1, matrix, multi$1);

var _functions;

var makeId = 0;

var functions = (_functions = {
    partial: partial,
    multi: multi,
    merge: merge,
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
    filter: filter,
    clamp: clamp,
    fillColor: fillColor,
    fillPixelColor: fillPixelColor
}, defineProperty(_functions, 'multi', multi), defineProperty(_functions, 'merge', merge), defineProperty(_functions, 'matches', matches), defineProperty(_functions, 'parseFilter', parseFilter), defineProperty(_functions, 'partial', partial), _functions);

var LocalFilter = functions;

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

function makeFilter(filter) {

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

    var filterFunction = ImageFilter$1[filterName] || LocalFilter[filterName];

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
        var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

        var arr = [].concat(toConsumableArray(Array(count)));

        var functionStrings = arr.map(function (countIndex) {
            var str = '\n                currentRunIndex = runIndex + i * step\n                if (currentRunIndex >= max) return {currentRunIndex: currentRunIndex, i: null};\n                callback(currentRunIndex); i++;\n            ';

            return str;
        }).join('\n\n');

        var smallLoopFunction = new Function('runIndex', 'i', 'step', 'max', 'callback', '\n            let currentRunIndex = runIndex;\n            \n            ' + functionStrings + '\n            \n            return {currentRunIndex: currentRunIndex, i: i} \n        ');

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
    }, opt.functionDumpCount, opt.frameTimer);
}

function eachXY(len, width, callback, done) {
    var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};


    forLoop(len, 0, 4, function (i) {
        var xyIndex = i >> 2;
        callback(i, xyIndex % width, Math.floor(xyIndex / width));
    }, function () {
        done();
    }, opt.functionDumpCount, opt.frameTimer);
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

function getBitmap(bitmap, area) {
    return Canvas.getBitmap(bitmap, area);
}

function putBitmap(bitmap, subBitmap, area) {
    return Canvas.putBitmap(bitmap, subBitmap, area);
}

function parseParamNumber$1(param) {
    if (typeof param === 'string') {
        param = param.replace(/deg/, '');
        param = param.replace(/px/, '');
    }
    return +param;
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
        return ' \n            ' + it.userFunction.$preContext + '\n\n            ' + it.userFunction.$preCallbackString + '\n\n            $r = $clamp($r); $g = $clamp($g); $b = $clamp($b); $a = $clamp($a);\n        ';
    }).join('\n\n');
    var FunctionCode = ' \n    let $r = $pixels[$pixelIndex], $g = $pixels[$pixelIndex+1], $b = $pixels[$pixelIndex+2], $a = $pixels[$pixelIndex+3];\n    \n    ' + codeString + '\n    \n    $pixels[$pixelIndex] = $r; $pixels[$pixelIndex+1] = $g; $pixels[$pixelIndex+2] = $b; $pixels[$pixelIndex+3] = $a;\n    ';

    var userFunction = new Function('$pixels', '$pixelIndex', '$clamp', '$Color', FunctionCode);

    return userFunction;
}

function makeUserFilterFunctionList(arr) {
    var list = arr.map(function (it) {
        var newKeys = [];

        Object.keys(it.context).forEach(function (key, i) {
            newKeys[key] = 'n$' + makeId++ + key + '$';
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

    list.forEach(function (it, i) {
        it.strPreContext = it.preContext.length ? 'const ' + it.preContext + ';' : "";
    });

    var preContext = list.map(function (it, i) {
        return it.strPreContext;
    }).join('\n\n');

    var preCallbackString = list.map(function (it) {
        return it.preCallbackString;
    }).join('\n\n');

    var FunctionCode = ' \n    let $r = $pixels[$pixelIndex], $g = $pixels[$pixelIndex+1], $b = $pixels[$pixelIndex+2], $a = $pixels[$pixelIndex+3];\n    \n    ' + preContext + '\n\n    ' + preCallbackString + '\n    \n    $pixels[$pixelIndex] = $r\n    $pixels[$pixelIndex+1] = $g \n    $pixels[$pixelIndex+2] = $b   \n    $pixels[$pixelIndex+3] = $a   \n    ';

    var userFunction = new Function('$pixels', '$pixelIndex', '$clamp', '$Color', FunctionCode);

    userFunction.$preCallbackString = preCallbackString;
    userFunction.$preContext = preContext;

    return userFunction;
}

function makeUserFilterFunction(callback, context) {
    return makeUserFilterFunctionList([{ callback: callback, context: context }]);
}

function pixel(callback, context) {
    var userFunction = makeUserFilterFunction(callback, context);

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



function createSubPixelWeightFunction(weights, width, height, opaque) {
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var alphaFac = opaque ? 1 : 0;

    var FunctionCode = 'let r = 0, g = 0, b = 0, a = 0, scy = 0, scx =0, si = 0; ';

    weights.forEach(function (wt, index) {
        var cy = Math.floor(index / side);
        var cx = index % side;
        var distY = cy - halfSide;
        var distX = cx - halfSide;

        FunctionCode += 'scy = $sy + (' + distY + '); scx = $sx + (' + distX + ');  if (scy >= 0 && scy  < ' + height + ' && scx >= 0 && scx < ' + width + ') { si = (scy * ' + width + ' + scx) << 2;  r += $sp[si] * (' + wt + '); g += $sp[si + 1] * (' + wt + '); b += $sp[si + 2] * (' + wt + '); a += $sp[si + 3] * (' + wt + ');  }\n        ';
    });

    FunctionCode += '$dp[$di] = r; $dp[$di+1] = g;$dp[$di+2] = b;$dp[$di+3] = a + (' + alphaFac + ')*(255-a); ';

    var subPixelFunction = new Function('$dp', '$sp', '$di', '$sx', '$sy', FunctionCode);

    return subPixelFunction;
}

function convolution(weights) {
    var opaque = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return function (bitmap, done) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var newBitmap = createBitmap(bitmap.pixels.length, bitmap.width, bitmap.height);

        var subPixelWeightFunction = createSubPixelWeightFunction(weights, bitmap.width, bitmap.height, opaque);

        packXY(function (pixels, i, x, y) {
            subPixelWeightFunction(pixels, bitmap.pixels, i, x, y);
        })(newBitmap, function () {
            done(newBitmap);
        }, opt);
    };
}

function matches(str) {
    var ret = Color.convertMatches(str);
    var matches = ret.str.match(filter_regexp);
    var result = [];

    if (!matches) {
        return result;
    }

    result = matches.map(function (it) {
        return { filter: it, origin: Color.reverseMatches(it, ret.matches) };
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

    var ret = Color.convertMatches(filterString);
    var matches = ret.str.match(filter_regexp);

    if (!matches[0]) {
        return [];
    }

    var arr = matches[0].split('(');

    var filterName = arr.shift();
    var filterParams = [];

    if (arr.length) {
        filterParams = arr.shift().split(')')[0].split(',').map(function (f) {
            return Color.reverseMatches(f, ret.matches);
        });
    }

    var result = [filterName].concat(toConsumableArray(filterParams)).map(Color.trim);

    return result;
}

function clamp(num) {
    return Math.min(255, num);
}

function filter(str) {
    return merge(matches(str).map(function (it) {
        return it.arr;
    }));
}

function makeGroupedFilter() {
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
                    forLoop(bitmap.pixels.length, 0, 4, function (i) {
                        userFunction(bitmap.pixels, i, clamp, Color);
                    }, function () {
                        done(bitmap);
                    });
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
function multi() {
    for (var _len = arguments.length, filters = Array(_len), _key = 0; _key < _len; _key++) {
        filters[_key] = arguments[_key];
    }

    filters = filters.map(function (filter) {
        return makeFilter(filter);
    }).filter(function (f) {
        return f;
    });

    filters = makeGroupedFilter(filters);

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

function merge(filters) {
    return multi.apply(undefined, toConsumableArray(filters));
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
        allFilter = filter(filters[0]);
    } else {
        allFilter = merge(filters);
    }

    return function (bitmap, done) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        allFilter(getBitmap(bitmap, area), function (newBitmap) {
            done(putBitmap(bitmap, newBitmap, area));
        }, opt);
    };
}

// TODO: worker run 
var ImageFilter = _extends({}, ImageFilter$1, functions);

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
            this.el.className = (' ' + this.el.className + ' ').replace(' ' + cls + ' ', ' ').trim();
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
        }
    }, {
        key: 'toggleClass',
        value: function toggleClass(cls) {
            if (this.hasClass(cls)) {
                this.removeClass(cls);
            } else {
                this.addClass(cls);
            }
        }
    }, {
        key: 'html',
        value: function html(_html) {

            if (typeof _html == 'string') {
                this.el.innerHTML = _html;
            } else {
                this.empty().append(_html);
            }

            return this;
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
        value: function text() {
            return this.el.textContent;
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
        key: 'offset',
        value: function offset() {
            var rect = this.el.getBoundingClientRect();
            return {
                top: rect.top + document.documentElement.scrollTop,
                left: rect.left + document.documentElement.scrollLeft
            };
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
                return this.el.getBoundingClientRect();
            }
        }
    }, {
        key: 'width',
        value: function width() {
            return this.el.offsetWidth;
        }
    }, {
        key: 'contentWidth',
        value: function contentWidth() {
            return this.width() - this.cssFloat('padding-left') - this.cssFloat('padding-right');
        }
    }, {
        key: 'height',
        value: function height() {
            return this.el.offsetHeight;
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
        value: function toggle() {
            if (this.css('display') == 'none') {
                return this.show();
            } else {
                return this.hide();
            }
        }
    }, {
        key: 'scrollTop',
        value: function scrollTop() {
            if (this.el === document.body) {
                return document.documentElement.scrollTop;
            }

            return this.el.scrollTop;
        }
    }, {
        key: 'scrollLeft',
        value: function scrollLeft() {
            if (this.el === document.body) {
                return document.documentElement.scrollLeft;
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
    }]);
    return Dom;
}();

var Event = {
    addEvent: function addEvent(dom, eventName, callback) {
        dom.addEventListener(eventName, callback);
    },
    removeEvent: function removeEvent(dom, eventName, callback) {
        dom.removeEventListener(eventName, callback);
    },
    pos: function pos(e) {
        if (e.touches && e.touches[0]) {
            return e.touches[0];
        }

        return e;
    }
};

var DELEGATE_SPLIT = '.';

var State = function () {
  function State(masterObj) {
    var settingObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, State);


    this.masterObj = masterObj;
    this.settingObj = settingObj;
  }

  createClass(State, [{
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

        var obj = this.masterObj[arr[0]] || this.masterObj;
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

var CHECK_EVENT_PATTERN = /^(click|mouse(down|up|move|enter|leave)|key(down|up|press)|contextmenu|change|input)/ig;
var EVENT_SAPARATOR = ' ';
var META_KEYS = ['Control', 'Shift', 'Alt', 'Meta'];

var EventMachin = function () {
  function EventMachin() {
    classCallCheck(this, EventMachin);

    this.state = new State(this);
  }

  createClass(EventMachin, [{
    key: 'initializeEvent',
    value: function initializeEvent() {
      this.initializeEventMachin();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.destroyEventMachin();
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
  }, {
    key: 'filterProps',
    value: function filterProps(pattern) {
      return Object.getOwnPropertyNames(this.__proto__).filter(function (key) {
        return key.match(pattern);
      });
    }
  }, {
    key: 'parseEvent',
    value: function parseEvent(key) {
      var arr = key.split(EVENT_SAPARATOR);

      this.bindingEvent(arr, this[key].bind(this));
    }
  }, {
    key: 'getDefaultDomElement',
    value: function getDefaultDomElement(dom) {
      var el = void 0;

      if (dom) {
        el = this[dom] || window[dom];
      } else {
        el = this.el || this.$el || this.$root;
      }

      if (el instanceof Dom) {
        return el.getElement();
      }

      return el;
    }
  }, {
    key: 'getDefaultEventObject',
    value: function getDefaultEventObject(eventName) {
      var _this = this;

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
        return !!_this[code];
      });

      arr = arr.filter(function (code) {
        return checkMethodList.includes(code) === false;
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
      var _this2 = this;

      var onlyControl = e.ctrlKey ? eventObject.isControl : true;
      var onlyShift = e.shiftKey ? eventObject.isShift : true;
      var onlyAlt = e.altKey ? eventObject.isAlt : true;
      var onlyMeta = e.metaKey ? eventObject.isMeta : true;

      var hasKeyCode = true;
      if (eventObject.codes.length) {
        hasKeyCode = eventObject.codes.includes(e.code.toLowerCase()) || eventObject.codes.includes(e.key.toLowerCase());
      }

      var isAllCheck = true;
      if (eventObject.checkMethodList.length) {
        // 체크 메소드들은 모든 메소드를 다 적용해야한다. 
        isAllCheck = eventObject.checkMethodList.every(function (method) {
          return _this2[method].call(_this2, e);
        });
      }

      return onlyControl && onlyAlt && onlyShift && onlyMeta && hasKeyCode && isAllCheck;
    }
  }, {
    key: 'makeCallback',
    value: function makeCallback(eventObject, callback) {
      var _this3 = this;

      if (eventObject.delegate) {
        return function (e) {

          if (_this3.checkEventType(e, eventObject)) {
            var delegateTarget = _this3.matchPath(e.target || e.srcElement, eventObject.delegate);

            if (delegateTarget) {
              // delegate target 이 있는 경우만 callback 실행 
              e.delegateTarget = delegateTarget;
              e.$delegateTarget = new Dom(delegateTarget);
              return callback(e);
            }
          }
        };
      } else {
        return function (e) {
          if (_this3.checkEventType(e, eventObject)) {
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
      var _this4 = this;

      this.getBindings().forEach(function (obj) {
        _this4.removeEvent(obj);
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

var ColorControl = function (_EventMachin) {
    inherits(ColorControl, _EventMachin);

    function ColorControl(colorpicker) {
        classCallCheck(this, ColorControl);

        var _this = possibleConstructorReturn(this, (ColorControl.__proto__ || Object.getPrototypeOf(ColorControl)).call(this));

        _this.colorpicker = colorpicker;
        _this.initialize();
        return _this;
    }

    createClass(ColorControl, [{
        key: 'initialize',
        value: function initialize() {
            this.$el = new Dom('div', 'control');
            this.$hue = this.$el.createChild('div', 'hue');
            this.$opacity = this.$el.createChild('div', 'opacity');
            this.$controlPattern = this.$el.createChild('div', 'empty');
            this.$controlColor = this.$el.createChild('div', 'color');

            this.$hueContainer = this.$hue.createChild('div', 'hue-container');
            this.$drag_bar = this.$hueContainer.createChild('div', 'drag-bar');
            this.drag_bar_pos = {};

            this.$opacityContainer = this.$opacity.createChild('div', 'opacity-container');
            this.$opacityColorBar = this.$opacityContainer.createChild('div', 'color-bar');

            this.$opacity_drag_bar = this.$opacityContainer.createChild('div', 'drag-bar2');
            this.opacity_drag_bar_pos = {};
        }
    }, {
        key: 'setBackgroundColor',
        value: function setBackgroundColor(color$$1) {
            this.$controlColor.css("background-color", color$$1);
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.setColorUI();
        }
    }, {
        key: 'setColorUI',
        value: function setColorUI() {

            var x = this.state.get('$el.width') * this.colorpicker.currentS,
                y = this.state.get('$el.height') * (1 - this.colorpicker.currentV);

            this.$drag_pointer.css({
                left: x + "px",
                top: y + "px"
            });
        }
    }, {
        key: 'setOpacityColorBar',
        value: function setOpacityColorBar(hueColor) {
            var rgb = color.parse(hueColor);

            rgb.a = 0;
            var start = color.format(rgb, 'rgb');

            rgb.a = 1;
            var end = color.format(rgb, 'rgb');

            this.$opacityColorBar.css('background', 'linear-gradient(to right, ' + start + ', ' + end + ')');
        }
    }, {
        key: 'setOpacity',
        value: function setOpacity(e) {
            var min = this.$opacityContainer.offset().left;
            var max = min + this.state.get('$opacityContainer.width');
            var current = Event.pos(e).clientX;
            var dist;

            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            var x = this.state.get('$opacityContainer.width') * (dist / 100);

            this.$opacity_drag_bar.css({
                left: x - Math.ceil(this.state.get('$opacity_drag_bar.width') / 2) + 'px'
            });

            this.opacity_drag_bar_pos = { x: x };

            this.colorpicker.setCurrentA(this.caculateOpacity());
            this.colorpicker.currentFormat();
            this.colorpicker.setInputColor();
        }
    }, {
        key: 'setInputColor',
        value: function setInputColor() {
            this.setBackgroundColor(this.colorpicker.getFormattedColor('rgb'));

            var rgb = this.colorpicker.convertRGB();
            var colorString = color.format(rgb, 'rgb');
            this.setOpacityColorBar(colorString);
        }
    }, {
        key: 'setColorUI',
        value: function setColorUI() {

            var hueX = this.state.get('$hueContainer.width') * (this.colorpicker.currentH / 360);

            this.$drag_bar.css({
                left: hueX - 7.5 + 'px'
            });

            this.drag_bar_pos = { x: hueX };

            var opacityX = this.state.get('$opacityContainer.width') * (this.colorpicker.currentA || 0);

            this.$opacity_drag_bar.css({
                left: opacityX - 7.5 + 'px'
            });

            this.opacity_drag_bar_pos = { x: opacityX };
        }
    }, {
        key: 'caculateH',
        value: function caculateH() {

            var huePos = this.drag_bar_pos || { x: 0 };

            var h = huePos.x / this.state.get('$hueContainer.width') * 360;

            return { h: h };
        }
    }, {
        key: 'caculateOpacity',
        value: function caculateOpacity() {
            var opacityPos = this.opacity_drag_bar_pos || { x: 0 };
            var a = Math.round(opacityPos.x / this.state.get('$opacityContainer.width') * 100) / 100;

            return isNaN(a) ? 1 : a;
        }
    }, {
        key: 'EventDocumentMouseMove',
        value: function EventDocumentMouseMove(e) {
            if (this.isHueDown) {
                this.setHueColor(e);
            }

            if (this.isOpacityDown) {
                this.setOpacity(e);
            }
        }
    }, {
        key: 'EventDocumentMouseUp',
        value: function EventDocumentMouseUp(e) {
            this.isHueDown = false;
            this.isOpacityDown = false;
        }
    }, {
        key: 'setControlColor',
        value: function setControlColor(color$$1) {
            this.$controlColor.css('background-color', color$$1);
        }
    }, {
        key: 'setHueColor',
        value: function setHueColor(e) {
            var min = this.$hueContainer.offset().left;
            var max = min + this.state.get('$hueContainer.width');
            var current = e ? Event.pos(e).clientX : min + (max - min) * (this.colorpicker.currentH / 360);

            var dist;
            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            var x = this.state.get('$hueContainer.width') * (dist / 100);

            this.$drag_bar.css({
                left: x - Math.ceil(this.state.get('$drag_bar.width') / 2) + 'px'
            });

            this.drag_bar_pos = { x: x };

            var hueColor = HueColor.checkHueColor(dist / 100);

            this.colorpicker.setBackgroundColor(hueColor);
            this.colorpicker.setCurrentH(dist / 100 * 360);
            this.colorpicker.setInputColor();
        }
    }, {
        key: 'setOnlyHueColor',
        value: function setOnlyHueColor() {
            var min = this.$hueContainer.offset().left;
            var max = min + this.state.get('$hueContainer.width');
            var current = min + (max - min) * (this.colorpicker.currentH / 360);

            var dist;
            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            var x = this.state.get('$hueContainer.width') * (dist / 100);

            this.$drag_bar.css({
                left: x - Math.ceil(this.state.get('$drag_bar.width') / 2) + 'px'
            });

            this.drag_bar_pos = { x: x };

            var hueColor = HueColor.checkHueColor(dist / 100);
            this.colorpicker.setBackgroundColor(hueColor);
            this.colorpicker.setCurrentH(dist / 100 * 360);
        }
    }, {
        key: 'mousedown $drag_bar',
        value: function mousedown$drag_bar(e) {
            e.preventDefault();
            this.isHueDown = true;
        }
    }, {
        key: 'mousedown $opacity_drag_bar',
        value: function mousedown$opacity_drag_bar(e) {
            e.preventDefault();
            this.isOpacityDown = true;
        }
    }, {
        key: 'mousedown $hueContainer',
        value: function mousedown$hueContainer(e) {
            this.isHueDown = true;
            this.setHueColor(e);
        }
    }, {
        key: 'mousedown $opacityContainer',
        value: function mousedown$opacityContainer(e) {
            this.isOpacityDown = true;
            this.setOpacity(e);
        }
    }]);
    return ColorControl;
}(EventMachin);

var ColorInformation = function (_EventMachin) {
    inherits(ColorInformation, _EventMachin);

    function ColorInformation(colorpicker) {
        classCallCheck(this, ColorInformation);

        var _this = possibleConstructorReturn(this, (ColorInformation.__proto__ || Object.getPrototypeOf(ColorInformation)).call(this));

        _this.colorpicker = colorpicker;
        _this.initialize();

        return _this;
    }

    createClass(ColorInformation, [{
        key: 'initialize',
        value: function initialize() {
            this.$el = new Dom('div', 'information hex');

            this.$informationChange = this.$el.createChild('div', 'information-change');

            this.$formatChangeButton = this.$informationChange.createChild('button', 'format-change-button arrow-button', { type: 'button' });

            this.$el.append(this.makeInputFieldHex());
            this.$el.append(this.makeInputFieldRgb());
            this.$el.append(this.makeInputFieldHsl());

            this.format = 'hex';
        }
    }, {
        key: 'makeInputFieldHex',
        value: function makeInputFieldHex() {
            var item = new Dom('div', 'information-item hex');
            var field = item.createChild('div', 'input-field hex');

            this.$hexCode = field.createChild('input', 'input', { type: 'text' });

            field.createChild('div', 'title').html('HEX');

            return item;
        }
    }, {
        key: 'makeInputFieldRgb',
        value: function makeInputFieldRgb() {
            var item = new Dom('div', 'information-item rgb');

            var field = item.createChild('div', 'input-field rgb-r');
            this.$rgb_r = field.createChild('input', 'input', { type: 'number', step: 1, min: 0, max: 255 });
            field.createChild('div', 'title').html('R');

            field = item.createChild('div', 'input-field rgb-g');
            this.$rgb_g = field.createChild('input', 'input', { type: 'number', step: 1, min: 0, max: 255 });
            field.createChild('div', 'title').html('G');

            field = item.createChild('div', 'input-field rgb-b');
            this.$rgb_b = field.createChild('input', 'input', { type: 'number', step: 1, min: 0, max: 255 });
            field.createChild('div', 'title').html('B');

            // rgba
            field = item.createChild('div', 'input-field rgb-a');
            this.$rgb_a = field.createChild('input', 'input', { type: 'number', step: 0.01, min: 0, max: 1 });
            field.createChild('div', 'title').html('A');

            return item;
        }
    }, {
        key: 'makeInputFieldHsl',
        value: function makeInputFieldHsl() {
            var item = new Dom('div', 'information-item hsl');

            var field = item.createChild('div', 'input-field hsl-h');
            this.$hsl_h = field.createChild('input', 'input', { type: 'number', step: 1, min: 0, max: 360 });
            field.createChild('div', 'title').html('H');

            field = item.createChild('div', 'input-field hsl-s');
            this.$hsl_s = field.createChild('input', 'input', { type: 'number', step: 1, min: 0, max: 100 });
            field.createChild('div', 'postfix').html('%');
            field.createChild('div', 'title').html('S');

            field = item.createChild('div', 'input-field hsl-l');
            this.$hsl_l = field.createChild('input', 'input', { type: 'number', step: 1, min: 0, max: 100 });
            field.createChild('div', 'postfix').html('%');
            field.createChild('div', 'title').html('L');

            // rgba
            field = item.createChild('div', 'input-field hsl-a');
            this.$hsl_a = field.createChild('input', 'input', { type: 'number', step: 0.01, min: 0, max: 1 });
            field.createChild('div', 'title').html('A');

            return item;
        }
    }, {
        key: 'currentFormat',
        value: function currentFormat() {
            var current_format = this.format || 'hex';
            if (this.colorpicker.currentA < 1 && current_format == 'hex') {
                var next_format = 'rgb';
                this.$el.removeClass(current_format);
                this.$el.addClass(next_format);
                this.format = next_format;

                this.colorpicker.setInputColor();
            }
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
                if (this.colorpicker.currentA == 1) {
                    next_format = 'hex';
                } else {
                    next_format = 'rgb';
                }
            }

            this.$el.removeClass(current_format);
            this.$el.addClass(next_format);
            this.format = next_format;

            this.setInputColor();
            this.colorpicker.changeInputColorAfterNextFormat();
        }
    }, {
        key: 'setRGBInput',
        value: function setRGBInput(r, g, b) {
            this.$rgb_r.val(r);
            this.$rgb_g.val(g);
            this.$rgb_b.val(b);
            this.$rgb_a.val(this.colorpicker.currentA);
        }
    }, {
        key: 'setHSLInput',
        value: function setHSLInput(h, s, l) {
            this.$hsl_h.val(h);
            this.$hsl_s.val(s);
            this.$hsl_l.val(l);
            this.$hsl_a.val(this.colorpicker.currentA);
        }
    }, {
        key: 'getHexFormat',
        value: function getHexFormat() {
            return color.format({
                r: this.$rgb_r.int(),
                g: this.$rgb_g.int(),
                b: this.$rgb_b.int()
            }, 'hex', this.colorpicker.opt.color);
        }
    }, {
        key: 'getRgbFormat',
        value: function getRgbFormat() {
            return color.format({
                r: this.$rgb_r.int(),
                g: this.$rgb_g.int(),
                b: this.$rgb_b.int(),
                a: this.$rgb_a.float()
            }, 'rgb', this.colorpicker.opt.color);
        }
    }, {
        key: 'getHslFormat',
        value: function getHslFormat() {
            return color.format({
                h: this.$hsl_h.val(),
                s: this.$hsl_s.val(),
                l: this.$hsl_l.val(),
                a: this.$hsl_a.float()
            }, 'hsl', this.colorpicker.opt.color);
        }
    }, {
        key: 'convertRGB',
        value: function convertRGB() {
            return this.colorpicker.convertRGB();
        }
    }, {
        key: 'convertHEX',
        value: function convertHEX() {
            return this.colorpicker.convertHEX();
        }
    }, {
        key: 'convertHSL',
        value: function convertHSL() {
            return this.colorpicker.convertHSL();
        }
    }, {
        key: 'getFormattedColor',
        value: function getFormattedColor(format) {
            var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            format = format || this.getFormat();
            if (format == 'hex') {
                return this.$hexCode.val();
            } else if (format == 'rgb') {
                return this.getRgbFormat(fixed);
            } else if (format == 'hsl') {
                return this.getHslFormat(fixed);
            }
        }
    }, {
        key: 'getFormat',
        value: function getFormat() {
            return this.format || 'hex';
        }
    }, {
        key: 'setInputColor',
        value: function setInputColor() {
            var format = this.getFormat();

            var rgb = null;
            if (format == 'hex') {
                this.$hexCode.val(this.convertHEX());
                var rgb = this.convertRGB();
                this.setRGBInput(rgb.r, rgb.g, rgb.b, rgb.a);
            } else if (format == 'rgb') {
                var rgb = this.convertRGB();
                this.setRGBInput(rgb.r, rgb.g, rgb.b, rgb.a);
                this.$hexCode.val(this.convertHEX());
            } else if (format == 'hsl') {
                var hsl = this.convertHSL();
                this.setHSLInput(hsl.h, hsl.s, hsl.l, hsl.a);
            }
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

        //'keydown.checkNotNumberKey $rgb_r' (e) {  e.preventDefault(); }
        //'keydown.checkNotNumberKey $rgb_g' (e) {  e.preventDefault(); }
        //'keydown.checkNotNumberKey $rgb_b' (e) {  e.preventDefault(); }

        //'keydown.checkNumberKey $rgb_r' (e) { this.setRGBtoHexColor(e); }
        //'keydown.checkNumberKey $rgb_g' (e) { this.setRGBtoHexColor(e); }
        //'keydown.checkNumberKey $rgb_b' (e) { this.setRGBtoHexColor(e); }

    }, {
        key: 'changeRgbColor',
        value: function changeRgbColor() {
            this.colorpicker.changeInformationColor(this.getRgbFormat());
        }
    }, {
        key: 'changeHslColor',
        value: function changeHslColor() {
            this.colorpicker.changeInformationColor(this.getHslFormat());
        }
    }, {
        key: 'change $rgb_r',
        value: function change$rgb_r(e) {
            this.changeRgbColor();
        }
    }, {
        key: 'change $rgb_g',
        value: function change$rgb_g(e) {
            this.changeRgbColor();
        }
    }, {
        key: 'change $rgb_b',
        value: function change$rgb_b(e) {
            this.changeRgbColor();
        }
    }, {
        key: 'change $rgb_a',
        value: function change$rgb_a(e) {
            this.changeRgbColor();
        }
    }, {
        key: 'change $hsl_h',
        value: function change$hsl_h(e) {
            this.changeHslColor();
        }
    }, {
        key: 'change $hsl_s',
        value: function change$hsl_s(e) {
            this.changeHslColor();
        }
    }, {
        key: 'change $hsl_l',
        value: function change$hsl_l(e) {
            this.changeHslColor();
        }
    }, {
        key: 'change $hsl_a',
        value: function change$hsl_a(e) {
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
            var code = this.$hexCode.val();

            if (code.charAt(0) == '#' && code.length == 7) {
                this.colorpicker.changeInformationColor(code);
                this.setInputColor();
            }
        }
    }, {
        key: 'click $formatChangeButton',
        value: function click$formatChangeButton(e) {
            this.nextFormat();
        }
    }, {
        key: 'refresh',
        value: function refresh() {}
    }]);
    return ColorInformation;
}(EventMachin);

var ColorPallet = function (_EventMachin) {
    inherits(ColorPallet, _EventMachin);

    function ColorPallet(colorpicker) {
        classCallCheck(this, ColorPallet);

        var _this = possibleConstructorReturn(this, (ColorPallet.__proto__ || Object.getPrototypeOf(ColorPallet)).call(this));

        _this.colorpicker = colorpicker;
        _this.initialize();
        return _this;
    }

    createClass(ColorPallet, [{
        key: 'initialize',
        value: function initialize() {
            this.$el = new Dom('div', 'color');
            this.$saturation = this.$el.createChild('div', 'saturation');
            this.$value = this.$saturation.createChild('div', 'value');
            this.$drag_pointer = this.$value.createChild('div', 'drag-pointer');
        }
    }, {
        key: 'setBackgroundColor',
        value: function setBackgroundColor(color$$1) {
            this.$el.css("background-color", color$$1);
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

            var width = this.state.get('$el.width');
            var height = this.state.get('$el.height');

            var s = pos.x / width;
            var v = (height - pos.y) / height;

            return { s: s, v: v, width: width, height: height };
        }
    }, {
        key: 'setColorUI',
        value: function setColorUI() {
            var x = this.state.get('$el.width') * this.colorpicker.currentS,
                y = this.state.get('$el.height') * (1 - this.colorpicker.currentV);

            this.$drag_pointer.css({
                left: x - 5 + "px",
                top: y - 5 + "px"
            });

            this.drag_pointer_pos = { x: x, y: y };
        }
    }, {
        key: 'setMainColor',
        value: function setMainColor(e) {
            e.preventDefault();
            var pos = this.$el.position(); // position for screen
            var w = this.state.get('$el.contentWidth');
            var h = this.state.get('$el.contentHeight');

            var x = e.clientX - pos.left;
            var y = e.clientY - pos.top;

            if (x < 0) x = 0;else if (x > w) x = w;

            if (y < 0) y = 0;else if (y > h) y = h;

            this.$drag_pointer.css({
                left: x - 5 + 'px',
                top: y - 5 + 'px'
            });

            this.drag_pointer_pos = { x: x, y: y };

            this.colorpicker.caculateHSV();
            this.colorpicker.setInputColor();
        }
    }, {
        key: 'EventDocumentMouseUp',
        value: function EventDocumentMouseUp(e) {
            this.isDown = false;
        }
    }, {
        key: 'EventDocumentMouseMove',
        value: function EventDocumentMouseMove(e) {
            if (this.isDown) {
                this.setMainColor(e);
            }
        }
    }, {
        key: 'mousedown',
        value: function mousedown(e) {
            this.isDown = true;
            this.setMainColor(e);
        }
    }, {
        key: 'mouseup',
        value: function mouseup(e) {
            this.isDown = false;
        }
    }]);
    return ColorPallet;
}(EventMachin);

var DATA_COLORSETS_INDEX = 'data-colorsets-index';

var ColorSetsChooser = function (_EventMachin) {
    inherits(ColorSetsChooser, _EventMachin);

    function ColorSetsChooser(colorpicker) {
        classCallCheck(this, ColorSetsChooser);

        var _this = possibleConstructorReturn(this, (ColorSetsChooser.__proto__ || Object.getPrototypeOf(ColorSetsChooser)).call(this));

        _this.colorpicker = colorpicker;

        _this.initialize();
        return _this;
    }

    createClass(ColorSetsChooser, [{
        key: 'initialize',
        value: function initialize() {
            // make colorset-chooser 
            this.$el = new Dom('div', 'color-chooser');

            var $container = this.$el.createChild('div', 'color-chooser-container');

            var $header = $container.createChild('div', 'colorsets-item colorsets-item-header');

            $header.createChild('h1', 'title').html('Color Paletts');

            this.$toggleButton = $header.createChild('span', 'items').html('&times;');

            this.$colorsetsList = $container.createChild('div', 'colorsets-list');

            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.$colorsetsList.html(this.makeColorSetsList());
        }
    }, {
        key: 'makeColorItemList',
        value: function makeColorItemList(colors) {
            var maxCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

            var $list = new Dom('div');

            for (var i = 0; i < maxCount; i++) {
                var color$$1 = colors[i] || 'rgba(255, 255, 255, 1)';
                var $item = $list.createChild('div', 'color-item', {
                    title: color$$1
                });

                $item.createChild('div', 'color-view', null, {
                    'background-color': color$$1
                });
            }

            return $list;
        }
    }, {
        key: 'makeColorSetsList',
        value: function makeColorSetsList() {
            var _this2 = this;

            var $div = new Dom('div');

            // colorsets 
            var colorSets = this.colorpicker.getColorSetsList();
            colorSets.forEach(function (element, index) {
                if (_this2.colorpicker.isPaletteType() && element.edit) {
                    // NOOP
                } else {
                    var $item = $div.createChild('div', 'colorsets-item', defineProperty({}, DATA_COLORSETS_INDEX, index));

                    $item.createChild('h1', 'title').html(element.name);

                    $item.createChild('div', 'items').append(_this2.makeColorItemList(element.colors, 5));
                }
            });

            return $div;
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
                this.colorpicker.setCurrentColorSets(index);
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
}(EventMachin);

var colorSetsList = [{
    name: "Material",
    colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B']
}, {
    name: "Custom", "edit": true, "colors": []
}, {
    name: "Color Scale", "scale": ['red', 'yellow', 'black'], count: 5
}];

var ColorSetsList = function () {
    function ColorSetsList(colorpicker) {
        classCallCheck(this, ColorSetsList);

        this.colorpicker = colorpicker;

        this.setUserList(this.colorpicker.getOption('colorSets'));
    }

    createClass(ColorSetsList, [{
        key: 'list',
        value: function list() {
            return this.userList || colorSetsList;
        }
    }, {
        key: 'setUserList',
        value: function setUserList(list) {
            this.userList = list;

            this.resetUserList();

            this.setCurrentColorSets();
        }
    }, {
        key: 'resetUserList',
        value: function resetUserList() {
            var _this = this;

            if (this.userList && this.userList.length) {
                this.userList = this.userList.map(function (element, index) {

                    if (typeof element.colors == 'function') {
                        var makeCallback = element.colors;

                        element.colors = makeCallback(_this.colorpicker, _this);
                        element._colors = makeCallback;
                    }

                    return Object.assign({
                        name: 'color-' + index,
                        colors: []
                    }, element);
                });
            }
        }
    }, {
        key: 'setCurrentColorSets',
        value: function setCurrentColorSets(nameOrIndex) {

            var _list = this.list();

            if (typeof nameOrIndex == 'undefined') {
                this.currentColorSets = _list[0];
            } else if (typeof nameOrIndex == 'number') {
                this.currentColorSets = _list[nameOrIndex];
            } else {
                this.currentColorSets = _list.filter(function (obj) {
                    return obj.name == nameOrIndex;
                })[0];
            }
        }
    }, {
        key: 'getCurrentColorSets',
        value: function getCurrentColorSets() {
            return this.currentColorSets;
        }
    }, {
        key: 'addCurrentColor',
        value: function addCurrentColor(color$$1) {
            if (Array.isArray(this.currentColorSets.colors)) {
                this.currentColorSets.colors.push(color$$1);
            }
        }
    }, {
        key: 'removeCurrentColor',
        value: function removeCurrentColor(index) {
            if (this.currentColorSets.colors[index]) {
                this.currentColorSets.colors.splice(index, 1);
            }
        }
    }, {
        key: 'removeCurrentColorToTheRight',
        value: function removeCurrentColorToTheRight(index) {
            if (this.currentColorSets.colors[index]) {
                this.currentColorSets.colors.splice(index, Number.MAX_VALUE);
            }
        }
    }, {
        key: 'clearPalette',
        value: function clearPalette() {
            if (this.currentColorSets.colors) {
                this.currentColorSets.colors = [];
            }
        }
    }, {
        key: 'getCurrentColors',
        value: function getCurrentColors() {
            return this.getColors(this.currentColorSets);
        }
    }, {
        key: 'getColors',
        value: function getColors(element) {

            if (element.scale) {
                return color.scale(element.scale, element.count);
            }

            return element.colors || [];
        }
    }, {
        key: 'getColorSetsList',
        value: function getColorSetsList() {
            var _this2 = this;

            return this.list().map(function (element) {
                return {
                    name: element.name,
                    edit: element.edit,
                    colors: _this2.getColors(element)
                };
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {}
    }]);
    return ColorSetsList;
}();

var CurrentColorSets = function (_EventMachin) {
    inherits(CurrentColorSets, _EventMachin);

    function CurrentColorSets(colorpicker) {
        classCallCheck(this, CurrentColorSets);

        var _this = possibleConstructorReturn(this, (CurrentColorSets.__proto__ || Object.getPrototypeOf(CurrentColorSets)).call(this));

        _this.colorpicker = colorpicker;

        _this.colorSetsList = _this.colorpicker.colorSetsList;

        _this.initialize();
        return _this;
    }

    createClass(CurrentColorSets, [{
        key: 'makeCurrentColorSets',
        value: function makeCurrentColorSets() {
            var list = new Dom('div', 'current-color-sets');
            var currentColorSets = this.colorSetsList.getCurrentColorSets();
            var colors = this.colorSetsList.getCurrentColors();

            for (var i = 0, len = colors.length; i < len; i++) {
                var color$$1 = colors[i];
                var item = list.createChild('div', 'color-item', {
                    'title': color$$1,
                    'data-index': i,
                    'data-color': color$$1
                });

                item.createChild('div', 'empty');
                item.createChild('div', 'color-view', null, {
                    'background-color': color$$1
                });
            }

            if (currentColorSets.edit) {
                list.createChild('div', 'add-color-item').html('+');
            }

            return list;
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            // make colorsets view 
            this.$el = new Dom('div', 'colorsets');

            var $colorSetsMenu = this.$el.createChild('div', 'menu', {
                title: 'Open Color Pallets'
            });
            this.$colorSetsColorList = this.$el.createChild('div', 'color-list');

            this.$colorSetsChooseButton = $colorSetsMenu.createChild('button', 'color-sets-choose-btn arrow-button', {
                type: 'button'
            });

            this.refresh();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.$colorSetsColorList.html(this.makeCurrentColorSets());
        }
    }, {
        key: 'refreshAll',
        value: function refreshAll() {
            this.refresh();
            this.colorpicker.refreshColorSetsChooser();
        }
    }, {
        key: 'addColor',
        value: function addColor(color$$1) {
            this.colorSetsList.addCurrentColor(color$$1);
            this.refreshAll();
        }
    }, {
        key: 'removeColor',
        value: function removeColor(index) {
            this.colorSetsList.removeCurrentColor(index);
            this.refreshAll();
        }
    }, {
        key: 'removeAllToTheRight',
        value: function removeAllToTheRight(index) {
            this.colorSetsList.removeCurrentColorToTheRight(index);
            this.refreshAll();
        }
    }, {
        key: 'clearPalette',
        value: function clearPalette() {
            this.colorSetsList.clearPalette();
            this.refreshAll();
        }
    }, {
        key: 'click $colorSetsChooseButton',
        value: function click$colorSetsChooseButton(e) {
            this.colorpicker.toggleColorChooser();
        }
    }, {
        key: 'contextmenu $colorSetsColorList',
        value: function contextmenu$colorSetsColorList(e) {
            e.preventDefault();
            var currentColorSets = this.colorSetsList.getCurrentColorSets();

            if (!currentColorSets.edit) {
                return;
            }

            var $target = new Dom(e.target);

            var $item = $target.closest('color-item');

            if ($item) {
                var index = parseInt($item.attr('data-index'));

                this.colorpicker.showContextMenu(e, index);
            } else {
                this.colorpicker.showContextMenu(e);
            }
        }
    }, {
        key: 'click $colorSetsColorList .add-color-item',
        value: function click$colorSetsColorListAddColorItem(e) {
            this.addColor(this.colorpicker.getCurrentColor());
        }
    }, {
        key: 'click $colorSetsColorList .color-item',
        value: function click$colorSetsColorListColorItem(e) {

            var isDirect = !!this.colorpicker.isPaletteType();

            this.colorpicker.setColor(e.$delegateTarget.attr('data-color'), isDirect);
        }
    }]);
    return CurrentColorSets;
}(EventMachin);

var CurrentColorSetsContextMenu = function (_EventMachin) {
    inherits(CurrentColorSetsContextMenu, _EventMachin);

    function CurrentColorSetsContextMenu(colorpicker) {
        classCallCheck(this, CurrentColorSetsContextMenu);

        var _this = possibleConstructorReturn(this, (CurrentColorSetsContextMenu.__proto__ || Object.getPrototypeOf(CurrentColorSetsContextMenu)).call(this));

        _this.colorpicker = colorpicker;
        _this.currentColorSets = colorpicker.currentColorSets;

        _this.initialize();
        return _this;
    }

    createClass(CurrentColorSetsContextMenu, [{
        key: 'initialize',
        value: function initialize() {
            // make colorsets view 
            this.$el = new Dom('ul', 'colorsets-contextmenu');

            this.$el.createChild('li', 'menu-item small-hide', {
                'data-type': 'remove-color'
            }).html('Remove color');

            this.$el.createChild('li', 'menu-item small-hide', {
                'data-type': 'remove-all-to-the-right'
            }).html('Remove all to the right');

            this.$el.createChild('li', 'menu-item', {
                'data-type': 'clear-palette'
            }).html('Clear palette');
        }
    }, {
        key: 'show',
        value: function show(e, index) {
            var $event = Event.pos(e);

            this.$el.css({
                top: $event.clientY - 10 + 'px',
                left: $event.clientX + 'px'
            });
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
                    this.currentColorSets.removeColor(this.selectedColorIndex);
                    break;
                case 'remove-all-to-the-right':
                    this.currentColorSets.removeAllToTheRight(this.selectedColorIndex);
                    break;
                case 'clear-palette':
                    this.currentColorSets.clearPalette();
                    break;
            }
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
}(EventMachin);

var ColorPicker = function (_EventMachin) {
    inherits(ColorPicker, _EventMachin);

    function ColorPicker(opt) {
        classCallCheck(this, ColorPicker);

        var _this = possibleConstructorReturn(this, (ColorPicker.__proto__ || Object.getPrototypeOf(ColorPicker)).call(this));

        _this.opt = opt || {};
        _this.$body = null;
        _this.$root = null;

        _this.format = 'rgb';
        _this.currentA = 0;
        _this.currentH = 0;
        _this.currentS = 0;
        _this.currentV = 0;

        _this.colorSetsList = new ColorSetsList(_this);
        _this.colorpickerCallback = function () {};

        _this.isColorPickerShow = false;
        _this.isShortCut = false;
        _this.hideDelay = _this.opt.hideDeplay || 2000;
        _this.timerCloseColorPicker;
        _this.autoHide = _this.opt.autoHide || true;

        _this.control = new ColorControl(_this);
        _this.palette = new ColorPallet(_this);
        _this.information = new ColorInformation(_this);
        _this.colorSetsChooser = new ColorSetsChooser(_this);
        _this.currentColorSets = new CurrentColorSets(_this);
        _this.contextMenu = new CurrentColorSetsContextMenu(_this, _this.currentColorSets);

        _this.initialize();
        return _this;
    }

    createClass(ColorPicker, [{
        key: 'getOption',
        value: function getOption(key) {
            return this.opt[key];
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
        key: 'initialize',
        value: function initialize() {
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

            this.$arrow = new Dom('div', 'arrow');

            this.$root.append(this.$arrow);
            this.$root.append(this.palette.$el);
            this.$root.append(this.control.$el);
            this.$root.append(this.information.$el);
            this.$root.append(this.currentColorSets.$el);
            this.$root.append(this.colorSetsChooser.$el);
            this.$root.append(this.contextMenu.$el);

            this.$checkColorPickerClass = this.checkColorPickerClass.bind(this);

            this.initColor(this.opt.color);

            // register all events 
            this.initializeEvent();
        }
    }, {
        key: 'showContextMenu',
        value: function showContextMenu(e, index) {
            this.contextMenu.show(e, index);
        }
    }, {
        key: 'setColor',
        value: function setColor(value) {
            var isDirect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == "object") {
                if (!value.r || !value.g || !value.b) return;

                if (isDirect) {
                    this.callbackColorValue(color.format(value, "hex"));
                } else {
                    this.initColor(color.format(value, "hex"));
                }
            } else if (typeof value == "string") {

                if (isDirect) {
                    this.callbackColorValue(value);
                } else {
                    this.initColor(value);
                }
            }
        }
    }, {
        key: 'getColor',
        value: function getColor(type) {
            this.caculateHSV();
            var rgb = this.convertRGB();

            if (type) {
                return color.format(rgb, type);
            }

            return rgb;
        }
    }, {
        key: 'definePositionForArrow',
        value: function definePositionForArrow(opt, elementScreenLeft, elementScreenTop) {
            //this.$arrow.css({})
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
        key: 'show',
        value: function show(opt, color$$1, callback) {
            this.destroy();
            this.initializeEvent();
            this.$root.appendTo(this.$body);

            this.$root.css(this.getInitalizePosition()).show();

            this.definePosition(opt);

            this.isColorPickerShow = true;

            this.isShortCut = opt.isShortCut || false;

            this.initColor(color$$1);

            // define colorpicker callback
            this.colorpickerCallback = callback;

            // define hide delay
            this.hideDelay = opt.hideDelay || 2000;
            if (this.hideDelay > 0) {
                this.setHideDelay(this.hideDelay);
            }
        }
    }, {
        key: 'setHideDelay',
        value: function setHideDelay(delayTime) {
            var _this2 = this;

            delayTime = delayTime || 0;

            this.$root.off('mouseenter');
            this.$root.off('mouseleave');

            this.$root.on('mouseenter', function () {
                clearTimeout(_this2.timerCloseColorPicker);
            });

            this.$root.on('mouseleave', function () {
                clearTimeout(_this2.timerCloseColorPicker);
                _this2.timerCloseColorPicker = setTimeout(_this2.hide.bind(_this2), delayTime);
            });

            clearTimeout(this.timerCloseColorPicker);
            this.timerCloseColorPicker = setTimeout(this.hide.bind(this), delayTime);
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (this.isColorPickerShow) {
                this.destroy();
                this.$root.hide();
                this.$root.remove(); // not empty 
                this.isColorPickerShow = false;
            }
        }
    }, {
        key: 'convertRGB',
        value: function convertRGB() {
            return color.HSVtoRGB(this.currentH, this.currentS, this.currentV);
        }
    }, {
        key: 'convertHEX',
        value: function convertHEX() {
            return color.format(this.convertRGB(), 'hex');
        }
    }, {
        key: 'convertHSL',
        value: function convertHSL() {
            return color.HSVtoHSL(this.currentH, this.currentS, this.currentV);
        }
    }, {
        key: 'getCurrentColor',
        value: function getCurrentColor() {
            return this.information.getFormattedColor();
        }
    }, {
        key: 'getFormattedColor',
        value: function getFormattedColor(format) {
            format = format || 'hex';

            if (format == 'rgb') {
                var rgb = this.convertRGB();
                rgb.a = this.currentA;
                return color.format(rgb, 'rgb');
            } else if (format == 'hsl') {
                var hsl = this.convertHSL();
                hsl.a = this.currentA;
                return color.format(hsl, 'hsl');
            } else {
                var rgb = this.convertRGB();
                return color.format(rgb, 'hex');
            }
        }
    }, {
        key: 'setInputColor',
        value: function setInputColor(isNoInputColor) {
            this.information.setInputColor(isNoInputColor);
            this.control.setInputColor(isNoInputColor);

            this.callbackColorValue();
        }
    }, {
        key: 'changeInputColorAfterNextFormat',
        value: function changeInputColorAfterNextFormat() {
            this.control.setInputColor();

            this.callbackColorValue();
        }
    }, {
        key: 'callbackColorValue',
        value: function callbackColorValue(color$$1) {

            color$$1 = color$$1 || this.getCurrentColor();

            if (!isNaN(this.currentA)) {
                if (typeof this.opt.onChange == 'function') {
                    this.opt.onChange.call(this, color$$1);
                }

                if (typeof this.colorpickerCallback == 'function') {
                    this.colorpickerCallback(color$$1);
                }
            }
        }
    }, {
        key: 'caculateHSV',
        value: function caculateHSV() {

            var obj = this.palette.caculateSV();
            var control = this.control.caculateH();

            var s = obj.s;
            var v = obj.v;
            var h = control.h;

            if (obj.width == 0) {
                h = 0;
                s = 0;
                v = 0;
            }

            this.currentH = h;
            this.currentS = s;
            this.currentV = v;
        }
    }, {
        key: 'setColorUI',
        value: function setColorUI() {
            this.control.setColorUI();
            this.palette.setColorUI();
        }
    }, {
        key: 'setCurrentHSV',
        value: function setCurrentHSV(h, s, v, a) {
            this.currentA = a;
            this.currentH = h;
            this.currentS = s;
            this.currentV = v;
        }
    }, {
        key: 'setCurrentH',
        value: function setCurrentH(h) {
            this.currentH = h;
        }
    }, {
        key: 'setCurrentA',
        value: function setCurrentA(a) {
            this.currentA = a;
        }
    }, {
        key: 'setBackgroundColor',
        value: function setBackgroundColor(color$$1) {
            this.palette.setBackgroundColor(color$$1);
        }
    }, {
        key: 'setCurrentFormat',
        value: function setCurrentFormat(format) {
            this.format = format;
            this.information.setCurrentFormat(format);
        }
    }, {
        key: 'getHSV',
        value: function getHSV(colorObj) {
            if (colorObj.type == 'hsl') {
                return color.HSLtoHSV(colorObj);
            } else {
                return color.RGBtoHSV(colorObj);
            }
        }
    }, {
        key: 'initColor',
        value: function initColor(newColor, format) {
            var c = newColor || "#FF0000",
                colorObj = color.parse(c);
            format = format || colorObj.type;

            this.setCurrentFormat(format);

            var hsv = this.getHSV(colorObj);
            this.setCurrentHSV(hsv.h, hsv.s, hsv.v, colorObj.a);
            this.setColorUI();
            this.setHueColor();
            this.setInputColor();
        }
    }, {
        key: 'changeInformationColor',
        value: function changeInformationColor(newColor) {
            var c = newColor || "#FF0000",
                colorObj = color.parse(c);

            var hsv = this.getHSV(colorObj);
            this.setCurrentHSV(hsv.h, hsv.s, hsv.v, colorObj.a);
            this.setColorUI();
            this.setHueColor();
            this.control.setInputColor();
            this.callbackColorValue();
        }
    }, {
        key: 'setHueColor',
        value: function setHueColor() {
            this.control.setOnlyHueColor();
        }
    }, {
        key: 'checkColorPickerClass',
        value: function checkColorPickerClass(el) {
            var hasColorView = new Dom(el).closest('codemirror-colorview');
            var hasColorPicker = new Dom(el).closest('codemirror-colorpicker');
            var hasCodeMirror = new Dom(el).closest('CodeMirror');
            var IsInHtml = el.nodeName == 'HTML';

            return !!(hasColorPicker || hasColorView || hasCodeMirror);
        }
    }, {
        key: 'checkInHtml',
        value: function checkInHtml(el) {
            var IsInHtml = el.nodeName == 'HTML';

            return IsInHtml;
        }

        // Event Bindings 

    }, {
        key: 'mouseup document',
        value: function mouseupDocument(e) {
            this.palette.EventDocumentMouseUp(e);
            this.control.EventDocumentMouseUp(e);

            // when color picker clicked in outside
            if (this.checkInHtml(e.target)) {
                //this.setHideDelay(hideDelay);
            } else if (this.checkColorPickerClass(e.target) == false) {
                this.hide();
            }
        }
    }, {
        key: 'mousemove document',
        value: function mousemoveDocument(e) {
            this.palette.EventDocumentMouseMove(e);
            this.control.EventDocumentMouseMove(e);
        }
    }, {
        key: 'initializeEvent',
        value: function initializeEvent() {

            this.initializeEventMachin();

            this.palette.initializeEvent();
            this.control.initializeEvent();
            this.information.initializeEvent();
            this.currentColorSets.initializeEvent();
            this.colorSetsChooser.initializeEvent();
            this.contextMenu.initializeEvent();
        }
    }, {
        key: 'currentFormat',
        value: function currentFormat() {
            this.information.currentFormat();
        }
    }, {
        key: 'toggleColorChooser',
        value: function toggleColorChooser() {
            this.colorSetsChooser.toggle();
        }
    }, {
        key: 'refreshColorSetsChooser',
        value: function refreshColorSetsChooser() {
            this.colorSetsChooser.refresh();
        }
    }, {
        key: 'getColorSetsList',
        value: function getColorSetsList() {
            return this.colorSetsList.getColorSetsList();
        }
    }, {
        key: 'setCurrentColorSets',
        value: function setCurrentColorSets(nameOrIndex) {
            this.colorSetsList.setCurrentColorSets(nameOrIndex);
            this.currentColorSets.refresh();
        }
    }, {
        key: 'setColorSets',
        value: function setColorSets(list) {
            this.colorSetsList.setUserList(list);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            get(ColorPicker.prototype.__proto__ || Object.getPrototypeOf(ColorPicker.prototype), 'destroy', this).call(this);

            this.control.destroy();
            this.palette.destroy();
            this.information.destroy();
            this.colorSetsChooser.destroy();
            this.colorSetsList.destroy();
            this.currentColorSets.destroy();
            this.contextMenu.destroy();

            // remove color picker callback
            this.colorpickerCallback = undefined;
        }
    }]);
    return ColorPicker;
}(EventMachin);

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

function has_class(el, cls) {
    if (!el || !el.className) {
        return false;
    } else {
        var newClass = ' ' + el.className + ' ';
        return newClass.indexOf(' ' + cls + ' ') > -1;
    }
}

var ColorView = function () {
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
            this.colorpicker = new ColorPicker(this.opt);
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
                this.cm.on('scroll', debounce(onScroll, 50));
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
            var color$$1 = el.color;

            if (this.colorpicker) {
                var self = this;
                var prevColor = color$$1;
                var pos = this.cm.charCoords({ line: lineNo, ch: ch });
                this.colorpicker.show({
                    left: pos.left,
                    top: pos.bottom,
                    isShortCut: el.isShortCut || false,
                    hideDelay: self.opt.hideDelay || 2000
                }, nameColor || color$$1, function (newColor) {
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
            return color.matches(lineHandle.text);
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
        value: function set_state(lineNo, start, color$$1, nameColor) {
            var marker = this.create_marker(lineNo, start);

            marker.lineNo = lineNo;
            marker.ch = start;
            marker.color = color$$1;
            marker.nameColor = nameColor;

            return marker;
        }
    }, {
        key: 'create_marker',
        value: function create_marker(lineNo, start) {

            var key = this.key(lineNo, start);

            if (!this.markers[key]) {
                this.markers[key] = this.make_element();
            }

            return this.markers[key];
        }
    }, {
        key: 'has_marker',
        value: function has_marker(lineNo, start) {
            var key = this.key(lineNo, start);
            return !!this.markers[key];
        }
    }, {
        key: 'update_element',
        value: function update_element(el, color$$1) {
            el.back_element.style.backgroundColor = color$$1;
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
        value: function render(cursor, lineNo, lineHandle, color$$1, nameColor) {
            var start = lineHandle.text.indexOf(color$$1, cursor.next);

            if (this.is_excluded_token(lineNo, start) === true) {
                // excluded token do not show.
                return;
            }

            cursor.next = start + color$$1.length;

            if (this.has_marker(lineNo, start)) {
                this.update_element(this.create_marker(lineNo, start), nameColor || color$$1);
                this.set_state(lineNo, start, color$$1, nameColor);
                return;
            }

            var el = this.create_marker(lineNo, start);

            this.update_element(el, nameColor || color$$1);

            this.set_state(lineNo, start, color$$1, nameColor || color$$1);
            this.set_mark(lineNo, start, el);
        }
    }]);
    return ColorView;
}();

if (CodeMirror) {

    CodeMirror.defineOption("colorpicker", false, function (cm, val, old) {
        if (old && old != CodeMirror.Init) {

            if (cm.state.colorpicker) {
                cm.state.colorpicker.destroy();
                cm.state.colorpicker = null;
            }
            // remove event listener
        }

        if (val) {
            cm.state.colorpicker = new ColorView(cm, val);
        }
    });
}

var index = {
    Color: color,
    ColorNames: ColorNames,
    ColorPicker: ColorPicker,
    ImageFilter: ImageFilter,
    HueColor: HueColor,
    Canvas: Canvas,
    ImageLoader: ImageLoader
};

return index;

}(CodeMirror));
