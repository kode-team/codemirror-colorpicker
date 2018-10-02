import UIElement from '../../../colorpicker/UIElement';
import Icon from '../common/Icon';
import ImageList from '../control/image/ImageList';


export default class GradientLayers extends UIElement {

    template () { 
        return `
            <div class='gradient-layers'>
                <div class="tools">                                
                    <button type="button" ref="$createLayerButton">+</button>
                    <span class="divider">|</span>
                    <button type="button" class="first" ref="$first" title="move layer to first">&lt;&lt;</button>                  
                    <button type="button" class="prev" ref="$left" title="move layer to prev">&lt;</button>            
                    <button type="button" class="next" ref="$right" title="move layer to next">&gt;</button>
                    <button type="button" class="last" ref="$last" title="move layer to last">&gt;&gt;</button>
                    
                </div>            
                <div class="layer-list" ref="$layerList"></div>
                <ImageLIst></ImageList>        
            </div>
        `
    }

    components () {
        return { ImageList }
    }

    'load $layerList' () {
        var list = this.read('/layer/list')

        return  `<div>${list.map((layer, index) => {

                    var selected = layer.selected ? 'selected' : '' 
                    return `
                        <div class='gradient-item ${selected}' data-index="${index}">
                            <div class="gradient-item-view-container">
                                <div class="gradient-item-view"  style='${this.read('/layer/toString', layer)}' ref="$layer${index}"></div>
                            </div>
                            <div class="gradient-item-check" data-index="${index}">
                                ${Icon.CHECK}
                            </div>
                            <div class="gradient-item-visible ${layer.visible ? 'on' : ''}" data-index="${index}">
                                ${Icon.VISIBILITY}
                                ${Icon.VISIBILITY_OFF}
                            </div>                            
                            <div class="gradient-item-delete" data-index="${index}">
                                ${Icon.DELETE}
                            </div>
                        </div>`
                }).join('')}</div>`
    }

    refresh () {
        this.load()
    }

    '@changeLayer' () {
        if (this.refs.$layer0) {

            var list = this.read('/layer/list')

            list.forEach((layer, index) => {
                this.refs['$layer' + index].css(this.read('/layer/toCSS', layer));
            });
        } else {
            this.refresh()
        }

    }

    '@initLayer' () { this.refresh() }    

    'click $createLayerButton' (e) {
        this.dispatch('/layer/add')
        this.refresh();
    }

    'click $layerList .gradient-item-visible' (e) {
        this.dispatch('/layer/toggle/visible', +e.$delegateTarget.attr('data-index'));

        this.refresh();
    }

    'click.self $layerList .gradient-item' (e) {

        this.dispatch('/layer/select', +e.$delegateTarget.attr('data-index'));

        this.refresh();
    }

}