import Event from './Event'
import Dom from './Dom'
import State from './State'

const CHECK_EVENT_PATTERN = /^(click|mouse(down|up|move|enter|leave)|key(down|up|press)|contextmenu|change|input)/ig;
const EVENT_SAPARATOR = ' '
const META_KEYS = ['Control', 'Shift', 'Alt', 'Meta'];

export default class EventMachin {

  constructor() { 
    this.state = new State(this);
    this.refs = {} 

    this.childComponents = this.components()
  }

  newChildComponents () {
    const childKeys = Object.keys(this.childComponents)
    childKeys.forEach(key => {
      const Component = this.childComponents[key]

      this[key] = new Component(this);
      this[key].$store = this.$store || {};
    })
  }

  render () {
    this.newChildComponents();

    const childKeys = Object.keys(this.childComponents)
    this.$el = this.parseTemplate(this.template())
    this.refs.$el = this.$el; 

    childKeys.forEach(key => { this[key].render(); })    

    this.parseTarget()
    childKeys.forEach(key => { this[key].parseTarget(); })    

    this.load()
  }
 
  components () {
    return {} 
  }

  parseTemplate (html) {
    const $el = new Dom("div").html(html).firstChild()
    const refs = $el.findAll("[ref]");
    [...refs].forEach(node => {
      const name = node.getAttribute("ref");
      this.refs[name] = new Dom(node);

      const callbackName = `load ${name}`

      if (this[callbackName]) {
        this.refs[name].load = () => {
          new Dom(node).html(this.parseTemplate(this[callbackName].call(this)))
        }  
      }
    })

    return $el; 

  }

  parseTarget () {
    const $el = this.$el; 
    const targets = $el.findAll('[target]');

    [...targets].forEach(node => {
      const targetComponentName = node.getAttribute('target')

      if (this[targetComponentName]) {
        $el.replace(node, this[targetComponentName].$el.el)
      }
    })
  }

  load () {
    Object.keys(this.refs).forEach(key => {
      if (this.refs[key].load) {
        this.refs[key].load()
      }
    })
  }

  template () {
    return '<div></div>';
  }

  initialize() {
    
  }

  initializeEvent () { 
    this.initializeEventMachin();

    Object.keys(this.childComponents).forEach(key => {
      if (this[key]) this[key].initializeEvent()
    })

  }

  destroy() {
    this.destroyEventMachin();
    // this.refs = {} 

    Object.keys(this.childComponents).forEach(key => {
      if (this[key]) this[key].destroy()
    })

  }

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
      el = this.refs[dom] || this[dom] || window[dom]; 
    } else {
      el = this.el || this.$el || this.$root; 
    }

    if (el instanceof Dom) {
      return el.getElement();
    }

    return el;
  }

  getDefaultEventObject (eventName) {
    let arr = eventName.split('.');
    const realEventName = arr.shift();

    const isControl = arr.includes('Control');
    const isShift =  arr.includes('Shift');
    const isAlt = arr.includes('Alt');
    const isMeta =  arr.includes('Meta');

    arr = arr.filter((code) => {
      return META_KEYS.includes(code) === false;
    });
    
    const checkMethodList = arr.filter(code => {
      return !!this[code];
    });
    
    arr = arr.filter(code => {
      return checkMethodList.includes(code) === false; 
    }).map(code => {
      return code.toLowerCase() 
    });

    return {
      eventName : realEventName,
      isControl,
      isShift,
      isAlt,
      isMeta,
      codes : arr,
      checkMethodList: checkMethodList
    }
  }

  bindingEvent ([ eventName, dom, ...delegate], callback) {
    dom = this.getDefaultDomElement(dom);
    let eventObject = this.getDefaultEventObject(eventName);

    eventObject.dom = dom;
    eventObject.delegate = delegate.join(EVENT_SAPARATOR);

    this.addEvent(eventObject, callback);
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

  checkEventType (e, eventObject ) {
    var onlyControl = e.ctrlKey ? eventObject.isControl : true;
    var onlyShift = e.shiftKey ? eventObject.isShift : true; 
    var onlyAlt = e.altKey ? eventObject.isAlt : true; 
    var onlyMeta = e.metaKey ? eventObject.isMeta : true; 

    var hasKeyCode = true; 
    if (eventObject.codes.length) {
      hasKeyCode = eventObject.codes.includes(e.code.toLowerCase()) || eventObject.codes.includes(e.key.toLowerCase());
    }

    var isAllCheck = true;  
    if (eventObject.checkMethodList.length) {  // 체크 메소드들은 모든 메소드를 다 적용해야한다. 
      isAllCheck = eventObject.checkMethodList.every(method => {
        return this[method].call(this, e);
      });
    }

    return (onlyControl && onlyAlt && onlyShift && onlyMeta && hasKeyCode && isAllCheck);
  }

  makeCallback ( eventObject, callback) {
    if (eventObject.delegate) {
      return (e) => {

        if (this.checkEventType(e, eventObject)) {
          const delegateTarget = this.matchPath(e.target || e.srcElement, eventObject.delegate);
  
          if (delegateTarget) { // delegate target 이 있는 경우만 callback 실행 
            e.delegateTarget = delegateTarget;
            e.$delegateTarget = new Dom(delegateTarget);
            return callback(e);
          } 
        }

      }
    }  else {
      return (e) => {
        if (this.checkEventType(e, eventObject)) { 
          return callback(e);
        }
      }
    }
  }

  addEvent(eventObject, callback) {
    eventObject.callback = this.makeCallback(eventObject, callback)
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
