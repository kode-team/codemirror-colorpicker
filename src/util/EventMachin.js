import Event from './Event'
import Dom from './Dom'
import State from './State'
import { debounce } from './functions/func';

const CHECK_EVENT_PATTERN = /^(click|mouse(down|up|move|over|out|enter|leave)|pointer(start|move|end)|touch(start|move|end)|key(down|up|press)|drag|dragstart|drop|dragover|dragenter|dragleave|dragexit|dragend|contextmenu|change|input|ttingttong|tt)/ig;
const CHECK_LOAD_PATTERN = /^load (.*)/ig;
const CHECK_FUNCTION_PATTERN = /^([^ \t]*)(\((.*)\))?$/ig;
const EVENT_SAPARATOR = ' '
const EVENT_NAME_SAPARATOR = ':'
const META_KEYS = ['Control', 'Shift', 'Alt', 'Meta'];
const PREDEFINED_EVENT_NAMES = {
  'pointerstart': 'mousedown:touchstart',
  'pointermove': 'mousemove:touchmove',
  'pointerend': 'mouseup:touchend',
  'ttingttong': 'click',
  'tt': 'click'
}

//  'mousedown.debounce(300)

export default class EventMachin {

  constructor() { 
    this.state = new State(this);
    this.refs = {} 
    this.children = {} 
    this.childComponents = this.components()
  }

  /**
   * 부모가 정의한 template 과  그 안에서 동작하는 자식 컴포넌트들을 다 합쳐서 
   * 최종 element 를 만들어준다. 
   * 
   * 그리고 자동으로 load 되어질게 있으면 로드 해준다. 
   */
  render ($container) {
    // 1. 나의 template 을 만들어내고  
    this.$el = this.parseTemplate(this.template())
    this.refs.$el = this.$el;   

    if ($container) $container.html(this.$el)

    // 데이타 로드 하고 
    this.load()    

    this.afterRender();
  }

