import UIElement from '../../../colorpicker/UIElement';

export default class PredefinedPageResizer extends UIElement {

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
        this.$el.toggle(this.isShow())
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
        var height = this.height + dy; 

        return { height }        
    }

    toRight () {
        var dx = this.targetXY.x - this.xy.x
        var width = this.width + dx; 

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
        this.width = +this.page.style.width.replace('px', '') 
        this.height = +this.page.style.height.replace('px', '') 
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
}