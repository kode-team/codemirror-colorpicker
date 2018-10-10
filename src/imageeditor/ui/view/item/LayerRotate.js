import UIElement from '../../../../colorpicker/UIElement';
import { caculateAngle } from '../../../../util/functions/math';

export default class LayerRotate extends UIElement {
    template () {
        return `<button type='button' data-value='layer rotate'></button>`
    }

    resize () {
        var angle = caculateAngle (this.targetXY.x - this.layerCenterX,  this.targetXY.y - this.layerCenterY);

        this.layer.style.rotate = Math.floor(angle) - 270; 

        this.dispatch('/item/set', this.layer);
    }


    'pointerstart' (e) {

        var layer = this.read('/item/current/layer')

        if (!layer) return; 

        this.xy = e.xy;
        this.layer = layer; 

        this.rect = this.read('/item/rect', layer.id);
        this.layerCenterX = this.rect.left + this.rect.width/2;
        this.layerCenterY = this.rect.top + this.rect.height/2;
    }

    'pointermove document' (e) {
        if (this.xy) {
            this.targetXY = e.xy; 

            this.resize();
        }

    }

    'pointerend document' (e) {
        this.xy = null 
        this.moveX = null;
        this.moveY = null; 
    }
}