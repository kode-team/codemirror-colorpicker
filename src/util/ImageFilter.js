// TODO: worker run 

function weight(arr, num = 1) {
    return arr.map(i => {
        return i * num;
    })
}

function makeFilter(filter) {

    if (typeof filter == 'function') {
        return filter;
    }

    if (typeof filter == 'string') {
        filter = [filter];
    }

    const filterName = filter.shift();

    if (typeof filterName == 'function') {
        return filterName;
    }

    const params = filter;

    const filterFunction = ImageFilter[filterName];

    return filterFunction.apply(filterFunction, params);
}

function each(len, callback) {
    for (var i = 0; i < len; i += 4) {
        callback(i);
    }
}

function createRandRange(min, max, count) {
    var result = [];

    for(var i = 1; i <= count; i++) {
        var num = Math.random() * (max - min) + min;
        var sign = (Math.floor(Math.random() * 10) % 2 == 0) ? -1 : 1 ;
        result.push( sign * num );
    }

    result.sort();

    const centerIndex = Math.floor(count / 2);
    var a = result[centerIndex];
    result[centerIndex] = result[0];
    result[0] = a;

    return result; 
}

function createRandomCount () {
    return [3*3, 4*4, 5*5, 6*6, 7*7, 8*8, 9*9, 10*10].sort(function (a, b) {
        return 0.5 - Math.random();
    })[0];
}


let ImageFilter = {}


/** 
 * 
 * multiply filter  
 * filter x filter x filter x ...... 
 * 
 * ImageFilter.multi(filterFunction,filterFunction,filterFunction,filterFunction,filterFunction,...
 * ])
 * 
 * ImageFilter.multi('blur', 'grayscale', 'sharpen', ['blur', 3]);
 * 
 */
ImageFilter.multi = function (...filters) {

    return function (buffer, width, height) {

        filters.forEach(filter => {
            buffer = makeFilter(filter)(buffer, width, height);
        })

        return buffer;
    }
}


ImageFilter.merge = function (filters) {
    return ImageFilter.multi(...filters);
}



ImageFilter.filterCount = function (filter, count = 1) {
    var filters = [];

    for (var i = 0; i < count; i++) {
        filters.push(filter);
    }

    return ImageFilter.multi(filters);
}

// Pixel based 

ImageFilter.grayscale = function () {
    return function (buffer) {

        each(buffer.length, function (i) {
            var v = 0.2126 * buffer[i] + 0.7152 * buffer[i + 1] + 0.0722 * buffer[i + 2];
            buffer[i] = buffer[i + 1] = buffer[i + 2] = Math.round(v)
        })

        return buffer;
    }
}


ImageFilter.shade = function (r = 1, g = 1, b = 1) {
    return function (buffer, width, height) {
        each(buffer.length, function (i) {
            buffer[i] *= r;
            buffer[i + 1] *= g;
            buffer[i + 2] *= b;
        })

        return buffer;
    }
}

ImageFilter.bitonal = function (darkColor, lightColor, threshold = 100) {
    return function (buffer, width, height) {
        each(buffer.length, function (i) {
            if  (buffer[i] + buffer[i + 1] +  buffer[i + 2] <= threshold) { 
               buffer[i] = darkColor.r; 
               buffer[i + 1] = darkColor.g; 
               buffer[i + 2] = darkColor.b; 
           } else { 
               buffer[i] = lightColor.r; 
               buffer[i + 1] = lightColor.g; 
               buffer[i + 2] = lightColor.b; 
           }
        })

        return buffer;
    }    
    
}

ImageFilter.tint = function (redTint = 1, greenTint = 1, blueTint = 1) {
    return function (buffer, width, height) {
        each(buffer.length, function (i) {
            buffer[i] += (255 - buffer[i]) * redTint;
            buffer[i + 1] += (255 - buffer[i + 1]) * greenTint;
            buffer[i + 2] += (255 - buffer[i + 2]) * blueTint;
        })

        return buffer;
    }
}
/**
 * 
 * @param {*} threshold   min = 0, max = 100 
 */
