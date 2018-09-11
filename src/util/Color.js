import formatter from "./functions/formatter";
import math from './functions/math'
import fromRGB from './functions/fromRGB'
import fromCMYK from './functions/fromCMYK'
import fromLAB from './functions/fromLAB'
import fromHSV from './functions/fromHSV'
import fromHSL from './functions/fromHSL'
import fromYCrCb from './functions/fromYCrCb'
import mixin from "./functions/mixin";
import parser from "./functions/parser";
import image from "./functions/image";


export default {
    ...formatter, 
    ...math, 
    ...mixin,
    ...parser,
    ...fromYCrCb,
    ...fromRGB,
    ...fromCMYK,
    ...fromHSV,
    ...fromHSL,
    ...fromLAB,
    ...image
}

