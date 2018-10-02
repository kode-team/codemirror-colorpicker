import UIElement from '../../../../colorpicker/UIElement';
import ImageMenu from './ImageMenu';

export default class LayersMenu extends UIElement {

    template () {
        return ` 
            <div class='gradient-layers-menu'>
                <div class="left">
                    <ImageMenu></ImageMenu>
                </div>
                <div class="right">
                    <span class="divider">|</span>                    
                    <button type="button" ref="$stackView" class="stack-view" title="Stack View"></button>
                    <button type="button" ref="$onlyView" class="only-view" title="Only View"></button>
                    <span class="divider">|</span>
                    <button type="button" ref="$showAngle" class='show-angle' title="Show angle guide"></button>
                </div>
            </div>
        `
    }

    components () {
        return { ImageMenu }
    }
 
    refresh () {
        // this.refs.$show.toggleClass('selected', this.dispatch('/getGradientLayerVisible'))
    }

    '@changeLayer' () {
        this.refresh()
    }

    '@initLayer' () { this.refresh() }    

    'click $show' (e) {
        // TODO: 매끈하게 만들어봅시다. 
        var isVisible = this.refs.$show.hasClass('selected')
        this.dispatch('/setLayerVisible', isVisible)
        this.refresh();
    }

    'click $showPosition' (e) {
        this.dispatch('/tool/toggle', 'guide.position')
    }

    'click $showAngle' (e) {
        this.dispatch('/tool/toggle', 'guide.angle')
    }    

    'click $onlyView' (e) {
        this.dispatch('/tool/set', 'guide.only', true)
    }

    'click $stackView' (e) {
        this.dispatch('/tool/set', 'guide.only', false)
    }    
}