import UIElement from '../../../colorpicker/UIElement';

export default class MoveGuide extends UIElement {

    initialize () {
        super.initialize()

        this.$board = this.parent.refs.$board;
        this.$page = this.parent.refs.$page; 
    }

    template () { 
        return `
            <div class="move-guide">

            </div>
        `
    }

    'load $el' () {
        var list = this.read('/guide/line/layer');

        var bo = this.$board.offset()
        var po = this.$page.offset()

        var top = po.top - bo.top + this.$board.scrollTop();
        var left = po.left - bo.left + this.$board.scrollLeft(); 

        // console.log(top, left, bo, po);

        return list.map(axis => {
            if (axis.type == '-') {
                return `<div class='line' style='left: 0px; top: ${axis.y + top}px; right: 0px; height: 1px;'></div>`
            } else {
                return `<div class='line' style='left: ${axis.x + left}px; top: 0px; bottom: 0px; width: 1px;'></div>`
            }            
        })
    }

    refresh () {
        this.load()
    }

    '@changeEditor' () { this.refresh(); }

}