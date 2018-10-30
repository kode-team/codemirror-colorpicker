import UIElement from "../../../../colorpicker/UIElement";
import { parseParamNumber } from "../../../../util/filter/functions";


export default class CircleEditor extends UIElement {

    template () {
        return `
            <div class='layer-shape-circle-editor'>
                <div class="drag-item center" data-type="center" ref="$center"></div>
                <div class="drag-item radius" data-type="radius" ref="$radius"></div>
            </div>
        `
    }

    refresh () {
        var isShow = this.isShow();

        this.$el.toggle(isShow);

        if (isShow) {
            this.refreshPointer()
        }

    }

    refreshPointer () {
        this.read('/item/current/layer', (layer) => {

            if (!layer.clipPathType) return;
            if (!layer.clipPathCenter) return;
            if (!layer.clipPathRadius) return;

            var [x, y] = layer.clipPathCenter
            this.refs.$center.px('left', x);
            this.refs.$center.px('top', y);

            var [x, y] = layer.clipPathRadius
            this.refs.$radius.px('left', x);
            this.refs.$radius.px('top', y);            
        })
    }

    isShow () {
        var item = this.read('/item/current/layer')

        if (!item) return false; 

        return item.clipPathType == 'circle'; 
    }

    getRectangle () {
        var width = this.$el.width();  
        var height = this.$el.height();  
        var minX = this.$el.offsetLeft();
        var minY = this.$el.offsetTop();

        var maxX = minX + width; 
        var maxY = minY + height;

        return { minX, minY, maxX, maxY, width, height }
    }    

    refreshUI (e) {
        var { minX, minY, maxX, maxY, width, height } = this.getRectangle()
        var {x , y} = e.xy;

        x = Math.max(Math.min(maxX, x), minX)
        y = Math.max(Math.min(maxY, y), minY)

        var left = x - minX
        var top = y - minY  

        this.refs['$' + this.currentType].px('left', left);
        this.refs['$' + this.currentType].px('top', top);

        if (e) {
            
            this[this.currentType + "pos"] = [left, top]

            this.updateClipPath();
        }

    }

    updateClipPath () {
        var radius = this.radiuspos || [0, 0];
        var center = this.centerpos || [0, 0];

        var item = this.layer;
        item.clipPathType = 'circle'
        item.clipPathCenter = center;
        item.clipPathRadius = radius;

        this.dispatch('/item/set', item);

    }

    '@changeEditor' () {
        this.refresh()
    }

    // Event Bindings 
    'pointerend document' (e) {
        this.isDown = false ;
    }

    'pointermove document' (e) {
        if (this.isDown) {
            this.refreshUI(e);
        }
    }

    'pointerstart $el .drag-item' (e) {
        e.preventDefault();
        this.currentType = e.$delegateTarget.attr('data-type');
        this.isDown = true; 
    }

    'pointerstart $el' (e) {
        this.isDown = true; 
        this.layer = this.read('/item/current/layer');
        // this.refreshUI(e);        
    }    
    
}