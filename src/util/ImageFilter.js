// TODO: worker run 
import Color from './Color'
import Canvas from './Canvas'
import StackBlur from './blur/StackBlur'

function weight(arr, num = 1) {
    return arr.map(i => {
        return i * num;
    })
}

function repeat (value, num) {
    var result = new Array(num);
    each(num, function () {
        result.push(value);
    })
    return result; 
}

function colorMatrix(pixels, i, matrix) {
    var r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];

    pixels[i] = matrix[0] * r + matrix[1] * g + matrix[2] * b + matrix[3] * a;
    pixels[i+1] = matrix[4] * r + matrix[5] * g + matrix[6] * b + matrix[7] * a;
    pixels[i+2] = matrix[8] * r + matrix[9] * g + matrix[10] * b + matrix[11] * a;
    pixels[i+3] = matrix[12] * r + matrix[13] * g + matrix[14] * b + matrix[15] * a;

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

    const filterFunction = F[filterName];

    return filterFunction.apply(filterFunction, params);
}

function each(len, callback) {
    for (var i = 0; i < len; i += 4) {
        callback(i);
    }
}

function createRandRange(min, max, count) {
    var result = [];

    for (var i = 1; i <= count; i++) {
        var num = Math.random() * (max - min) + min;
        var sign = (Math.floor(Math.random() * 10) % 2 == 0) ? -1 : 1;
        result.push(sign * num);
    }

    result.sort();

    const centerIndex = Math.floor(count / 2);
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

function getBitmap(bitmap, area) {
    return Canvas.getBitmap(bitmap, area);
}

function putBitmap(bitmap, subBitmap, area) {
    return Canvas.putBitmap(bitmap, subBitmap, area);
}


let F = {};
let ImageFilter = F


/** 
 * 
 * multiply filters
 * 
 * ImageFilter.multi('blur', 'grayscale', 'sharpen', ['blur', 3], function (bitmap) {  return bitmap });
 * 
 */
F.multi = function (...filters) {
    filters = filters.map(f => {
        return makeFilter(f);
    })
    return function (bitmap) {
        return filters.reduce((bitmap, f) => {
            return f(bitmap);
        }, bitmap)
    }
}


F.merge = function (filters) {
    return F.multi(...filters);
}

F.partial = function (area, ...filters) {
    return (bitmap) => {
        return putBitmap(bitmap, F.multi(...filters)(getBitmap(bitmap, area)), area);
    }
}

F.counter = function (filter, count = 1) {
    var filters = [];

    for (var i = 0; i < count; i++) {
        filters.push(filter);
    }

    return F.multi(...filters);
}

// Image manupulate 
F.resize = function (dstWidth, dstHeight) {
    return function (bitmap) {
        
        var c = Canvas.drawPixels(bitmap);
        var context = c.getContext('2d');

        c.width = dstWidth;
        c.height = dstHeight;

        return {
            pixels: new Uint8ClampedArray(context.getImageData(0, 0, dstWidth, dstHeight).data),
            width: dstWidth,
            height: dstHeight
        }
    }
}

F.crop = function (dx = 0, dy = 0, dw, dh) {
    return function (bitmap) {

        var c = Canvas.drawPixels(bitmap);
        var context = c.getContext('2d');

        const targetWidth = dw || srcWidth;
        const targetHeight = dh || srcHeight;

        const nextBuffer = context.getImageData(dx, dy, targetWidth, targetHeight);

        return nextBuffer;
    }
}

// Pixel based 

const pack = F.pack = function pack(callback) {
    return function (bitmap) {
        each(bitmap.pixels.length, (i) => {
            callback(bitmap.pixels, i)
        })
        return bitmap;
    }
}

F.grayscale = function (amount) {
    let C = amount / 100;

    if (C > 1) C = 1; 
    
    return pack((pixels, i) => {

        colorMatrix(pixels, i, [
            (0.2126 + 0.7874 * (1 - C)), (0.7152 - 0.7152 * (1 - C)), (0.0722 - 0.0722 * (1 - C)), 0,
            (0.2126 - 0.2126 * (1 - C)), (0.7152 + 0.2848 * (1 - C)), (0.0722 - 0.0722 * (1 - C)), 0,
            (0.2126 - 0.2126 * (1 - C)), (0.7152 - 0.7152 * (1 - C)), (0.0722 + 0.9278 * (1 - C)), 0,
            0, 0, 0, 1
        ])

        /*
        var v = 0.2126 * C * pixels[i] + 0.7152 * C * pixels[i + 1] + 0.0722 * C * pixels[i + 2];
        pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round(v)
        */
    });
}

/*
 * @param {Number} amount   0..100  
 */
F.hue = function (amount = 360) {
    return pack((pixels, i) => {
        var r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];

        var hsv = Color.RGBtoHSV(r, g, b);

        // 0 ~ 360 
        var h = hsv.h;
        h += Math.abs(amount)
        h = h % 360
        hsv.h = h

        var rgb = Color.HSVtoRGB(hsv);

        pixels[i] = rgb.r;
        pixels[i + 1] = rgb.g;
        pixels[i + 2] = rgb.b;

    })
}


