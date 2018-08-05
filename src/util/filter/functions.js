import Canvas from '../Canvas'
import Matrix from '../Matrix'
import ImageFilter from './index' 

const functions = {
    partial,
    multi,
    merge,
    weight,
    repeat,
    colorMatrix,
    each,
    eachXY,
    createRandomCount,
    createRandRange,
    createBitmap,
    createBlurMatrix,
    pack,
    packXY,
    getBitmap,
    putBitmap,
    radian,
    convolution,
    parseParamNumber,
    filter,
    clamp,
    fillColor,
    multi,
    merge,
    matches,
    parseFilter,
    partial
}

const LocalFilter = functions

export default functions

export function weight(arr, num = 1) {
    return arr.map(i => {
        return i * num;
    })
}

export function repeat (value, num) {
    let arr = new Array(num)
    for(let i = 0; i < num; i++) {
        arr[i] = value 
    }
    return arr; 
}

export function colorMatrix(pixels, i, matrix) {
    var r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];

    pixels[i] = matrix[0] * r + matrix[1] * g + matrix[2] * b + matrix[3] * a;
    pixels[i+1] = matrix[4] * r + matrix[5] * g + matrix[6] * b + matrix[7] * a;
    pixels[i+2] = matrix[8] * r + matrix[9] * g + matrix[10] * b + matrix[11] * a;
    pixels[i+3] = matrix[12] * r + matrix[13] * g + matrix[14] * b + matrix[15] * a;

}

export function makeFilter(filter) {

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

    const filterFunction = ImageFilter[filterName] || LocalFilter[filterName] ;

    if (!filterFunction) {
        throw new Error(`${filterName} is not filter. please check filter name.`)
    }
    return filterFunction.apply(filterFunction, params);
}

export function forLoop (max, index = 0, step = 1, callback, done, functionDumpCount = 10000, frameTimer = 'full') {
    let runIndex = index 
    let timer = (callback) => { 
        setTimeout(callback, 0) 
    }
    
    if (frameTimer == 'requestAnimationFrame')  {
        timer = requestAnimationFrame
        functionDumpCount = 1000
    }

    if (frameTimer == 'full') { /* only for loop  */
        timer = nextCallback 
        functionDumpCount = max 
    }

    function runCallback () {

        let currentRunIndex = runIndex 
        for(var i = 0; i < functionDumpCount; i++) {
            currentRunIndex = runIndex + i * step
            
            if (currentRunIndex >= max) {
                break; 
            }
            callback(currentRunIndex)             
        }

        nextCallback(currentRunIndex)
    }

    function nextCallback (currentRunIndex) {
        if (currentRunIndex) {
            runIndex = currentRunIndex
        } else {
            runIndex += step 
        }

        if (runIndex >= max) {
            done()
            return;  
        }

        timer(runCallback)
    }

    runCallback()
}

export function each(len, callback, done, opt = {}) {

    forLoop(len, 0, 4, function (i) {
        callback(i, i/4 /* xyIndex */);
    }, function () {
        done()
    }, opt.functionDumpCount, opt.frameTimer)
}

export function eachXY(len, width, callback, done, opt = {}) {

    forLoop(len, 0, 4, function (i) {
        var xyIndex = i / 4 
        callback(i, xyIndex % width, Math.floor(xyIndex / width));
    }, function () {
        done()
    }, opt.functionDumpCount, opt.frameTimer)
}

export function createRandRange(min, max, count) {
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

export function createRandomCount() {
    return [3 * 3, 4 * 4, 5 * 5, 6 * 6, 7 * 7, 8 * 8, 9 * 9, 10 * 10].sort(function (a, b) {
        return 0.5 - Math.random();
    })[0];
}

export function createBitmap(length, width, height) {
    return { pixels: new Uint8ClampedArray(length), width, height }
}

export function getBitmap(bitmap, area) {
    return Canvas.getBitmap(bitmap, area);
}

export function putBitmap(bitmap, subBitmap, area) {
    return Canvas.putBitmap(bitmap, subBitmap, area);
}

export function parseParamNumber (param) {
    if (typeof param === 'string') {
        param = param.replace(/deg/, '')
        param = param.replace(/px/, '')
    }
    return +param 
} 

const filter_regexp = /(([\w_\-]+)(\(([^\)]*)\))?)+/gi;
const filter_split = ' '

export { filter_regexp, filter_split }

export function pack(callback) {
    return function (bitmap, done) {
        each(bitmap.pixels.length, (i, xyIndex) => {
            callback(bitmap.pixels, i, xyIndex)
        }, function () {
            done(bitmap);
        })
    }
}


const ColorListIndex = [0, 1, 2, 3]

