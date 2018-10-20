import GradientAngle from '../../view/GradientAngle'
import GradientPosition from '../../view/GradientPosition' 
import PredefinedLinearGradientAngle from '../../view/PredefinedLinearGradientAngle'
import PredefinedRadialGradientPosition from '../../view/PredefinedRadialGradientPosition'
import BaseTab from '../../BaseTab';
import PredefinedPageResizer from '../../view/PredefinedPageResizer';
import PredefinedLayerResizer from '../../view/PredefinedLayerResizer';

import { 
    EDITOR_MODE_IMAGE_IMAGE, 
    EDITOR_MODE_IMAGE_LINEAR, 
    EDITOR_MODE_IMAGE_RADIAL, 
    EDITOR_MODE_IMAGE_STATIC 
} from '../../../module/ItemManager';
import MoveGuide from '../../view/MoveGuide';
import SubFeatureControl from '../SubFeatureControl';
   

export default class GradientView extends BaseTab {

    template () {
        return `
            <div class='page-view'>
                <div class='page-content' ref="$board">
                    <div class="page-canvas">
                        <div class="gradient-color-view-container" ref="$page">
                            <div class="gradient-color-view" ref="$colorview"></div>            

                        </div>       
                        <PredefinedPageResizer></PredefinedPageResizer>
                        <PredefinedLayerResizer></PredefinedLayerResizer>                        
                        <MoveGuide></MoveGuide>                          
                    </div>          
                </div>
 
                <SubFeatureControl></SubFeatureControl>
            </div>
        `
    } 

    components () {
        return {  
            SubFeatureControl,
            MoveGuide,
            GradientAngle, 
            GradientPosition, 
            PredefinedLinearGradientAngle, 
            PredefinedRadialGradientPosition, 
            PredefinedPageResizer,
            PredefinedLayerResizer
        }
    }

    'load $colorview' () {
        var page = this.read('/item/current/page')

        if (!page) {
            return ''; 
        }

        var editMode = this.read('/item/get/editMode');

        return this.read('/item/map/children', page.id, (item) => {

            switch (editMode) {
            case EDITOR_MODE_IMAGE_IMAGE:
            case EDITOR_MODE_IMAGE_LINEAR:
            case EDITOR_MODE_IMAGE_RADIAL:
            case EDITOR_MODE_IMAGE_STATIC:

                var image = this.read('/item/current/image')

                if (image.parentId == item.id) {
                    return `<div class='layer' item-id="${item.id}" style='${this.read('/layer/toString', item, true, image)}'></div>`
                }
            }

            return `<div class='layer' item-id="${item.id}" style='${this.read('/layer/toString', item, true)}'></div>`
        });
    }

    refresh (isDrag) {
        this.setBackgroundColor();
        this.load();

        if (!isDrag) {
            // this.refs.$page.el.scrollIntoView()
        }
    }

    makePageCSS (page) {
        return Object.assign({
            overflow: page.clip ? 'hidden' : ''
        }, page.style || {}); 
    }
 
    setBackgroundColor() {

        var page = this.read('/item/current/page');
        this.refs.$page.css(this.makePageCSS(page))

        var item = this.read('/item/current/page')

        this.refs.$page.toggle(item)


        if (item) {
            if (item.itemType == 'page') {
                var list = this.read('/item/list/children', item.id);
                this.refs.$colorview.toggle(list.length)
            }
        }
        

    }

    '@changeEditor' () {
        this.refresh();
    }

    '@changeTool' () {
        this.refresh()
    }

    checkPage (e) {
        return e.target == this.refs.$colorview.el;
    }

    'click.self $page .layer' (e) {
        var id = e.$delegateTarget.attr('item-id')
        if (id) {
            this.run('/item/select/mode', 'layer')
            this.dispatch('/item/select', id);
        }
    }

    selectPageMode () {
        this.dispatch('/item/select/mode', 'page')    
    }


    'click $page' (e) {
        if (!e.$delegateTarget) {
            this.selectPageMode()
        } else if (!e.$delegateTarget.hasClass('layer')) {
            this.selectPageMode()
        }

    }    

    'click.self $el .page-canvas' (e) {
        this.selectPageMode()
    }


    'click $colorview' (e) {

        this.read('/item/current/layer', layer => {
            this.dispatch('/item/select', layer.id);
            this.refresh();
        })
    }    

    'pointerstart $page .layer' (e) {
        this.isDown = true; 
        this.xy = e.xy;
        this.$layer = e.$delegateTarget;
        this.layer = this.read('/item/get', e.$delegateTarget.attr('item-id'))
        this.moveX = +(this.layer.style.x || 0).replace('px', '')
        this.moveY = +(this.layer.style.y || 0).replace('px', '')

        this.dispatch('/item/select', this.layer.id)
    }

    updatePosition (style1 = {}, style2 = {}) {
        let style = Object.assign({}, style1, style2);

        Object.keys(style).forEach(key => {
            style[key] = style[key] + 'px' 
        })

        var item = this.layer
        item.style = Object.assign(item.style, style);

        var list = this.read('/guide/snap/layer', item, 3);

        if (list.length) {

            var [x, y] = list

            if (typeof x != 'undefined') {
                item.style.x = x + 'px';
            }

            if (typeof y != 'undefined') {
                item.style.y = y + 'px';
            }
        }

        this.$layer.css({
            left: item.style.x,
            top: item.style.y
        })
        this.dispatch('/item/set', item);
        this.refresh(true); 
    }


    moveXY (dx, dy) {
        var x = this.moveX + dx; 
        var y = this.moveY + dy; 

        this.updatePosition({x, y})
    }    


    'pointermove document' (e) {
        if (this.isDown) {
            this.refs.$page.addClass('moving');
            this.targetXY = e.xy;

            this.moveXY(this.targetXY.x - this.xy.x, this.targetXY.y - this.xy.y)
        }
    }

    'pointerend document' (e) {
        if (this.isDown) {
            this.isDown = false; 
            this.layer = null;
            this.refs.$page.removeClass('moving');        
        }
    }

    'dragover' (e) {
        e.preventDefault()
    }

    'dragstart' (e) {
        e.preventDefault()
    }

    'dragover document' (e) {
        // alert('a');
        e.preventDefault() 
    }

    'drop document' (e) {
        return; 
        e.preventDefault();
        var files = [...e.dataTransfer.files]; 
        this.read('/item/current/layer', (layer) => {
            this.read('/image/get/file', files, (img) => {
                this.dispatch('/item/add/image/file', img, true, layer.id);
            })
        })
    }
}