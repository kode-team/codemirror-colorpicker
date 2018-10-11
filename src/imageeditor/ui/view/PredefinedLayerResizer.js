import UIElement from '../../../colorpicker/UIElement';
import TopLeftRadius from './item/TopLeftRadius';
import TopRightRadius from './item/TopRightRadius';
import BottomLeftRadius from './item/BottomLeftRadius';
import BottomRightRadius from './item/BottomRightRadius';
import LayerRotate from './item/LayerRotate';

export default class PredefinedLayerResizer extends UIElement {

    components () {
        return { TopLeftRadius, TopRightRadius, BottomLeftRadius, BottomRightRadius, LayerRotate }
    }

    template () { 
        return `
            <div class="predefined-layer-resizer">
                <div class='button-group' ref='$buttonGroup'>
                    <button type="button" data-value="to right"></button>
                    <button type="button" data-value="to left"></button>
                    <button type="button" data-value="to top"></button>
                    <button type="button" data-value="to bottom"></button>
                    <button type="button" data-value="to top right"></button>
                    <button type="button" data-value="to bottom right"></button>
                    <button type="button" data-value="to bottom left"></button>
                    <button type="button" data-value="to top left"></button>
                </div>

                <TopLeftRadius></TopLeftRadius>
                <TopRightRadius></TopRightRadius>
                <BottomLeftRadius></BottomLeftRadius>
                <BottomRightRadius></BottomRightRadius>

                <LayerRotate></LayerRotate>

                <div class="guide-horizontal"></div>
                <div class="guide-vertical"></div>
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


        this.$el.css({ 
            width, height, 
            left: x, top: y, 
            transform: this.read('/layer/make/transform', layer)
        })

        var rotate = layer.style.rotate || 0

        if (rotate == 0) {
            this.refs.$buttonGroup.show()
        } else {
            this.refs.$buttonGroup.hide()
        }
    }

    isShow () {
        return this.read('/item/is/mode', 'layer');
    }

    '@changeEditor' () { this.refresh(); }

    change (style1 = {}, style2 = {}) { 

        let style = Object.assign({}, style1, style2);

        Object.keys(style).forEach(key => {
            style[key] = style[key] + 'px' 
        })

        var item = this.read('/item/current/layer')

        item.style = Object.assign(item.style, style);

        this.dispatch('/item/set', item);
        this.setPosition();
    }


    toRight () {
        var dx = this.targetXY.x - this.xy.x;

        if (dx < 0 && Math.abs(dx) > this.width) {
            var width = Math.abs(dx) - this.width; 
            var x = this.moveX  - width;  
            return { x, width} 
        } else {
            var width = this.width + dx;   
            return { width}
        }
    }

    toLeft () {
        // top + height 
        var dx = this.xy.x - this.targetXY.x;
        var x = this.moveX - dx 
        var width = this.width + dx; 

        if (dx < 0 && Math.abs(dx) > this.width) {
            var width = Math.abs(dx) - this.width; 
            var x = this.moveX  + this.width;  
            return { x, width} 
        } else {
            var x = this.moveX - dx 
            var width = this.width + dx; 
            return { x, width }
        }
    }    

    toBottom () {
        var dy = this.targetXY.y - this.xy.y;

        if (dy < 0 && Math.abs(dy) > this.height) {
            var height = Math.abs(dy) - this.height; 
            var y = this.moveY  - height;  
            return { y, height} 
        } else {
            var height = this.height + dy;   
            return { height}
        }
    }    

    toTop () {
        var dy = this.xy.y - this.targetXY.y;
        
        if (dy < 0 && Math.abs(dy) > this.height) {
            var height = Math.abs(dy) - this.height; 
            var y = this.moveY  + this.height;  

            return { y, height} 
        } else {
            var y = this.moveY - dy 
            var height = this.height + dy; 

            return { y, height }
        }  
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

        var layer = this.read('/item/current/layer')

        if (!layer) return; 

        var type = e.$delegateTarget.attr('data-value');
        this.currentType = type; 
        this.xy = e.xy;
        this.layer = layer
        this.width = +this.layer.style.width.replace('px', '') 
        this.height = +this.layer.style.height.replace('px', '') 
        this.moveX = +(this.layer.style.x || 0).replace('px', '')
        this.moveY = +(this.layer.style.y || 0).replace('px', '')
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
        this.moveX = null;
        this.moveY = null; 
    }
}