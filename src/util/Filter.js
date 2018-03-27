import Color from './Color'
import  grayscale from './filter/grayscale'
import convolution from './filter/convolution'
import invert from './filter/invert'
import sepia from './filter/sepia'
import threshold from './filter/threshold'
import brightness from './filter/brightness'

const Filter = {
    grayscale ,
    invert,
    sepia,
    threshold,
    convolution,
    brightness
}

export default Filter; 