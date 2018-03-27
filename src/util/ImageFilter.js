import Filter from './Filter'

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


function ImageFilter(buffer, opt = { type: 'grayscale' }) {
    let len = buffer.length;
    const FilterFunction = Filter[opt.type];
    for (var i = 0; i < len; i += 4) {
        FilterFunction(buffer, i, opt);
    }

    return buffer;
}

ImageFilter.grayscale = function () {
    return function (buffer) {
        return ImageFilter(buffer, { type: 'grayscale' })
    }
}

ImageFilter.invert = function (scale = 1.0) {
    return function (buffer) {
        return ImageFilter(buffer, { type: 'invert', scale })
    }
}

ImageFilter.sepia = function (scale = 1.0) {
    return function (buffer) {
        return ImageFilter(buffer, { type: 'sepia', scale })
    }
}

ImageFilter.brightness = function (scale = 1.0) {
    return function (buffer) {
        return ImageFilter(buffer, { type: 'brightness', scale })
    }
}

ImageFilter.threshold = function (scale = 100) {
    return function (buffer) {
        return ImageFilter(buffer, { type: 'threshold', scale })
    }
}

ImageFilter.convolution = function (weights, opaque) {
    return function (buffer, width, height) {
        return Filter.convolution(buffer, width, height, weights, opaque);
    }
}

ImageFilter.identity = function () {
    return ImageFilter.convolution([
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ]);
}

ImageFilter.sharpen = function (count = 1) {
    var filter = ImageFilter.convolution([
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ]);

    return ImageFilter.filterCount(filter, count);
}

ImageFilter['motion-blur'] = ImageFilter.motionBlur = function (count = 1) {
    var filter = ImageFilter.convolution(weight([
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

    return ImageFilter.filterCount(filter, count);
}

ImageFilter.blur = function (count = 1) {
    var filter = ImageFilter.convolution(weight([
        1, 1, 1,
        1, 1, 1,
        1, 1, 1
    ], 1 / 9));

    return ImageFilter.filterCount(filter, count);
}

ImageFilter['gaussian-blur'] = ImageFilter.gaussianBlur = function (count = 1) {
    var filter = ImageFilter.convolution(weight([
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ], 1 / 16));

    return ImageFilter.filterCount(filter, count);
}

ImageFilter['gaussian-blur-5x'] = ImageFilter.gaussianBlur5x = function (count = 1) {
    var filter = ImageFilter.convolution(weight([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, 36, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ], 1 / 256));

    return ImageFilter.filterCount(filter, count);
}

ImageFilter['unsharp-masking'] = ImageFilter.unsharpMasking = function (count = 1) {
    const num = -1 / 256;
    var filter = ImageFilter.convolution([
        1, 4, 6, 4, 1,
        4, 16, 24, 16, 4,
        6, 24, -476, 24, 6,
        4, 16, 24, 16, 4,
        1, 4, 6, 4, 1
    ].map(i => { return i * num }));

    return ImageFilter.filterCount(filter, count);
}


ImageFilter.filterCount = function (filter, count = 1) {
    var filters = [];

    for (var i = 0; i < count; i++) {
        filters.push(filter);
    }

    return ImageFilter.multi(filters);
}



// sobel filter

ImageFilter.sobel = function (vWeight, hWeight, grayscale = false) {
    return function (buffer, width, height) {
        buffer = grayscale ? ImageFilter.grayscale()(buffer) : buffer;

        var vertical = Filter.convolution(buffer, width, height, vWeight || [
            -1, 0, 1,
            -2, 0, 2,
            -1, 0, 1
        ]);
        var horizontal = Filter.convolution(buffer, width, height, hWeight || [
            -1, -2, -1,
            0, 0, 0,
            1, 2, 1
        ]);

        var result = new Uint8ClampedArray(buffer.length);

        for (var i = 0, len = result.length; i < len; i += 4) {
            const v = Math.abs(vertical[i]);
            const h = Math.abs(horizontal[i]);

            if (grayscale) {
                var graycolor = Math.floor(Math.sqrt((v * v) + (h * h)));

                result[i] = result[i + 1] = result[i + 2] = graycolor;
            } else {
                result[i] = v;
                result[i + 1] = h;
                result[i + 2] = (v + h) / 4;
            }

            result[i + 3] = 255; // opaque alpha
        }

        return result;

    }
}

ImageFilter['sobel-grayscale'] = ImageFilter.sobel.grayscale = function (vWeight, hWeight) {
    return ImageFilter.sobel(vWeight, hWeight, true);
}

ImageFilter.merge = function (filters) {
    return ImageFilter.multi(...filters);
}


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


export default ImageFilter