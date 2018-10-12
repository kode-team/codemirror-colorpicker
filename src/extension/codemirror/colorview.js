import Color from '../../util/Color'
import ColorPicker from '../../colorpicker/index';

const colorpicker_class = 'codemirror-colorview'; 
const colorpicker_background_class = 'codemirror-colorview-background';
// Excluded tokens do not show color views..
let excluded_token = ['comment'];


function onChange(cm, evt) {
    if (evt.origin == 'setValue') {  // if content is changed by setValue method, it initialize markers
        cm.state.colorpicker.close_color_picker();
        cm.state.colorpicker.init_color_update();
        cm.state.colorpicker.style_color_update();
    } else {
        cm.state.colorpicker.style_color_update(cm.getCursor().line);
    }

}

function onUpdate(cm, evt) {
    if (!cm.state.colorpicker.isUpdate) {
        cm.state.colorpicker.isUpdate = true;
        cm.state.colorpicker.close_color_picker();
        cm.state.colorpicker.init_color_update();
        cm.state.colorpicker.style_color_update();
    }
}

function onRefresh(cm, evt) {
    onChange(cm, { origin : 'setValue'});
}

function onKeyup(cm, evt) {
    cm.state.colorpicker.keyup(evt);
}

function onMousedown(cm, evt) {
    if (cm.state.colorpicker.is_edit_mode())
    {
        cm.state.colorpicker.check_mousedown(evt);
    }
}

function onPaste (cm, evt) {
    onChange(cm, { origin : 'setValue'});
}

function onScroll (cm) {
    cm.state.colorpicker.close_color_picker();
}

function onBlur (cm) {
    cm.state.colorpicker.hide_delay_color_picker(cm.state.colorpicker.opt.hideDelay || 1000);
}

function debounce (callback, delay) {

    var t = undefined;

    return function (cm, e) {
        if (t) {
            clearTimeout(t);
        }

        t = setTimeout(function () {
            callback(cm, e);
        }, delay || 300);
    }
}

function has_class(el, cls) {
    if (!el || !el.className) {
        return false;
    } else {
        var newClass = ' ' + el.className + ' ';
        return newClass.indexOf(' ' + cls + ' ') > -1;
    }
}


export default class ColorView {
    constructor (cm, opt) {
        var self = this;

        if (typeof opt == 'boolean')
        {
            opt = { mode : 'edit' };
        } else {
            opt = Object.assign({ mode: 'edit' }, opt || {});
        }

        this.opt = opt;
        this.cm = cm;
        this.markers = {};
        
        // set excluded token 
        this.excluded_token = this.opt.excluded_token || excluded_token;

        if (this.opt.colorpicker) {
            this.colorpicker = this.opt.colorpicker(this.opt);
        } else {
            this.colorpicker = ColorPicker.create(this.opt);
        }

        this.init_event();

    }


    init_event() {

        this.cm.on('mousedown', onMousedown);
        this.cm.on('keyup', onKeyup);
        this.cm.on('change', onChange);
        this.cm.on('update', onUpdate);
        this.cm.on('refresh', onRefresh);
        this.cm.on('blur', onBlur); 

        // create paste callback
        this.onPasteCallback = (function (cm, callback) {
            return  function (evt) {
                callback.call(this, cm, evt);
            }
        })(this.cm, onPaste);

        this.onScrollEvent = debounce(onScroll, 50)

        this.cm.getWrapperElement().addEventListener('paste', this.onPasteCallback);

        if (this.is_edit_mode())
        {
            this.cm.on('scroll', this.onScrollEvent);
        }

    }

    is_edit_mode() {
        return this.opt.mode == 'edit';
    }

    is_view_mode() {
        return this.opt.mode == 'view';
    }

    destroy() {
        this.cm.off('mousedown', onMousedown);
        this.cm.off('keyup', onKeyup);
        this.cm.off('change', onChange)
        this.cm.off('blur', onBlur);

        this.cm.getWrapperElement().removeEventListener('paste', this.onPasteCallback);

        if (this.is_edit_mode())
        {
            this.cm.off('scroll', this.onScrollEvent);
        }
    }

    hasClass(el, className) {
        if (!el.className)
        {
            return false;
        } else {
            var newClass = ' ' + el.className + ' ';
            return newClass.indexOf(' ' + className + ' ') > -1;
        }
    }

    check_mousedown(evt) {
        if (this.hasClass(evt.target, colorpicker_background_class) )
        {
            this.open_color_picker(evt.target.parentNode);
        } else {
            this.close_color_picker();
        }
    }

    popup_color_picker(defalutColor) {
        var cursor = this.cm.getCursor();
        var self = this;
        var colorMarker = {
            lineNo : cursor.line,
            ch : cursor.ch,
            color: defalutColor || '#FFFFFF',
            isShortCut : true
        };

        Object.keys(this.markers).forEach(function(key) {
            var searchKey = "#" + key;
            if (searchKey.indexOf( "#" + colorMarker.lineNo + ":") > -1) {
                var marker = self.markers[key];

                if (marker.ch <= colorMarker.ch && colorMarker.ch <= marker.ch + marker.color.length) {
                    // when cursor has marker
                    colorMarker.ch = marker.ch;
                    colorMarker.color = marker.color;
                    colorMarker.nameColor = marker.nameColor;
                }

            }
        });

        this.open_color_picker(colorMarker);
    }

