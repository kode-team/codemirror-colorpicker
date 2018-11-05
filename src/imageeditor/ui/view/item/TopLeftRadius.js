import UIElement from '../../../../colorpicker/UIElement';

export default class TopLeftRadius extends UIElement {

    initialize () {
        super.initialize()

        this.radiusKey = 'border-top-left-radius'
    }

    template () {
        return `<button type='button' data-value='radius top left'></button>`
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

        var width = layer.style.width
        var height = layer.style.height
        var x  = layer.style.x
        var y  = layer.style.y        

        this.setRadiusPosition(x, y, width, height, layer);

    }

    setRadiusPosition (x, y, width, height, layer) {

        var radius = layer.style[this.radiusKey] || '0px'
        this.$el.css('left', radius)
    }

    isShow () {
        var layer = this.read('/item/current/layer')
        if (!layer) return false; 

        if (layer.fixedRadius) return false;         
        return this.read('/item/is/mode', 'layer', 'image');
    }

    getRealRadius (radius, dx) {
        var minX = 0;
        var maxX = this.layerWidth; 

        return Math.max(Math.min(maxX, radius + dx), minX)
    }

    resize () {
        
        var dx = this.targetXY.x - this.xy.x

//        console.log(dx);

        var radius = this.getRealRadius(this.layerRadius, dx);
        this.layer.style[this.radiusKey] = radius + 'px'

        this.dispatch('/item/set', this.layer);
        this.refresh();
    }

    '@changeEditor' () { this.refresh(); }


    'pointerstart' (e) {

        var layer = this.read('/item/current/layer')

        if (!layer) return; 

        this.xy = e.xy;
        this.layer = layer; 

        this.layerRadius = +(layer.style[this.radiusKey] || '0px').replace('px', '')
        
        this.layerWidth = +this.layer.style.width.replace('px', '') 
        this.layerHeight = +this.layer.style.height.replace('px', '') 

        this.emit('startRadius')                    
    }

    'pointermove document' (e) {
        if (this.xy) {
            this.targetXY = e.xy; 

            this.resize();
            this.emit('changeRadius')            
        }

    }

    'pointerend document' (e) {
        this.xy = null 
        this.moveX = null;
        this.moveY = null; 

        this.emit('endRadius')
    }
}