// TODO: worker run 
import {
    makeFilter,
    getBitmap,
    putBitmap,
    pack,
    packXY,
    swapColor,
    matches 
} from './filter/functions'

import ImageFilter from './filter/index' 

Object.assign(ImageFilter, {
    pack,
    packXY,
    swapColor
})

let F = ImageFilter

F.filter = function (str) {
    return F.merge(matches(str).map(it => {
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
F.multi = function (...filters) {
    filters = filters.map(filter => {
        return makeFilter(filter, F);
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

/**
 * apply filter into special area
 * 
 * F.partial({x,y,width,height}, filter, filter, filter )
 * F.partial({x,y,width,height}, 'filter' )
 * 
 * @param {{x, y, width, height}} area 
 * @param {*} filters   
 */
F.partial = function (area, ...filters) {
    var allFilter = null 
    if (filters.length == 1 && typeof filters[0] === 'string') {
        allFilter = F.filter(filters[0])
    } else {
        allFilter = F.merge(filters)
    } 

    return (bitmap) => {
        return putBitmap(bitmap, allFilter(getBitmap(bitmap, area)), area);
    }
}

F.counter = function (filter, count = 1) {
    var filters = [];

    for (var i = 0; i < count; i++) {
        filters.push(filter);
    }

    return F.multi(...filters);
}


/**
 * multi filter 
 */


F.laplacian.grayscale = function (amount = 100) {
    return F.filter(`grayscale laplacian(${amount}`)
}


F.laplacian5x.grayscale = function () {
    return F.filter('grayscale laplacian5x');
}


F.kirsch = function () {
    return F.filter('kirsch-horizontal kirsch-vertical');
}

F.kirsch.grayscale = function () {
    return F.filter('grayscale kirsch');
}

F.sobel = function () {
    return F.filter('sobel-horizontal sobel-vertical');
}

F.sobel.grayscale = function () {
    return F.filter('grayscale sobel');
}

F.vintage = function () {
    return F.filter(`brightness(15) saturation(-20) gamma(1.8)`)
}

export default ImageFilter