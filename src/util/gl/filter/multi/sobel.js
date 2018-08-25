import {
    multi
} from '../util'

export default function sobel () {
    return multi('sobel-horizontal sobel-vertical');
}