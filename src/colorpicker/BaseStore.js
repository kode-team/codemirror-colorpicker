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
        this.modules.forEach(Module => {
            var instance = new Module(this);
        })
    }

    action (action, context) {
        this.actions[action] = { context, callback: context[action] };
    }

    dispatch (action) {
        var args = [...arguments]; 
        var action = args.shift();

        var m = this.actions[action];

        if (m) {
            return m.callback.apply(m.context, [this, ...args]);
        }
    }

    module (ModuleObject) {
        // this.action()
    }

    on (event, callback) {
        this.callbacks.push({ event, callback })
    }

    off (event, callback) {

        if (arguments.length == 0) {
            this.callbacks = [] 
        } else if (arguments.length == 1) {
            this.callbacks = this.callbacks.filter(f => {
                return f.event != event 
            })
        } else if (arguments.length == 2) {
            this.callbacks = this.callbacks.filter(f => {
                return f.event != event && f.callback != callback 
            })
        }

    }

    emit () {
        var args = [...arguments];
        var event = args.shift();

        this.callbacks.filter(f => {
            return (f.event == event)
        }).forEach(f => {
            if (f && typeof f.callback == 'function') {
                f.callback(...args);
            }
        })
    }    
}