export function swapColor (pixels, startIndex, endIndex) {

    ColorListIndex.forEach(i => {
        var temp = pixels[startIndex + i]
        pixels[startIndex + i] = pixels[endIndex + i]
        pixels[endIndex + i] = temp
    })
}

export function packXY(callback) {
    return function (bitmap, done, opt = {}) {
        eachXY(bitmap.pixels.length, bitmap.width, (i, x, y) => {
            callback(bitmap.pixels, i, x, y)
        }, function () {
            done(bitmap);
        }, opt)

    }
}

export function radian (degree) {
    return Matrix.CONSTANT.radian(degree)
}


export function createBlurMatrix (amount = 3) {
    const count = Math.pow(amount, 2)
    const value = 1/count
    return repeat (value, count)
}

export function fillColor(pixels, i, r, g, b, a) {
    if (arguments.length == 3) {      
        var {r, g, b, a} = arguments[2]
    }

    if (typeof r == 'number') {pixels[i] = r; }
    if (typeof g == 'number') {pixels[i + 1] = g; }
    if (typeof b == 'number') {pixels[i + 2] = b; }
    if (typeof a == 'number') {pixels[i + 3] = a; }

}

export function convolution(weights, opaque = true) {
    return function (bitmap, done, opt = {}) {
        const side = Math.round(Math.sqrt(weights.length));
        const halfSide = Math.floor(side / 2);

        var w = bitmap.width;
        var h = bitmap.height;
        var sw = w;
        var sh = h;
        let newBitmap = createBitmap(bitmap.pixels.length, bitmap.width, bitmap.height)
        const alphaFac = opaque ? 1 : 0;

        packXY((pixels, dstIndex, x, y) => {
            const sy = y;
            const sx = x;
            // const dstIndex = (y * w + x) * 4;

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

            fillColor(newBitmap.pixels, dstIndex, r, g, b, a)

        })(bitmap, function () {
            done(newBitmap)
        }, opt)

    }
}


export function matches (str) {
    var ret = Color.convertMatches(str)
    const matches = ret.str.match(filter_regexp);
    let result = [];

    if (!matches) {
        return result;
    }

    result = matches.map((it) => {
        return { filter: it, origin: Color.reverseMatches(it, ret.matches) }
    })

    var pos = { next: 0 }
    result = result.map(item => {

        const startIndex = str.indexOf(item.origin, pos.next);

        item.startIndex = startIndex;
        item.endIndex = startIndex + item.origin.length;

        item.arr = parseFilter(item.origin) 

        pos.next = item.endIndex;

        return item 
    }).filter(it => {
        if (!it.arr.length) return false 
        return true
    })

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
export function parseFilter (filterString) {

    var ret = Color.convertMatches(filterString)
    const matches = ret.str.match(filter_regexp);

    if (!matches[0]) {
        return []
    }

    var arr = matches[0].split('(')

    var filterName = arr.shift()
    var filterParams = [] 

    if (arr.length) {
        filterParams = arr.shift().split(')')[0].split(',').map(f => {
            return Color.reverseMatches(f, ret.matches)
        })    
    }
    
    var result = [filterName, ...filterParams].map(Color.trim)
    
    return result 
}

export function clamp (num) {ß
    return Math.min(255, num)
} 



export function filter (str) {
    return merge(matches(str).map(it => {
        return it.arr 
    }))
}

/** 
 * 
 * multiply filters
 * 
 * ImageFilter.multi('blur', 'grayscale', 'sharpen', ['blur', 3], function (bitmap) {  return bitmap });
 * 
 */
export function multi (...filters) {
    filters = filters.map(filter => {
        return makeFilter(filter);
    })

    var max = filters.length 

    return function (bitmap, done, opt = {}) {

        var currentBitmap = bitmap 
        var index = 0 

        function runFilter () {
            filters[index].call(null, currentBitmap, function (nextBitmap) {
                currentBitmap = nextBitmap  
    
                nextFilter()
            }, opt)
        }

        function nextFilter () {
            index++ 

            if (index >= max) {
                done(currentBitmap)
                return;  
            }

            runFilter()
        }

        runFilter()
    }
}


export function merge (filters) {
    return multi(...filters);
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
export function partial (area, ...filters) {
    var allFilter = null 
    if (filters.length == 1 && typeof filters[0] === 'string') {
        allFilter = filter(filters[0])
    } else {
        allFilter = merge(filters)
    } 

    return (bitmap, done, opt = {}) => {
        allFilter(getBitmap(bitmap, area), function (newBitmap) {
            done(putBitmap(bitmap, newBitmap, area))
        }, opt)
    }
}