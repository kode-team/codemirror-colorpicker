import UIElement from "../../../../colorpicker/UIElement";
import Icon from "../../common/Icon";
 
export default class ImageMenu extends UIElement {

    template () { 
        return `
            <div class="tools">                                
                <button type="button" ref="$createImageButton">+</button>
                <!--
                <span class="divider">|</span>
                <button type="button" class="first" ref="$first" title="move layer to first">&lt;&lt;</button>                  
                <button type="button" class="prev" ref="$left" title="move layer to prev">&lt;</button>            
                <button type="button" class="next" ref="$right" title="move layer to next">&gt;</button>
                <button type="button" class="last" ref="$last" title="move layer to last">&gt;&gt;</button>
                -->
            </div>                
        `
    }

    'click $createImageButton' (e) {
        this.dispatch('/image/add')
        this.refresh();
    }
}