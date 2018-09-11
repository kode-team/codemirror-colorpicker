import EventMachin from "../util/EventMachin";

const CHECK_STORE_EVENT_PATTERN = /^@/

class UIElement extends EventMachin {
    constructor (opt) {
        super(opt)

        this.opt = opt || {};

        if (opt && opt.$store) {
            this.$store = opt.$store
        }

        this.initialize();

        this.initializeStoreEvent();
    }

    /**
     * initialize store event 
     * 
     * you can define '@xxx' method(event) in UIElement 
     * 
     * 
     */
    initializeStoreEvent () {
        this.storeEvents = {}
        this.filterProps(CHECK_STORE_EVENT_PATTERN).forEach((key) => {
            const arr = key.split('@')
            arr.shift();
            const event = arr.join('@');

            this.storeEvents[event] = this[key].bind(this)
            this.$store.on(event, this.storeEvents[event]);
        });
    }

    destoryStoreEvent () {
        Object.keys(this.storeEvents).forEach(event => {
            this.$store.off(event, this.storeEvents[event])
        })
    }
}

export default UIElement 