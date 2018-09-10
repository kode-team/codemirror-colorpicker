import EventMachin from "../util/EventMachin";

class UIElement extends EventMachin {
    constructor (opt) {
        super(opt)

        if (opt && opt.$store) {
            this.$store = opt.$store
        }

    }
}

export default UIElement 