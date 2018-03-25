import Filter from './Filter'



function ImageFilter(buffer, opt = { type : 'gray'}) {
    let len = buffer.length;
    const FilterFunction = Filter[opt.type];
    for(var i = 0; i < len ; i += 4) {
        FilterFunction(buffer, i, opt);
    }    

    return buffer;
}

ImageFilter.grayscale = function () {
    return function (buffer) {
        return ImageFilter(buffer, { type : 'grayscale' })
    }
}

ImageFilter.invert = function (scale = 1.0) {
    return function (buffer) {
        return ImageFilter(buffer, { type : 'invert', scale })
    }
}

ImageFilter.sepia = function (scale = 1.0) {
    return function (buffer) {
        return ImageFilter(buffer, { type : 'sepia', scale })
    }
}

ImageFilter.brightness = function (scale = 1.0) {
    return function (buffer) {
        return ImageFilter(buffer, { type : 'brightness', scale })
    }
}

ImageFilter.threshold = function (scale = 1.0) {
    return function (buffer) {
        return ImageFilter(buffer, { type : 'threshold', scale })
    }
}

ImageFilter.convolution = function (weights, opaque) {
    return function (buffer, width, height) {
        return Filter.convolution(buffer, width, height, weights, opaque);
    }
}

ImageFilter.sharpen = function () {
    return ImageFilter.convolution([
        0, -1,  0,
        -1,  5, -1,
        0, -1,  0
    ]);
}

ImageFilter.blur = function () {
    return ImageFilter.convolution([ 
        1/9, 1/9, 1/9,
        1/9, 1/9, 1/9,
        1/9, 1/9, 1/9 
    ]);
}

// sobel filter
ImageFilter.sobel = function (vWeight, hWeight) {
    return function (buffer, width, height) {
        let grayscale = ImageFilter.grayscale()(buffer);

        var vertical = Filter.convolution(grayscale, width, height, vWeight || [
            -1, 0, 1,
            -2, 0, 2,
            -1, 0, 1 
        ]);
        var horizontal = Filter.convolution(grayscale, width, height, hWeight || [
            -1, -2, -1,
             0,  0,  0,
             1,  2,  1 
        ]);        

        var result = new Uint8ClampedArray(grayscale.length);

        for(var i = 0, len = result.length; i < len; i += 4) {
            const v = Math.abs(vertical[i]);
            const h = Math.abs(horizontal[i]);

            var graycolor = Math.sqrt((v * v) + (h * h))>>>0;

            
            //result[i] = v;
            result[i] = graycolor;
            // make the horizontal gradient green
            
            //result[i+1] = h;
            result[i+1] = graycolor;
            // and mix in some blue for aesthetics
            //result[i+2] = (v+h)/4;
            result[i+2] = graycolor;
            result[i+3] = 255; // opaque alpha
        }

        return result;

    }
}


export default ImageFilter