import ColorUtil from './Color'

const color = ColorUtil.color; 

let counter = 0;
let cached = [];

export default class Dom {

    constructor (tag, className, attr) {
    
        if (typeof tag != 'string') {
            this.el = tag;
        } else {
    
            var el  = document.createElement(tag);
            this.uniqId = counter++;

            if (className) {
                el.className = className;
            }

            attr = attr || {};
    
            for(var k in attr) {
                el.setAttribute(k, attr[k]);
            }
    
            this.el = el;
        }
    }

    static getScrollTop () {
        return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
    }

    static getScrollLeft () {
        return Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft)
    }

    attr (key, value) {
        if (arguments.length == 1) {
            return this.el.getAttribute(key);
        }

        this.el.setAttribute(key, value);

        return this; 
    }

    closest (cls) {
        
        var temp = this;
        var checkCls = false;
    
        while(!(checkCls = temp.hasClass(cls))) {
            if (temp.el.parentNode) {
                temp = new Dom(temp.el.parentNode);
            } else {
                return null;
            }
        }
    
        if (checkCls) {
            return temp;
        }
    
        return null;
    }
    
    removeClass (cls) {
        this.el.className = ((` ${this.el.className} `).replace(` ${cls} `, ' ')).trim();

        return this; 
    }
    
    hasClass (cls) {
        if (!this.el.className)
        {
            return false;
        } else {
            var newClass = ` ${this.el.className} `;
            return newClass.indexOf(` ${cls} `) > -1;
        }
    }
    
    addClass (cls) {
        if (!this.hasClass(cls)) {
            this.el.className = `${this.el.className} ${cls}`;
        }

        return this; 
    
    }

    toggleClass (cls) {
        if (this.hasClass(cls)) {
            this.removeClass(cls);
        } else {
            this.addClass(cls);
        }
    }
    
    html (html) {

        if (typeof html == 'string') {
            this.el.innerHTML = html;
        } else {
            this.empty().append(html);
        }

        return this;
    }

    find (selector) {
        return this.el.querySelector(selector)
    } 

    findAll (selector) { 
        return this.el.querySelectorAll(selector)
    } 

    
    empty () {
        return this.html('');
    }
    
    append (el) {
    
        if (typeof el == 'string') {
            this.el.appendChild(document.createTextNode(el));
        } else {
            this.el.appendChild(el.el || el);
        }
    
        return this;
    }
    
    appendTo (target) {
        var t = target.el ? target.el : target;
    
        t.appendChild(this.el);
    
        return this;
    }
    
    remove () {
        if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    
        return this;
    }
    
    text () {
        return this.el.textContent;
    }
    
    css (key, value) {
        if (arguments.length == 2) {
            this.el.style[key] = value;
        } else if (arguments.length == 1) {
    
            if (typeof key == 'string') {
                return getComputedStyle(this.el)[key];
            } else {
                var keys = key || {};
                Object.keys(keys).forEach(k => {
                    this.el.style[k] = keys[k];    
                })
            } 
    
        }
    
        return this;
    }

    cssFloat (key) {
        return parseFloat(this.css(key));
    }

    cssInt (key) {
        return parseInt(this.css(key));
    }
    
    offset () {
        var rect = this.el.getBoundingClientRect();

        return {
            top: rect.top + Dom.getScrollTop(),
            left: rect.left + Dom.getScrollLeft()
        };
    }
    
    position () {

        if (this.el.style.top) {
            return {
                top: parseFloat(this.css('top')),
                left: parseFloat(this.css('left'))
            };
        } else {
            return this.el.getBoundingClientRect();
        }

    }

    size () {
        return [this.width(), this.height()]
    }
    
    width () {
        return this.el.offsetWidth || this.el.getBoundingClientRect().width;
    }

    contentWidth() {
        return this.width() - this.cssFloat('padding-left') - this.cssFloat('padding-right');
    }
    
    height () {
        return this.el.offsetHeight || this.el.getBoundingClientRect().height;
    }


    contentHeight() {
        return this.height() - this.cssFloat('padding-top') - this.cssFloat('padding-bottom');
    }
    
    dataKey (key) {
        return this.uniqId + '.' + key;
    }
    
    data (key, value) {
        if (arguments.length == 2) {
            cached[this.dataKey(key)] = value;
        } else if (arguments.length == 1) {
            return cached[this.dataKey(key)];
        } else {
            var keys = Object.keys(cached);
    
            var uniqId = this.uniqId + ".";
            return keys.filter(function (key) {
                if (key.indexOf(uniqId) == 0) {
                    return true;
                }
    
                return false;
            }).map(function (value) {
                return cached[value];
            })
        }
    
        return this;
    }
    
    val (value) {
        if (arguments.length == 0) {
            return this.el.value;
        } else if (arguments.length == 1) {
            this.el.value = value;
        }
    
        return this;
    }
    
    int () {
        return parseInt(this.val(), 10);
    }

    float () {
        return parseFloat(this.val());
    }
    
    show () {
        return this.css('display', 'block');
    }
    
    hide () {
        return this.css('display', 'none');
    }

    toggle () {
        if (this.css('display') == 'none') {
            return this.show();
        } else {
            return this.hide();
        }
    }

    scrollTop () {
        if (this.el === document.body) {
            return Dom.getScrollTop()
        }

        return this.el.scrollTop
    } 

    scrollLeft () {
        if (this.el === document.body) {
            return Dom.getScrollLeft()
        }

        return this.el.scrollLeft
    }

    on (eventName, callback, opt1, opt2) {
        this.el.addEventListener(eventName, callback, opt1, opt2);

        return this; 
    }

    off (eventName, callback ) {
        this.el.removeEventListener(eventName, callback);

        return this; 
    }

    getElement ( ) {
        return this.el;
    }

    createChild (tag, className = '', attrs = {}, css = {}) {
        let $element = new Dom(tag, className, attrs);
        $element.css(css);

        this.append($element);

        return $element;
    }

    firstChild () {
        return new Dom(this.el.firstElementChild);
    }

    replace (oldElement, newElement) {
        this.el.replaceChild(newElement, oldElement);

        return this; 
    }
}

