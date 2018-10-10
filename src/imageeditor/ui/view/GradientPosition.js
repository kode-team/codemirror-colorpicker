import UIElement from '../../../colorpicker/UIElement';

const DEFINE_POSITIONS = { 
    'center': ['center', 'center'],
    'right': ['right', 'center'],
    'top': ['center', 'top'],
    'left': ['left', 'center'],
    'bottom': ['center', 'bottom']
}

export default class GradientPosition extends UIElement {

    template () {
        return `
            <div class="drag-position">
                <div ref="$dragPointer" class="drag-pointer"></div>
            </div>
        `
    }

    refresh () {

        if (this.isShow()) {
            this.$el.show();
            this.refreshUI()            
        } else {
            this.$el.hide();
        }
    }

    isShow () {
        if (!this.read('/item/is/mode', 'image')) return false; 

        var item = this.read('/item/current/image')
        if (!item) return false; 

        if (!this.read('/image/type/isRadial', item.type)) {
            return false; 
        }

        return this.read('/tool/get', 'guide.angle')
    }

    getCurrentXY(e, position) {

        if (e) {
            var xy = e.xy;

            return [xy.x, xy.y]
        }

        var { minX, minY, maxX, maxY, width, height } = this.getRectangle()

        let p = position; 
        if (typeof p == 'string' && DEFINE_POSITIONS[p]) {
            p = DEFINE_POSITIONS[p]
        } else if (typeof p === 'string') {
            p = p.split(' ');
        }

        p = p.map((item, index) => {
            if (item == 'center') {
                if (index == 0) {
                    return minX + width/2
                } else if (index == 1) {
                    return minY + height/2
                }
            } else if (item === 'left') {
                return minX;
            } else if (item === 'right') {
                return maxX;
            } else if (item === 'top') {
                return minY;
            } else if (item === 'bottom') { 
                return maxY;
            } else {
                if (index == 0) {
                    return minX * width * (+item/100); 
                } else if (index == 1) {
                    return minY * height * (+item/100); 
                }
            }
        })
        
        return p; 
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

    getDefaultValue() {
        return this.read('/image/get', 'radialPosition') || ''

    }

    refreshUI (e) {
        var { minX, minY, maxX, maxY, width, height } = this.getRectangle()
        var [x , y] = this.getCurrentXY(e, this.getDefaultValue())

        x = Math.max(Math.min(maxX, x), minX)
        y = Math.max(Math.min(maxY, y), minY)

        var left = x - minX
        var top = y - minY 

        this.refs.$dragPointer.px('left', left);
        this.refs.$dragPointer.px('top', top);

        if (e) {
            this.dispatch('/image/setRadialPosition', [Math.floor(left/width * 100) + '%', Math.floor(top/height * 100) + '%']);
        }

    }

    '@changeEditor' () {
        this.refresh()
    }

    '@changeTool' () {
        this.$el.toggle(this.isShow())
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

    'pointerstart $dragPointer' (e) {
        e.preventDefault();
        this.isDown = true; 
    }

    'pointerstart $el' (e) {
        this.isDown = true; 
        this.refreshUI(e);        
    }    
    
    'dblclick $dragPointer' (e) {
        e.preventDefault()
        this.dispatch('/image/setRadialPosition', 'center');        
        this.refreshUI();
    }

}