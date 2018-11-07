import UIElement from '../../../colorpicker/UIElement';


export default class PredefinedRadialGradientPosition extends UIElement {

    template () {
        return ` 
            <div class="predefined-angluar-group radial-position">
                <button type="button" data-value="top"></button>                          
                <button type="button" data-value="left"></button>                                                  
                <button type="button" data-value="bottom"></button>                            
                <button type="button" data-value="right"></button>                                        
            </div>
        `
    }
    'click $el button' (e) {

        var item = this.read('/item/current/image')

        if (item) {
            item.radialPosition =  e.$delegateTarget.attr('data-value')
            this.dispatch('/item/set', item);
        }
    }

    refresh () {
        this.$el.toggle(this.isShow())
    }

    isShow () {
        if (!this.read('/item/is/mode', 'image')) return false; 

        var image = this.read('/item/current/image')

        if (!image) { return false; }

        var isRadial = this.read('/image/type/isRadial', image.type);
        var isConic = this.read('/image/type/isConic', image.type);

        return this.read('/tool/get', 'guide.angle') && (isRadial || isConic);
    }

    '@changeEditor' () {
        this.refresh()
    }

    '@changeTool' () {
        this.refresh()
    }

}