    open_color_picker(el) {
        var lineNo = el.lineNo;
        var ch = el.ch;
        var nameColor = el.nameColor;
        var color = el.color;


        if (this.colorpicker) {
            var self = this;
            var prevColor = color;
            var pos = this.cm.charCoords({line : lineNo, ch : ch });
            this.colorpicker.show({
                left : pos.left,
                top : pos.bottom,
                isShortCut : el.isShortCut || false,
                hideDelay : self.opt.hideDelay || 2000
            }, nameColor || color, function (newColor) {
                self.cm.replaceRange(newColor, { line : lineNo, ch : ch } , { line : lineNo, ch : ch + prevColor.length }, '*colorpicker');
                prevColor = newColor;
            });

        }

    }

    close_color_picker() {
        if (this.colorpicker)
        {
            this.colorpicker.hide();
        }
    }

    hide_delay_color_picker() {
        if (this.colorpicker)
        {
            this.colorpicker.runHideDelay();
        }
    }    

    key(lineNo, ch) {
        return [lineNo, ch].join(":");
    }


    keyup(evt) {

        if (this.colorpicker ) {
            if (evt.key == 'Escape') {
                this.colorpicker.hide();
            } else if (this.colorpicker.isShortCut == false) {
                this.colorpicker.hide();
            }
        }
    }

    init_color_update() {
        this.markers = {};  // initialize marker list
    }

    style_color_update(lineHandle) {
        if (lineHandle) {
            this.match(lineHandle);
        } else {
            var max = this.cm.lineCount();

            for(var lineNo = 0; lineNo < max; lineNo++) {
                this.match(lineNo);
            }
        }

    }

    empty_marker(lineNo, lineHandle) {
        var list = lineHandle.markedSpans || [];

        for(var i = 0, len = list.length; i < len; i++) {
            var key = this.key(lineNo, list[i].from);

            if (key && has_class(list[i].marker.replacedWith, colorpicker_class)) {
                delete this.markers[key];
                list[i].marker.clear();
            }

        }
    }


    
    match_result(lineHandle) {
        return Color.matches(lineHandle.text);
    }

    submatch(lineNo, lineHandle) {

        this.empty_marker(lineNo, lineHandle);
        
        const result = this.match_result(lineHandle); 
        let obj = { next : 0 };

        result.forEach(item => {
            this.render(obj, lineNo, lineHandle, item.color, item.nameColor);
        });
    }

    match(lineNo) {
        var lineHandle = this.cm.getLineHandle(lineNo);
        var self = this;  
        this.cm.operation(function () {
            self.submatch(lineNo, lineHandle);
        })
    }

    make_element() {
        var el = document.createElement('div');

        el.className = colorpicker_class;

        if (this.is_edit_mode())
        {
            el.title ="open color picker";
        } else {
            el.title ="";
        }

        el.back_element = this.make_background_element();
        el.appendChild(el.back_element);

        return el;
    }

    make_background_element() {
        var el = document.createElement('div');

        el.className = colorpicker_background_class;

        return el;
    }

    set_state(lineNo, start, color, nameColor) {
        var marker = this.create_marker(lineNo, start);


        marker.lineNo = lineNo;
        marker.ch = start;
        marker.color = color;
        marker.nameColor = nameColor;

        return marker;
    }

    create_marker(lineNo, start) {

        if (!this.has_marker(lineNo, start)) {
            this.init_marker(lineNo, start);
        }

        return this.get_marker(lineNo, start);

    }

    init_marker (lineNo, start) {
        this.markers[this.key(lineNo, start)] = this.make_element();
    }

    has_marker(lineNo, start) {
        return !!this.get_marker(lineNo, start);
    }

    get_marker(lineNo, start) {
        var key = this.key(lineNo,start);
        return this.markers[key]
    }

    update_element(el, color) {
        el.back_element.style.backgroundColor = color;
    }

    set_mark(line, ch, el) {
        this.cm.setBookmark({ line : line, ch : ch}, { widget : el, handleMouseEvents : true} );
    }

    is_excluded_token(line, ch) {
        var type = this.cm.getTokenTypeAt({line : line, ch : ch});
        var count = 0; 
        for(var i = 0, len = this.excluded_token.length; i < len; i++) {
            if (type === this.excluded_token[i]) {
                count++;
                break; 
            }
        }

        return count > 0;   // true is that it has a excluded token 
    }

    render(cursor, lineNo, lineHandle, color, nameColor) {
        var start = lineHandle.text.indexOf(color, cursor.next);

        if (this.is_excluded_token(lineNo, start) === true) {
            // excluded token do not show.
            return;
        }

        cursor.next = start + color.length;

        if (this.has_marker(lineNo, start))
        {
            this.update_element(this.create_marker(lineNo, start), nameColor || color);
            this.set_state(lineNo, start, color, nameColor);
            return;
        }

        var el  = this.create_marker(lineNo, start);

        this.update_element(el, nameColor || color);


        this.set_state(lineNo, start, color, nameColor || color);
        this.set_mark(lineNo, start, el);

    }
        

}

   
