import UIElement from '../../../colorpicker/UIElement';
import { parseParamNumber } from '../../../util/gl/filter/util';

export default class PredefinedPageResizer extends UIElement {


    initialize () {
        super.initialize()

        this.$board = this.parent.refs.$board;
        this.$page = this.parent.refs.$page; 
    }

    template () { 
        return `
            <div class="predefined-page-resizer">
                <button type="button" data-value="to right"></button>
                <!--<button type="button" data-value="to left"></button>-->
                <!--<button type="button" data-value="to top"></button>-->
                <button type="button" data-value="to bottom"></button>
                <!--<button type="button" data-value="to top right"></button>-->
                <button type="button" data-value="to bottom right"></button>
                <!--<button type="button" data-value="to bottom left"></button>-->
                <!--<button type="button" data-value="to top left"></button>-->
            </div>
        `
    }


    refresh () {
        var isShow = this.isShow();
        this.$el.toggle(isShow)

        if (isShow) {
            this.setPosition()
        }
    }


    setPosition () {
        var page = this.read('/item/current/page')

        if (!page) return; 

        var item = page; 
        var style = page.style; 

        var width = style.width
        var height = style.height


        var boardOffset = this.$board.offset()
        var pageOffset = this.$page.offset()

        var x = (pageOffset.left - boardOffset.left) + 'px'; 
        var y = (pageOffset.top - boardOffset.top) + 'px'; 

        this.$el.css({ 
            width, height, 
            left: x, top: y
        })

    }    

    isShow () { 
        return this.read('/item/is/mode', 'page')
    }

    '@changeEditor' () { this.refresh(); }

    change (style1 = {}, style2 = {}) {

        let style = Object.assign({}, style1, style2);

        Object.keys(style).forEach(key => {
            style[key] = style[key] + 'px' 
        })

        var page = this.read('/item/current/page')
        page.style = Object.assign(page.style, style)
        this.dispatch('/item/set', page)
        this.refresh();
    }

    changeX (dx) {
        var width = this.width + dx; 

        this.change({ width: width + 'px' });
    }

    changeY (dy) {
        var height = this.height + dy; 

        this.change({ height: height + 'px' });        
    }

    changeXY (dx, dy) {
        var width = this.width + dx; 
        var height = this.height + dy; 

        this.change({ width: width + 'px', height: height + 'px' });        
    }

    toTop () {
        var dy = this.xy.y - this.targetXY.y
        var height = this.height + dy; 

        return { height }
    }

    toBottom () {
        var dy = this.targetXY.y - this.xy.y
        var height = this.height + dy*2; 

        return { height }        
    }

    toRight () {
        var dx = this.targetXY.x - this.xy.x
        var width = this.width + dx*2; 

        return { width }
    }

    toLeft () {
        var dx = this.xy.x  - this.targetXY.x
        var width = this.width + dx; 

        return { width }
    }

    resize () {

        if (this.currentType == 'to top') {
            this.change(this.toTop())
        } else if (this.currentType == 'to bottom') {
            this.change(this.toBottom())
        } else if (this.currentType == 'to right') {
            this.change(this.toRight())
        } else if (this.currentType == 'to left') {
            this.change(this.toLeft())
        } else if (this.currentType == 'to bottom left') {
            this.change(this.toBottom(), this.toLeft())
        } else if (this.currentType == 'to bottom right') {
            this.change(this.toBottom(), this.toRight())
        } else if (this.currentType == 'to top right') {
            this.change(this.toTop(), this.toRight())
        } else if (this.currentType == 'to top left') {
            this.change(this.toTop(), this.toLeft())
        }
    }

    'pointerstart $el [data-value]' (e) {
        var type = e.$delegateTarget.attr('data-value');
        this.currentType = type; 
        this.xy = e.xy;
        this.page = this.read('/item/current/page')
        this.width = parseParamNumber(this.page.style.width)
        this.height = parseParamNumber(this.page.style.height)
    }

    'pointermove document' (e) {
        if (this.xy) {
            this.targetXY = e.xy; 

            this.resize();
        }

    }

    'pointerend document' (e) {
        this.currentType = null; 
        this.xy = null 
    }

    'resize.debounce(300) window' (e) {
        this.refresh();
    }
        
}