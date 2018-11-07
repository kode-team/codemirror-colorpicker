export function debounce (callback, delay) {

    var t = undefined;

    return function (cm, e) {
        if (t) {
            clearTimeout(t);
        }

        t = setTimeout(function () {
            callback(cm, e);
        }, delay || 300);
    }
}

export function get(obj, key, callback) {
    
    var returnValue = typeof obj[key] == 'undefined' ? key : obj[key];

    if (typeof callback == 'function') {
        return callback(returnValue);
    }

    return returnValue; 
}

export default {
    debounce
}