ImageFilter.contrast = function (threshold = 0) {
    const C = Math.pow((100 + threshold) / 100, 2);
    return function (buffer, width, height) {
        each(buffer.length, function (i) {
            buffer[i] = ((((buffer[i] / 255) - 0.5) * C) + 0.5) * 255;
            buffer[i + 1] = ((((buffer[i + 1] / 255) - 0.5) * C) + 0.5) * 255;
            buffer[i + 2] = ((((buffer[i + 2] / 255) - 0.5) * C) + 0.5) * 255;
        })

        return buffer;
    }
}


ImageFilter.invert = function (scale = 1.0) {
    return function (buffer, width, height) {
        each(buffer.length, function (i) {
            buffer[i] = 255 - buffer[i];
            buffer[i + 1] = 255 - buffer[i + 1];
            buffer[i + 2] = 255 - buffer[i + 2];
            buffer[i + 3] = 255;
        })

        return buffer;
    }
}


ImageFilter.solarise = function (r, g, b) {
    return function (buffer, width, height) {
        each(buffer.length, function (i) {
            if (buffer[i] < r) buffer[i] = 255 - buffer[i];
            if (buffer[i + 1] < g) buffer[i + 1] = 255 - buffer[i + 1];
            if (buffer[i + 2] < b) buffer[i + 2] = 255 - buffer[i + 2];
        })

        return buffer;
    }
}

ImageFilter.sepia = function (scale = 1.0) {
    return function (buffer) {
        each(buffer.length, function (i) {
            var r = buffer[i], g = buffer[i + 1], b = buffer[i + 2];

            buffer[i] = r * 0.3588 + g * 0.7044 + b * 0.1368;
            buffer[i + 1] = r * 0.2990 + g * 0.5870 + b * 0.1140;
            buffer[i + 2] = r * 0.2392 + g * 0.4696 + b * 0.0912;
        })

        return buffer;
    }
}

ImageFilter.brightness = function (scale = 1.0) {
    return function (buffer) {
        each(buffer.length, function (i) {
            buffer[i] += scale / 3;
            buffer[i + 1] += scale / 3;
            buffer[i + 2] += scale / 3;
        })

        return buffer;
    }
}

ImageFilter.threshold = function (scale = 100) {
    return function (buffer) {
        each(buffer.length, function (i) {
            var v = (0.2126 * buffer[i] + 0.7152 * buffer[i + 1] + 0.0722 * buffer[i + 2]) >= scale ? 255 : 0;
            buffer[i] = buffer[i + 1] = buffer[i + 2] = Math.round(v)
        })

        return buffer;
    }
}

// Matrix based 

ImageFilter.convolution = function (weights, opaque = true) {
    return function (buffer, sw, sh) {
        const side = Math.round(Math.sqrt(weights.length));
        const halfSide = Math.floor(side / 2);

        const w = sw;
        const h = sh;
        let dst = new Uint8ClampedArray(buffer.length);
        const alphaFac = opaque ? 1 : 0;

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                const sy = y;
                const sx = x;
                const dstIndex = (y * w + x) * 4;

                var r = 0, g = 0, b = 0, a = 0;
                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {

                        const scy = sy + cy - halfSide;
                        const scx = sx + cx - halfSide;

                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            var srcIndex = (scy * sw + scx) * 4;
                            var wt = weights[cy * side + cx];
                            r += buffer[srcIndex] * wt;
                            g += buffer[srcIndex + 1] * wt;
                            b += buffer[srcIndex + 2] * wt;
                            a += buffer[srcIndex + 3] * wt;   // weight 를 곱한 값을 계속 더한다. 
                        }
                    }
                }

                dst[dstIndex] = r;
                dst[dstIndex + 1] = g;
                dst[dstIndex + 2] = b;
                dst[dstIndex + 3] = a + alphaFac * (255 - a);
            }
        }

        return dst;
    }
}

ImageFilter.identity = function () {
    return ImageFilter.convolution([
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ]);
}

ImageFilter.random = function (amount = 10, count = createRandomCount()) {

    return function (buffer, width, height) {
        var rand = createRandRange(-1, 5, count);
        return ImageFilter.convolution(rand)(buffer, width, height);
    }
}


