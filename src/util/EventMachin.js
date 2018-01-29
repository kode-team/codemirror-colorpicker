import Event from './Event'
import Dom from './Dom'

const CHECK_EVENT_PATTERN = /^(click|mouse(down|up|move|enter|leave)|key(down|up|press)|contextmenu)/ig;
const EVENT_SAPARATOR = ' '

export default class EventMachin {


  destroyEventMachin () {
    this.removeEventAll();
  }

  initializeEventMachin () {
    this.filterProps(CHECK_EVENT_PATTERN).forEach(this.parseEvent.bind(this));
  }

  filterProps (pattern) {
    return Object.getOwnPropertyNames(this.__proto__).filter(key => {
      return key.match(pattern);
    });
  }

  parseEvent (key) {
    let arr = key.split(EVENT_SAPARATOR) ;

    this.bindingEvent(arr,this[key].bind(this));
  }

  getDefaultDomElement (dom) {
    let el; 

    if (dom) {
      el = this[dom] || window[dom]; 
    } else {
      el = this.el || this.$el || this.$root; 
    }

    if (el instanceof Dom) {
      return el.getElement();
    }

    return el;
  }

  bindingEvent ([ eventName, dom, ...delegate], callback) {
    dom = this.getDefaultDomElement(dom);

    this.addEvent(eventName, dom, delegate.join(EVENT_SAPARATOR), callback);
  }

  matchPath(el, selector) {
    if (el) {
      if (el.matches(selector)) { return el; }
      return this.matchPath(el.parentElement, selector);
    }
    return null;
  }

  getBindings () {

    if (!this._bindings) {
      this.initBindings();
    }

    return this._bindings;
  }

  addBinding (obj) {
    this.getBindings().push(obj);
  }

  initBindings() {
    this._bindings = [];
  }

  makeCallback ( eventName, dom, delegate, callback) {
    if (delegate) {
      return (e) => {
        const delegateTarget = this.matchPath(e.target || e.srcElement, delegate);

        if (delegateTarget) { // delegate target 이 있는 경우만 callback 실행 
          e.delegateTarget = delegateTarget;
          callback(e);
        } 
      }
    }  else {
      return (e) => {
        callback(e);
      }
    }
  }

  addEvent(eventName, dom, delegate, callback) {
    const eventObject = { 
      eventName, 
      dom, 
      delegate, 
      callback : this.makeCallback(eventName, dom, delegate, callback)
    };
    this.addBinding(eventObject);
    Event.addEvent(eventObject.dom, eventObject.eventName, eventObject.callback)
  }

  removeEventAll () {
    this.getBindings().forEach(obj => {
      this.removeEvent(obj);
    });
    this.initBindings();
  }

  removeEvent({eventName, dom, callback}) {
    Event.removeEvent(dom, eventName, callback);
  }
}
