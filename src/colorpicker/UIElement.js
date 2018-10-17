import EventMachin from "../util/EventMachin";
import { uuid } from '../util/functions/math'

const CHECK_STORE_EVENT_PATTERN = /^@/

class UIElement extends EventMachin {
    constructor (opt, props) {
        super(opt)

        this.opt = opt || {};
        this.parent = this.opt;
        this.props = props || {}
        this.source = uuid()

        window[this.source] = this; 

        if (opt && opt.$store) {
            this.$store = opt.$store
        }

        this.created();

        this.initialize();
        
        this.initializeStoreEvent();
    }

    created() {

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
            this.$store.on(event, this.storeEvents[event], this);
        });
    }

    destoryStoreEvent () {
        Object.keys(this.storeEvents).forEach(event => {
            this.$store.off(event, this.storeEvents[event])
        })
    }

    read (...args) {
        return this.$store.read(...args)
    }

    run (...args) {
        return this.$store.run(...args);
    }

    dispatch (...args) {
        this.$store.source = this.source ; 
        return this.$store.dispatch(...args)
    }

    emit (...args) {
        this.$store.source = this.source ; 
        this.$store.emit(...args);
    }

}

export default UIElement 