import {
    multi
} from '../util'

export default function vintage () {
    return multi(`brightness(0.15) saturation(-0.2) gamma(1.8)`)
}