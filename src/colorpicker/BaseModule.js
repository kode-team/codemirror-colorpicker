export default class BaseModule {
    constructor ($store) {
        this.$store = $store;
        this.initialize();
    }

    initialize() {
        this.filterProps().forEach(key => {
            this.$store.action(key, this);
        });
    }

    filterProps (pattern = '/') {
        return Object.getOwnPropertyNames(this.__proto__).filter(key => {
            return key.startsWith(pattern);
        });
    }

}