ImageFilter.grayscale2 = function () {
    return ImageFilter.convolution([
        0.3, 0.3, 0.3, 0, 0,
        0.59, 0.59, 0.59, 0, 0,
        0.11, 0.11, 0.11, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ]);
}

ImageFilter.sepia2 = function () {
    return ImageFilter.convolution([
        0.393, 0.349, 0.272, 0, 0,
        0.769, 0.686, 0.534, 0, 0,
        0.189, 0.168, 0.131, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ]);
}

ImageFilter.negative = function () {
    return ImageFilter.convolution([
        -1, 0, 0, 0, 0,
        0, -1, 0, 0, 0,
        0, 0, -1, 0, 0,
        0, 0, 0, 1, 0,
        1, 1, 1, 1, 1
    ]);
}

ImageFilter.sharpen = function () {
    return ImageFilter.convolution([
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ]);
}

ImageFilter['motion-blur'] = ImageFilter.motionBlur = function () {
    return ImageFilter.convolution(weight([
        1, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 1,
    ], 1 / 9));
}

ImageFilter.blur = function () {
    return ImageFilter.convolution(weight([
        1, 1, 1,
        1, 1, 1,
        1, 1, 1
    ], 1 / 9));
}

ImageFilter['gaussian-blur'] = ImageFilter.gaussianBlur = function () {
    return ImageFilter.convolution(weight([
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ], 1 / 16));
}

ImageFilter['gaussian-blur-5x'] = ImageFilter.gaussianBlur5x = function () {
    return ImageFilter.convolution(weight([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, 36, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ], 1 / 256));
}

ImageFilter['unsharp-masking'] = ImageFilter.unsharpMasking = function () {
    return ImageFilter.convolution(weight([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, -476, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ], -1 / 256));
}

ImageFilter.transparency = function () {

    return ImageFilter.convolution([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0.3, 0,
        0, 0, 0, 0, 1,
    ]);
}

ImageFilter.laplacian = function () {

    return ImageFilter.convolution([
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1
    ]);
}

ImageFilter.laplacian.grayscale = function () {
    return ImageFilter.multi('grayscale', 'laplacian');
}

ImageFilter.laplacian5x = function (count = 1) {
    var filter = ImageFilter.convolution([
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, 24, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1
    ]);

    return ImageFilter.filterCount(filter, count);
}

ImageFilter.laplacian5x.grayscale = function () {
    return ImageFilter.multi('grayscale', 'laplacian5x');
}

ImageFilter['kirsch-horizontal'] = ImageFilter.kirschHorizontal = function (count = 1) {
    return ImageFilter.convolution([
        5, 5, 5,
        -3, 0, -3,
        -3, -3, -3
    ]);
}

ImageFilter['kirsch-vertical'] = ImageFilter.kirschVertical = function (count = 1) {
    return ImageFilter.convolution([
        5, -3, -3,
        5, 0, -3,
        5, -3, -3
    ]);
}

ImageFilter.kirsch = function () {
    return ImageFilter.multi('kirsch-horizontal', 'kirsch-horizontal');
}

ImageFilter.kirsch.grayscale = function () {
    return ImageFilter.multi('grayscale', 'kirsch');
}

ImageFilter['sobel-horizontal'] = ImageFilter.sobelHorizontal = function (count = 1) {
    return ImageFilter.convolution([
        -1, -2, -1,
        0, 0, 0,
        1, 2, 1
    ]);
}

ImageFilter['sobel-vertical'] = ImageFilter.sobelVertical = function (count = 1) {
    return ImageFilter.convolution([
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    ]);
}

ImageFilter.sobel = function () {
    return ImageFilter.multi('sobel-horizontal', 'sobel-horizontal');
}

ImageFilter.sobel.grayscale = function () {
    return ImageFilter.multi('grayscale', 'sobel');
}

// intensity  =  0.0 ~ 4.0 
ImageFilter.emboss = function (intensity = 2) { 
    return ImageFilter.convolution([
        intensity * (-2.0), -intensity, 0.0,
        -intensity, 1.0, intensity,
        0.0, intensity, intensity * 2.0,
    ]);
}


export default ImageFilter