F.shade = function (r = 1, g = 1, b = 1) {
    return pack((pixels, i) => {
        pixels[i] *= r;
        pixels[i + 1] *= g;
        pixels[i + 2] *= b;
    })

}

F.bitonal = function (darkColor, lightColor, threshold = 100) {
    darkColor = Color.parse(darkColor);
    lightColor = Color.parse(lightColor);
    return pack((pixels, i) => {

        if (pixels[i] + pixels[i + 1] + pixels[i + 2] <= threshold) {
            pixels[i] = darkColor.r;
            pixels[i + 1] = darkColor.g;
            pixels[i + 2] = darkColor.b;
        } else {
            pixels[i] = lightColor.r;
            pixels[i + 1] = lightColor.g;
            pixels[i + 2] = lightColor.b;
        }
    })

}

F.tint = function (redTint = 1, greenTint = 1, blueTint = 1) {
    return pack((pixels, i) => {
        pixels[i] += (255 - pixels[i]) * redTint;
        pixels[i + 1] += (255 - pixels[i + 1]) * greenTint;
        pixels[i + 2] += (255 - pixels[i + 2]) * blueTint;
    })

}
/**
 * 
 * @param {*} amount   min = 0, max = 100 
 */
F.contrast = function (amount = 0) {
    const C = Math.pow((100 + amount) / 100, 2);
    return pack((pixels, i) => {
        pixels[i] = ((((pixels[i] / 255) - 0.5) * C) + 0.5) * 255;
        pixels[i + 1] = ((((pixels[i + 1] / 255) - 0.5) * C) + 0.5) * 255;
        pixels[i + 2] = ((((pixels[i + 2] / 255) - 0.5) * C) + 0.5) * 255;
    })

}


F.invert = function (amount = 100) {
    const C = amount / 100; 

    return pack((pixels, i) => {

        pixels[i] = (255 - pixels[i]) * C ;
        pixels[i + 1] = (255 - pixels[i + 1]) * C;
        pixels[i + 2] = (255 - pixels[i + 2]) * C;

    })
}

F.opacity = function (amount = 100) {
    const C = amount / 100; 

    return pack((pixels, i) => {
        pixels[i + 3] *= C;
    })
}

/**
 * change the relative darkness of (a part of an image) by overexposure to light.
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 */
F.solarize = function (r, g, b) {
    return pack((pixels, i) => {
        if (pixels[i] < r) pixels[i] = 255 - pixels[i];
        if (pixels[i + 1] < g) pixels[i + 1] = 255 - pixels[i + 1];
        if (pixels[i + 2] < b) pixels[i + 2] = 255 - pixels[i + 2];
    })

}

/*
 * @param {Number} amount  0..100 
 */
F.sepia = function (amount = 100) {
    let C = amount / 100;
    if (C > 1) C = 1; 

    return pack((pixels, i) => {

        colorMatrix(pixels, i, [
            (0.393 + 0.607 * (1 - C)), (0.769 - 0.769 * (1 - C)), (0.189 - 0.189 * (1 - C)), 0,
            (0.349 - 0.349 * (1 - C)), (0.686 + 0.314 * (1 - C)), (0.168 - 0.168 * (1 - C)), 0,
            (0.272 - 0.272 * (1 - C)), (0.534 - 0.534 * (1 - C)), (0.131 + 0.869 * (1 - C)), 0,
            0, 0, 0, 1
        ])
    })
}

F.gamma = function (amount = 1) {
    return pack((pixels, i) => {
        pixels[i] = Math.pow(pixels[i] / 255, amount) * 255
        pixels[i+1] = Math.pow(pixels[i+1] / 255, amount) * 255
        pixels[i+2] = Math.pow(pixels[i+2] / 255, amount) * 255
    })
}

