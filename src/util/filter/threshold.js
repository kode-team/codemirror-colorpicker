import Color from '../Color'

export default function (buffer, i = 0, opt = {scale : 1}) { 
    var v = (0.2126 * buffer[i] + 0.7152 * buffer[i+1] + 0.0722 * buffer[i+2] >= opt.scale ) ? 255 : 0;
    buffer[i] = buffer[i+1] = buffer[i+2] = Math.round(v)      
}