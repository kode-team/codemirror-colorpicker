import { parseParamNumber } from '../../../util/filter/functions';
import shapeEditor from './shape-editor/index';
import UIElement from '../../../colorpicker/UIElement';


export default class LayerShapeEditor extends UIElement {


    initialize () {
        super.initialize()

        this.$board = this.parent.refs.$board;
        this.$page = this.parent.refs.$page; 
    }

    components () {
        return shapeEditor;
    }

    template () { 
        return `
            <div class="layer-shape-editor">
                <CircleEditor></CircleEditor>
                <RectEditor></RectEditor>
                <PolygonEditor></PolygonEditor>
                <PathEditor></PathEditor>
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
        var layer = this.read('/item/current/layer')

        if (!layer) return; 

        var style = layer.style; 

        var width = style.width
        var height = style.height
        var x  = style.x
        var y  = style.y

        var boardOffset = this.$board.offset()
        var pageOffset = this.$page.offset()

        x = parseParamNumber(x, x => x + pageOffset.left - boardOffset.left) + 'px'; 
        y = parseParamNumber(y, y => y + pageOffset.top - boardOffset.top) + 'px'; 

        this.$el.css({ 
            width, height, 
            left: x, top: y, 
            transform: this.read('/layer/make/transform', layer)
        })
    }

    isShow () {
        return !this.read('/item/is/mode', 'page');
    }

    '@changeEditor' () { this.refresh(); }

}