/**
 * 
 * @param {Number} amount 1..100
 */
F.noise = function (amount = 1) {
    return pack((pixels, i) => {
        const C = Math.abs(amount) * 5
        const min = -C
        const max = C 
        const noiseValue = Math.round(min + (Math.random() * (max - min)))
        pixels[i] += noiseValue 
        pixels[i+1] += noiseValue 
        pixels[i+2] += noiseValue 
    })
}

/**
 * 
 * @param {Number} amount from 0 to 100 
 */
F.clip = function (amount = 0) {
    const C = Math.abs(amount) * 2.55

    return pack((pixels, i) => {

        for(var start = i, end = i + 2; start <= end; start++) {
            if (pixels[start] > 255 - C) {
                pixels[start] = 255 
            } else if (pixels[start] < C) {
                pixels[start] = 0 
            }            
        }

    })
}

/*
 * @param {Number} amount  -100..100  ,  value < 0  is darken, value > 0 is brighten 
 */
F.brightness = function (amount = 1) {
    const C = Math.floor(255 * (amount / 100));

    return pack((pixels, i) => {
        pixels[i] += C;
        pixels[i + 1] += C;
        pixels[i + 2] += C;
    })
}

/*
 * @param {Number} amount  -100..100 
 */
F.saturation = function (amount = 100) {
    const C = amount / 100 
    const L = 1 - Math.abs(C);
    return pack((pixels, i) => {

        colorMatrix(pixels, i, [
            L, 0, 0, 0,
            0, L, 0, 0,
            0, 0, L, 0,
            0, 0, 0, L
        ]);

        /*
        const max = Math.max(pixels[i], pixels[i + 1], pixels[i + 2])

        if (pixels[i] != max) { pixels[i] += (max - pixels[i]) * C; }
        if (pixels[i + 1] != max) { pixels[i + 1] += (max - pixels[i + 1]) * C; }
        if (pixels[i + 2] != max) { pixels[i + 2] += (max - pixels[i + 2]) * C; }
        */
    })

}


/*
 * @param {Number} amount  0..100 
 */
F.threshold = function (scale = 200, amount = 100) {
    const C = amount / 100;
    return pack((pixels, i) => {
        var v = (0.2126 * C * pixels[i] + 0.7152 * C * pixels[i + 1] + 0.0722 * C * pixels[i + 2]) >= scale ? 255 : 0;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round(v)
    })

}

// Matrix based 

F.convolution = function (weights, opaque = true) {
    return function ({ pixels, width, height }) {
        const side = Math.round(Math.sqrt(weights.length));
        const halfSide = Math.floor(side / 2);

        var w = width;
        var h = height;
        var sw = w;
        var sh = h;
        let dst = new Uint8ClampedArray(pixels.length);
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
                            r += pixels[srcIndex] * wt;
                            g += pixels[srcIndex + 1] * wt;
                            b += pixels[srcIndex + 2] * wt;
                            a += pixels[srcIndex + 3] * wt;   // weight 를 곱한 값을 계속 더한다. 
                        }
                    }
                }

                dst[dstIndex] = r;
                dst[dstIndex + 1] = g;
                dst[dstIndex + 2] = b;
                dst[dstIndex + 3] = a + alphaFac * (255 - a);
            }
        }

        return { pixels: dst, width: sw, height: sh };
    }
}

F.identity = function () {
    return F.convolution([
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ]);
}

F.random = function (amount = 10, count = createRandomCount()) {
    return function (pixels, width, height) {
        var rand = createRandRange(-1, 5, count);
        return F.convolution(rand)(pixels, width, height);
    }
}


F.grayscale2 = function (amount = 100) {
    return F.convolution(weight([
        0.3, 0.3, 0.3, 0, 0,
        0.59, 0.59, 0.59, 0, 0,
        0.11, 0.11, 0.11, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ], amount / 100));
}

F.sepia2 = function (amount = 100) {
    return F.convolution(weight([
        0.393, 0.349, 0.272, 0, 0,
        0.769, 0.686, 0.534, 0, 0,
        0.189, 0.168, 0.131, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ], amount / 100));
}

F.negative = function (amount = 100) {
    return F.convolution(weight([
        -1, 0, 0, 0, 0,
        0, -1, 0, 0, 0,
        0, 0, -1, 0, 0,
        0, 0, 0, 1, 0,
        1, 1, 1, 1, 1
    ], amount / 100));
}