  afterRender () {
    
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
  parseTemplate (html, isLoad) {

    if (Array.isArray(html)) {
      html = html.join('')
    }

    // 모든 element 는 root element 가 하나여야 한다. 
    const list = new Dom("div").html(html).children()
    
    var fragment = document.createDocumentFragment()

    list.forEach($el => {
      // ref element 정리 
      if ($el.attr('ref')) {
        this.refs[$el.attr('ref')] = $el; 
      }
      var refs = $el.$$('[ref]');

      [...refs].forEach($dom => {
        const name = $dom.attr('ref')
        this.refs[name] = $dom;
      })

      fragment.appendChild($el.el);

    })

    if (!isLoad) {
      return list[0];
    }

    return fragment
  }

  /**
   * target 으로 지정된 자식 컴포넌트를 대체해준다.
   * load 이후에 parseComponent 를 한번더 실행을 해야한다. 
   * load 이후에 새로운 Component 가 있으면 parseComponent 를 할 수가 없는데.... 
   * 이상한데 왜 로드가 안되어 있지? 
   */
  parseComponent () {
    const $el = this.$el; 
    Object.keys(this.childComponents).forEach(ComponentName => {

      const Component = this.childComponents[ComponentName]
      const targets = $el.$$(`${ComponentName.toLowerCase()}`);
      [...targets].forEach($dom => {
        let props = {};
        
        [...$dom.el.attributes].filter(t => {
          return ['ref'].indexOf(t.nodeName) < 0 
        }).forEach(t => {
          props[t.nodeName] = t.nodeValue 
        })
  
        const refName = $dom.attr('ref') || ComponentName
  
        if (refName) {
        
          if (Component) { 

            var instance = new Component(this, props);
            this.children[refName] = instance
            this.refs[refName] = instance.$el
      
            if (instance) {
              instance.render()
  
              $dom.replace(instance.$el)
            }
          }
  
        }
  
  
      })
    })
  }

  // load function이 정의된 객체는 load 를 실행해준다. 
  load () {
    this.filterProps(CHECK_LOAD_PATTERN).forEach(callbackName => {
      const elName = callbackName.split('load ')[1]
      if (this.refs[elName]) { 
        var fragment = this.parseTemplate(this[callbackName].call(this), true);
        this.refs[elName].html(fragment)
      }
    })

    this.parseComponent()
  }

  // 기본 템플릿 지정 
  template () {
    return '<div></div>';
  }

  initialize() {

  }

  eachChildren (callback) {
    Object.keys(this.children).forEach(ChildComponentName => {
      if (typeof callback == 'function') {
        callback(this.children[ChildComponentName])
      }
    })
  }

  /**
   * 이벤트를 초기화한다. 
   */
  initializeEvent () { 
    this.initializeEventMachin();

    // 자식 이벤트도 같이 초기화 한다. 
    // 그래서 이 메소드는 부모에서 한번만 불려도 된다. 
    this.eachChildren(Component => {
      Component.initializeEvent()
    })
  }

  /**
   * 자원을 해제한다. 
   * 이것도 역시 자식 컴포넌트까지 제어하기 때문에 가장 최상위 부모에서 한번만 호출되도 된다. 
   */
  destroy() {
    this.destroyEventMachin();
    // this.refs = {} 

    this.eachChildren(Component => {
      Component.destroy()
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

  getEventNames (eventName) {
    let results = [] 

    eventName.split(EVENT_NAME_SAPARATOR).forEach(e => {
      var arr = (PREDEFINED_EVENT_NAMES[e] || e).split(EVENT_NAME_SAPARATOR)

      results.push(...arr)
    })

    return results; 
  }

  parseEvent (key) {
    let arr = key.split(EVENT_SAPARATOR) ;

    var eventNames =  this.getEventNames(arr[0])

    var params = arr.slice(1)
    var callback = this[key].bind(this)
    
    eventNames.forEach(eventName => {
      var eventInfo = [eventName, ...params]
      this.bindingEvent(eventInfo, callback);
    })
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

  /* magic check method  */ 
  self (e) {  // e.target 이 delegate 대상인지 체크 
    return e.delegateTarget == e.target; 
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

    // const delay = arr.filter(code => {
    //   return (+code) + '' == code
    // })

    // const debounce = delay.length ? +delay[0] : 0;   // 0 은 debounce 하지 않음 . 
    const debounceTime = 0;
    
    arr = arr.filter(code => {
      return checkMethodList.includes(code) === false 
            // && delay.includes(code) === false; 
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
      debounce: debounceTime,
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
    var onlyControl = eventObject.isControl ? e.ctrlKey : true;
    var onlyShift = eventObject.isShift ? e.shiftKey : true; 
    var onlyAlt = eventObject.isAlt ? e.altKey : true; 
    var onlyMeta = eventObject.isMeta ? e.metaKey : true; 

    // 특정 keycode 를 가지고 있는지 체크 
    // keyup.pagedown  이라고 정의하면 pagedown 키를 눌렀을때만 동작 함 
    var hasKeyCode = true; 
    if (eventObject.codes.length) {
      hasKeyCode = eventObject.codes.includes(e.code.toLowerCase()) || eventObject.codes.includes(e.key.toLowerCase());
    }

    // 체크 메소드들은 모든 메소드를 다 적용해야한다. 
    var isAllCheck = true;  
    if (eventObject.checkMethodList.length) {  
      isAllCheck = eventObject.checkMethodList.every(method => {
        return this[method].call(this, e);
      });
    }

    return (onlyControl && onlyAlt && onlyShift && onlyMeta && hasKeyCode && isAllCheck);
  }

  makeCallback ( eventObject, callback) {

    if (eventObject.debounce) {
      callback = debounce(callback, eventObject.debounce)
    }

    if (eventObject.delegate) {
      return (e) => {
        const delegateTarget = this.matchPath(e.target || e.srcElement, eventObject.delegate);

        if (delegateTarget) { // delegate target 이 있는 경우만 callback 실행 
          e.delegateTarget = delegateTarget;
          e.$delegateTarget = new Dom(delegateTarget);
          e.xy = Event.posXY(e)

          if (this.checkEventType(e, eventObject)) {
            return callback(e);
          } 

        } 

      }
    }  else {
      return (e) => {
        e.xy = Event.posXY(e)        
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
