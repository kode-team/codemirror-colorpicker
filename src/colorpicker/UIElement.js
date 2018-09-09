import EventMachin from "../util/EventMachin";
import ColorManager from './ColorManager'

class UIElement extends EventMachin {
    constructor (opt) {
        super(opt)

        if (opt && opt.$store) {
            this.$store = opt.$store
        }

    }
}

export default UIElement 