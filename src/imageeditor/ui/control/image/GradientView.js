import GradientAngle from '../../view/GradientAngle'
import GradientPosition from '../../view/GradientPosition' 
import PredefinedLinearGradientAngle from '../../view/PredefinedLinearGradientAngle'
import PredefinedRadialGradientPosition from '../../view/PredefinedRadialGradientPosition'
import GradientLayersMenu from './GradientLayersMenu'; 
import BaseTab from '../../BaseTab';
import PredefinedPageResizer from '../../view/PredefinedPageResizer';
import PredefinedLayerResizer from '../../view/PredefinedLayerResizer';

import LayerMenuTab from './LayerMenuTab'; 


import { EDITOR_MODE_IMAGE_IMAGE, EDITOR_MODE_IMAGE_LINEAR, EDITOR_MODE_IMAGE_RADIAL, EDITOR_MODE_IMAGE_STATIC } from '../../../module/ItemManager';
import LayerPreview from './menuItem/LayerPreview';
import MoveGuide from '../../view/MoveGuide';
   

export default class GradientView extends BaseTab {

    template () {
        return `
            <div class='page-view'>
                <div class="page-menu">
                    <LayerPreview></LayerPreview>
                    <LayerMenuTab></LayerMenuTab>
                </div>
                <div class='page-content' ref="$board">
                    <div class="page-canvas">
                        <div class="gradient-color-view-container" ref="$page">
                            <div class="gradient-color-view" ref="$colorview"></div>            
                            <PredefinedPageResizer></PredefinedPageResizer>
                            <PredefinedLayerResizer></PredefinedLayerResizer>
                        </div>       
                        <MoveGuide></MoveGuide>                          
                    </div>          
                </div>

                <PredefinedLinearGradientAngle></PredefinedLinearGradientAngle>
                <PredefinedRadialGradientPosition></PredefinedRadialGradientPosition>
                <GradientPosition></GradientPosition>
                <GradientAngle></GradientAngle>     
   
            </div>
        `
    } 

    components () {
        return {  
            MoveGuide,
            GradientAngle, 
            GradientPosition, 
            PredefinedLinearGradientAngle, 
            PredefinedRadialGradientPosition, 
            GradientLayersMenu,
            PredefinedPageResizer,
            PredefinedLayerResizer,
            LayerMenuTab,
            LayerPreview
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

    'click.checkPage $colorview' (e) {
        var page = this.read('/item/current/page')
        if (page) {
            this.dispatch('/item/select', page.id)
        }
        
    }

    'click $page .layer' (e) {
        var id = e.$delegateTarget.attr('item-id')
        if (id) {
            this.dispatch('/item/select', id);
            this.dispatch('/item/select/mode', 'layer')
        }
    }

    'click.self $el .page-content' (e) {
        this.dispatch('/item/select/mode', 'board');
    }

    'click.self $el .page-canvas' (e) {
        this.read('/item/current/page', (page) => {
            this.dispatch('/item/select', page.id);
        })
    }

    'pointerstart $page .layer' (e) {
        this.isDown = true; 
        this.xy = e.xy;
        this.layer = this.read('/item/get', e.$delegateTarget.attr('item-id'))
        this.moveX = +(this.layer.style.x || 0).replace('px', '')
        this.moveY = +(this.layer.style.y || 0).replace('px', '')

        this.dispatch('/item/select', this.layer.id)
    }

    change (style1 = {}, style2 = {}) {

        let style = Object.assign({}, style1, style2);

        Object.keys(style).forEach(key => {
            style[key] = style[key] + 'px' 
        })

        var item = this.layer

        item.style = Object.assign(item.style, style);

        this.dispatch('/item/set', item);
        this.refresh(true); 
    }


    moveXY (dx, dy) {
        var x = this.moveX + dx; 
        var y = this.moveY + dy; 

        this.change({x, y})
    }    


    'pointermove document' (e) {
        if (this.isDown) {
            this.refs.$page.addClass('moving');
            this.targetXY = e.xy;

            this.moveXY(this.targetXY.x - this.xy.x, this.targetXY.y - this.xy.y)
        }
    }

    'pointerend document' (e) {
        this.isDown = false; 
        this.layer = null;
        this.refs.$page.removeClass('moving');        
    }
}