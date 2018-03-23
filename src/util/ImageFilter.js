import Filter from './Filter'



function ImageFilter(buffer, opt = { type : 'gray'}) {
    let len = buffer.length, r, g, b, a;
    for(var i = 0; i < len ; i += 4) {
        [ buffer[i], buffer[i+1], buffer[i+2] ] = Filter[opt.type].call(Filter, [buffer[i], buffer[i+1], buffer[i+2]], opt);
    }    

    return buffer;
}

ImageFilter.gray = function (scale = 1.0) {
    return function (buffer) {
        return ImageFilter(buffer, { type : 'gray', scale })
    }
}


export default ImageFilter