F.sharpen = function (amount = 100) {
    return F.convolution(weight([
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ], amount / 100));
}

F['motion-blur'] = F.motionBlur = function () {
    return F.convolution(weight([
        1, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 1,
    ], 1));
}

F['motion-blur-2'] = F.motionBlur2 = function (amount = 9) {
    return F.convolution(weight([
        1, 0, 0, 0, 0, 0, 0, 0, 1,
        0, 1, 0, 0, 0, 0, 0, 1, 0,
        0, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 0, 0, 1, 0,
        1, 0, 0, 0, 0, 0, 0, 0, 1,
    ], 1 / amount));
}

F['motion-blur-3'] = F.motionBlur3 = function (amount = 9) {
    return F.convolution(weight([
        1, 0, 0, 0, 1, 0, 0, 0, 1,
        0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 1, 1, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 0, 1, 0, 0, 1, 0,
        1, 0, 0, 0, 1, 0, 0, 0, 1,
    ], 1 / amount));
}

/**
 * 
 * @param {Number} radius   from 1 to 100 
 */
F.blur = function (radius = 10, hasAlphaChannel = true) {

    return function (bitmap) {
        return StackBlur(bitmap, radius, hasAlphaChannel )
    }
}

function pow2(num) {
    return Math.pow(num, 2);
}

function gaussian (x, y, delta = 1.5) {
    const D = pow2(delta);
    const X = pow2(x);
    const Y = pow2(y);
    return (
        1 / (2 * Math.PI * D) 
        *  
        Math.exp(
            -( X  + Y ) / (2 * D)
        )
    )
}

F['gaussian-blur'] = F.gaussianBlur = function (amount = 100) {
    const C = amount / 100; 
    return F.convolution(weight([
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ], 1/16 ));
}

F['gaussian-blur-5x'] = F.gaussianBlur5x = function (amount = 100) {
    const C = amount / 100;
    return F.convolution(weight([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, 36, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ], 1/256));
}

F['unsharp-masking'] = F.unsharpMasking = function (amount = 256) {
    return F.convolution(weight([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, -476, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ], -1 / amount));
}

F.transparency = function (amount = 100) {

    return F.convolution(weight([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0.3, 0,
        0, 0, 0, 0, 1,
    ], amount / 100));
}

F.laplacian = function (amount = 100) {

    return F.convolution(weight([
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1
    ], amount / 100));
}

F.laplacian.grayscale = function (amount = 100) {
    return F.multi('grayscale', ['laplacian', amount]);
}

F.laplacian5x = function (amount = 100) {

    return F.convolution(weight([
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, 24, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1
    ], amount / 100));
}

F.laplacian5x.grayscale = function () {
    return F.multi('grayscale', 'laplacian5x');
}

F['kirsch-horizontal'] = F.kirschHorizontal = function (count = 1) {
    return F.convolution([
        5, 5, 5,
        -3, 0, -3,
        -3, -3, -3
    ]);
}

F['kirsch-vertical'] = F.kirschVertical = function (count = 1) {
    return F.convolution([
        5, -3, -3,
        5, 0, -3,
        5, -3, -3
    ]);
}

F.kirsch = function () {
    return F.multi('kirsch-horizontal', 'kirsch-vertical');
}

F.kirsch.grayscale = function () {
    return F.multi('grayscale', 'kirsch');
}

F['sobel-horizontal'] = F.sobelHorizontal = function () {
    return F.convolution([
        -1, -2, -1,
        0, 0, 0,
        1, 2, 1
    ]);
}

F['sobel-vertical'] = F.sobelVertical = function () {
    return F.convolution([
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    ]);
}

F.sobel = function () {
    return F.multi('sobel-horizontal', 'sobel-vertical');
}

F.sobel.grayscale = function () {
    return F.multi('grayscale', 'sobel');
}

/*
 * carve, mold, or stamp a design on (a surface) so that it stands out in relief.
 * 
 * @param {Number} amount   0.0 .. 4.0 
 */
F.emboss = function (amount = 4) {
    return F.convolution([
        amount * (-2.0), -amount, 0.0,
        -amount, 1.0, amount,
        0.0, amount, amount * 2.0,
    ]);
}

/**
 * multi filter 
 */

F.vintage = function () {
    return F.multi(
        ['brightness', 15], 
        ['saturation', -20], 
        ['gamma', 1.8]
    )
}

export default ImageFilter