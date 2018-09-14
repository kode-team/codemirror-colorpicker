import Event from './Event'
import Dom from './Dom'
import State from './State'

const CHECK_EVENT_PATTERN = /^(click|mouse(down|up|move|enter|leave)|touch(start|move|end)|key(down|up|press)|contextmenu|change|input)/ig;
const CHECK_LOAD_PATTERN = /^load (.*)/ig;
const EVENT_SAPARATOR = ' '
const META_KEYS = ['Control', 'Shift', 'Alt', 'Meta'];

export default class EventMachin {

  constructor() { 
    this.state = new State(this);
    this.refs = {} 

    this.childComponents = this.components()
  }

  /**
   * 자식으로 사용할 컴포넌트를 생성해준다. 
   * 생성 시점에 $store 객체가 자동으로 공유된다. 
   * 모든 데이타는 $store 기준으로 작성한다. 
   */
  newChildComponents () {
    const childKeys = Object.keys(this.childComponents)
    childKeys.forEach(key => {
      const Component = this.childComponents[key]

      this[key] = new Component(this);
    })
  }

  /**
   * 부모가 정의한 template 과  그 안에서 동작하는 자식 컴포넌트들을 다 합쳐서 
   * 최종 element 를 만들어준다. 
   * 
   * 그리고 자동으로 load 되어질게 있으면 로드 해준다. 
   */
  render () {
    // 1. 나의 template 을 만들어내고  
    this.$el = this.parseTemplate(this.template())
    this.refs.$el = this.$el;         

    // 개별 객체 셋팅하고 
    this.parseTarget()

    // 데이타 로드 하고 
    this.load()    

  }
 
  /**
   * 자식 컴포넌트로 사용될 객체 정의 
   */
  components () {
    return {} 
  }

  /**
   * Class 기반으로 $el 을 생성하기 위해서 
   * 선언형으로 html 템플릿을 정의한다. 
   * 
   * @param {*} html 
   */
  parseTemplate (html) {
    const $el = new Dom("div").html(html).firstChild()

    // ref element 정리 
    var refs = $el.findAll('[ref]');

    [...refs].forEach(node => {
      const name = node.getAttribute('ref')
      this.refs[name] = new Dom(node);
    })

    return $el; 
  }

  /**
   * target 으로 지정된 자식 컴포넌트를 대체해준다.
   */
  parseTarget () {
    const $el = this.$el; 
    const targets = $el.findAll('[target]');

    [...targets].forEach(node => {
      const targetComponentName = node.getAttribute('target')
      const refName = node.getAttribute('ref') || targetComponentName

      var Component = this.childComponents[targetComponentName]
      var instance = new Component(this);
      this[refName] = instance
      this.refs[refName] = instance.$el

      if (instance) {
        instance.render()
        $el.replace(node, instance.$el.el)                
      }
    })
  }

  // load function이 정의된 객체는 load 를 실행해준다. 
  load () {
    
    this.filterProps(CHECK_LOAD_PATTERN).forEach(callbackName => {
      const elName = callbackName.split('load ')[1]

      if (this.refs[elName]) { 
        this.refs[elName].html(this.parseTemplate(this[callbackName].call(this)))
      }
    })
  }

  // 기본 템플릿 지정 
  template () {
    return '<div></div>';
  }

  initialize() {

  }

  /**
   * 이벤트를 초기화한다. 
   */
  initializeEvent () { 
    this.initializeEventMachin();

    // 자식 이벤트도 같이 초기화 한다. 
    // 그래서 이 메소드는 부모에서 한번만 불려도 된다. 
    Object.keys(this.childComponents).forEach(key => {
      if (this[key]) this[key].initializeEvent()
    })

  }

  /**
   * 자원을 해제한다. 
   * 이것도 역시 자식 컴포넌트까지 제어하기 때문에 가장 최상위 부모에서 한번만 호출되도 된다. 
   */
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

  /**
   * property 수집하기 
   * 상위 클래스의 모든 property 를 수집해서 리턴한다. 
   */
  collectProps () {

    if (!this.collapsedProps) {
      var p = this.__proto__ 
      var results = [] 
      do {
        results.push(...Object.getOwnPropertyNames(p))
        p  = p.__proto__;
      } while( p );

      this.collapsedProps = results
    }

    return this.collapsedProps; 
  }

  filterProps (pattern) {
    return this.collectProps().filter(key => {
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
