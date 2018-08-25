import { matches } from '../filter/functions'
import filters from './filter/index'
import GL from './index'

const functions = {
    filter
}
export function makeGroupedFilter(filters = []) {
    var groupedFilter = [] 
    var group = []
    for (var i = 0, len = filters.length; i < len; i++) {
        var f = filters[i]

        if (f.userShader) {
            group.push(f)
        } else {
            if (group.length) {
                groupedFilter.push([...group])
            }
            groupedFilter.push(f)
            group = [] 
        }
    }

    if (group.length) {
        groupedFilter.push([...group])
    }

    groupedFilter.forEach((filter, index) => {
        if (Array.isArray(filter)) {
            groupedFilter[index] = (function () {
                const userFunction = makePrebuildUserFilterListForGL(filter)
                // console.log(userFunction)
                return function (bitmap, done) {                    
                    for (var i = 0, len = bitmap.pixels.length; i< len;i += 4) {
                        userFunction(bitmap.pixels, i)
                    }

                    done(bitmap)
                }
            })()
        }
    })

    return groupedFilter
}



export function multi (...filters) {
    filters = filters.map(filter => {
        return makeFilter(filter);
    }).filter(f => f)

    filters = makeGroupedFilter(filters)

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

export function merge (arr) {
    return multi(...arr)
}

export function makeFilterFunction (filterObj) {
    const filterName = filterObj.arr[0]
    var f = filters[filterName]

    let arr = filterObj.arr 
    arr.shift()

    var result = f.apply(this, arr)

    return result
}

/**
 * 겹쳐져 있는 Filter 함수를 1차원으로 나열한다. 
 * ex)  ['sobel'] => ['sobel-horizontal', 'sobel-vertial'] 
 * 
 * @param {String|Array} filterString 
 */
export function flatFilter (filterString) {

    let filter_list = [] 

    if (typeof filterString == 'string') {
        filter_list = matches(filterString)
    } else if (Array.isArray(filterString)) {
        filter_list = filterString;
    }

    let allFilter = []

    filter_list.forEach(filterObj => {
        const filterName = filterObj.arr[0] 

        if (filters[filterName]) {
            const f = makeFilterFunction(filterObj);

            if (f.type == 'convolution' || f.type == 'shader') {
                allFilter.push(f)
            } else {
                f.forEach(subFilter => {
                    allFilter = allFilter.concat(flatFilter(subFilter))
                })  
            }
        } 
    })

    // console.log(filter_list, allFilter)

    return allFilter
}

export function filter (img, filterString, callback, opt) {

    const canvas = new GL.GLCanvas({
        width: opt.width || img.width,
        height: opt.height || img.height,
        img 
    });

    canvas.filter(flatFilter(filterString), function done () {
        if (typeof callback == 'function') {
            callback(canvas)
        }
    })
}


export default functions 