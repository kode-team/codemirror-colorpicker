import { debounce } from "../util/functions/func";

export default class BaseStore {
    constructor (opt) {
        this.callbacks = [] 
        this.actions = []
        this.modules = opt.modules || []

        this.initialize()
    }

    initialize () {
        this.initializeModule();
    }

    initializeModule () {
        this.modules.forEach(ModuleClass => {
            var instance = this.addModule(ModuleClass);
        })
    }

    action (action, context) {
        this.actions[action] = { context, callback: context[action] };
    }

    dispatch (action, ...opts) {
        var m = this.actions[action];

        if (m) {
            return m.callback.apply(m.context, [this, ...opts]);
        }
    }

    read (action, ...opts) {
        return this.dispatch(action, ...opts)
    }

    addModule (ModuleClass) {
        return new ModuleClass(this)
    }

    on (event, originalCallback, context, delay = 0) {
        var callback = delay > 0 ? debounce(originalCallback, delay) : originalCallback;
        this.callbacks.push({ event, callback, context, originalCallback })
    }

    off (event, originalCallback) {

        if (arguments.length == 0) {
            this.callbacks = [] 
        } else if (arguments.length == 1) {
            this.callbacks = this.callbacks.filter(f => {
                return f.event != event 
            })
        } else if (arguments.length == 2) {
            this.callbacks = this.callbacks.filter(f => {
                return !(f.event == event && f.originalCallback == originalCallback)
            })
        }

    }

    emit () {
        var args = [...arguments];
        var event = args.shift();

        this.callbacks.filter(f => {
            return (f.event == event)
        }).forEach(f => {
            if (f && typeof f.callback == 'function' && f.context.source != this.source) {
                f.callback(...args);
            }
        })
    }    
}