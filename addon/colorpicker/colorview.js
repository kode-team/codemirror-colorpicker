(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"), require("./foldcode"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror", "./foldcode"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    var colorpicker_class = 'codemirror-colorview';

    CodeMirror.defineOption("colorpicker", false, function (cm, val, old) {
        if (old && old != CodeMirror.Init) {

            if (cm.state.colorpicker)
            {
                cm.state.colorpicker.destroy();
                cm.state.colorpicker = null;

            }
            // remove event listener
        }

        if (val)
        {
            cm.state.colorpicker = new codemirror_colorpicker(cm, val);
        }
    });

    function onChange(cm) {
        cm.state.colorpicker.style_color_update(cm.getCursor().line);
    }

    function onKeyup(cm) {
        cm.state.colorpicker.keyup();
    }

    function onMousedown(cm, evt) {
        if (cm.state.colorpicker.is_edit_mode())
        {
            cm.state.colorpicker.check_mousedown(evt);
        }
    }

    function onPaste () {
        // TODO: cm  객체를 어디서 얻어오나?
        //self.style_color_update();
    }

    function onScroll (cm) {
        cm.state.colorpicker.close_color_picker();
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

    function codemirror_colorpicker (cm, opt) {
        var self = this;

        if (typeof opt == 'boolean')
        {
            opt = { mode : 'view' };
        } else {
            opt = Object.assign({ mode: 'view' }, opt || {});
        }

        this.opt = opt;
        this.cm = cm;
        this.markers = {};

        this.cm.on('mousedown', onMousedown);
        this.cm.on('keyup', onKeyup);
        this.cm.on('change', onChange)

        if (this.is_edit_mode())
        {
            this.cm.on('scroll', debounce(onScroll, 50));
        }

        this.cm.getWrapperElement().addEventListener('paste', onPaste);

        if (this.cm.colorpicker) {
            this.colorpicker = this.cm.colorpicker();
        } else if (this.opt.colorpicker) {
            this.colorpicker = this.opt.colorpicker;
        }

    }

    codemirror_colorpicker.prototype.is_edit_mode = function () {
        return this.opt.mode == 'edit';
    }

    codemirror_colorpicker.prototype.is_view_mode = function () {
        return this.opt.mode == 'view';
    }

    codemirror_colorpicker.prototype.destroy = function () {
        this.cm.off('mousedown', onMousedown);
        this.cm.off('change', onChange)
        this.cm.getWrapperElement().removeEventListener('paste', onPaste);
    }

    codemirror_colorpicker.prototype.hasClass = function (el, className) {
        if (!el.className)
        {
            return false;
        } else {
            var newClass = ' ' + el.className + ' ';
            return newClass.indexOf(' ' + className + ' ') > -1;
        }
    }

    codemirror_colorpicker.prototype.check_mousedown = function (evt) {
        if (this.hasClass(evt.target, colorpicker_class))
        {
            this.open_color_picker(evt.target);
        } else {
            this.close_color_picker();
        }
    }

    codemirror_colorpicker.prototype.open_color_picker = function (el) {
        var lineNo = el.lineNo;
        var ch = el.ch;
        var color = el.color;


        if (this.colorpicker) {
            var self = this;
            var firstColor, prevColor;
            firstColor = prevColor = color;
            var pos = this.cm.charCoords({line : lineNo, ch : ch });
            this.colorpicker.show({ left : pos.left, top : pos.bottom }, color, function (newColor) {
                self.cm.replaceRange(newColor, { line : lineNo, ch : ch } , { line : lineNo, ch : ch + prevColor.length }, '*' + firstColor);
                prevColor = newColor;
            });

        }

    }

    codemirror_colorpicker.prototype.close_color_picker = function (el) {
        if (this.colorpicker)
        {
            this.colorpicker.hide();
        }
    }

    codemirror_colorpicker.prototype.key = function (lineNo, ch) {
        return [lineNo, ch].join(":");
    }


    codemirror_colorpicker.prototype.keyup = function () {

        if (this.colorpicker) {
            this.colorpicker.hide();
        }
    }

    codemirror_colorpicker.prototype.style_color_update = function (lineHandle) {

        if (lineHandle) {
            this.match(lineHandle);
        } else {
            var max = this.cm.lineCount();

            for(var lineNo = 0; lineNo < max; lineNo++) {
                this.match(lineNo);
            }
        }

    }

    codemirror_colorpicker.prototype.empty_marker = function (lineNo, lineHandle) {
        var list = lineHandle.markedSpans || [];

        for(var i = 0, len = list.length; i < len; i++) {
            var key = this.key(lineNo, list[i].from);
            delete this.markers[key];
            list[i].marker.clear();
        }
    }

    codemirror_colorpicker.prototype.color_regexp = /(#(?:[\da-f]{3}){1,2}|rgb\((?:\d{1,3},\s*){2}\d{1,3}\)|rgba\((?:\d{1,3},\s*){3}\d*\.?\d+\)|hsl\(\d{1,3}(?:,\s*\d{1,3}%){2}\)|hsla\(\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\))/gi;

    codemirror_colorpicker.prototype.match_result = function (lineHandle) {
        return lineHandle.text.match(this.color_regexp);
    }

    codemirror_colorpicker.prototype.match = function (lineNo) {
        var lineHandle = this.cm.getLineHandle(lineNo);

        this.empty_marker(lineNo, lineHandle);

        var result = this.match_result(lineHandle);

        if (result)
        {
            var obj = { next : 0 };
            for(var i = 0, len = result.length; i < len; i++) {
                this.render(obj, lineNo, lineHandle, result[i]);
            }
        }
    }

    codemirror_colorpicker.prototype.make_element = function () {
        var el = document.createElement('div');

        el.className = colorpicker_class;

        if (this.is_edit_mode())
        {
            el.title ="open color picker";
        } else {
            el.title ="";
        }


        return el;
    }

    codemirror_colorpicker.prototype.set_state = function (lineNo, start, color) {
        var marker = this.create_marker(lineNo, start);


        marker.lineNo = lineNo;
        marker.ch = start;
        marker.color = color;

        return marker;
    }

    codemirror_colorpicker.prototype.create_marker = function (lineNo, start) {

        var key = this.key(lineNo,start);

        if (!this.markers[key]) {
            this.markers[key] = this.make_element();
        }


        return this.markers[key];

    }

    codemirror_colorpicker.prototype.has_marker = function (lineNo, start) {
        var key = this.key(lineNo,start);
        return !!(this.markers[key])
    }

    codemirror_colorpicker.prototype.update_element = function (el, color) {
        el.style.background = color;
    }

    codemirror_colorpicker.prototype.set_mark = function (line, ch, el) {
        this.cm.setBookmark({ line : line, ch : ch}, { widget : el, handleMouseEvents : true} );

    }

    codemirror_colorpicker.prototype.render = function (cursor, lineNo, lineHandle, color) {

        var start = lineHandle.text.indexOf(color, cursor.next);

        cursor.next = start + color.length;

        if (this.has_marker(lineNo, start))
        {
            this.update_element(this.create_marker(lineNo, start), color);
            this.set_state(lineNo, start, color);
            return;
        }

        var el  = this.create_marker(lineNo, start);

        this.update_element(el, color);
        this.set_state(lineNo, start, color);
        this.set_mark(lineNo, start, el);
    }
});
