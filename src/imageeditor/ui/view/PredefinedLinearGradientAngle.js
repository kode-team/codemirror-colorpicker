import UIElement from '../../../colorpicker/UIElement';


export default class PredefinedLinearGradientAngle extends UIElement {

    template () { 
        return `
            <div class="predefined-angluar-group">
                <button type="button" data-value="to right"></button>                          
                <button type="button" data-value="to left"></button>                                                  
                <button type="button" data-value="to top"></button>                            
                <button type="button" data-value="to bottom"></button>                                        
                <button type="button" data-value="to top right"></button>                                
                <button type="button" data-value="to bottom right"></button>                                    
                <button type="button" data-value="to bottom left"></button>
                <button type="button" data-value="to top left"></button>
            </div>
        `
    }

    refresh () {
        this.$el.toggle(this.isShow())
    }


    isShow () {
        if (!this.read('/item/is/mode', 'image')) return false;         
        var image = this.read('/item/current/image')

        if (!image) { return false; }

        return this.read('/tool/get', 'guide.angle') && this.read('/image/type/isLinear', image.type);
    }

    'click.self $el button' (e) {

        this.read('/item/current/image', (item) => {
            item.angle = e.$delegateTarget.attr('data-value'); 

            this.dispatch('/item/set', item);
        })
        
    }

    '@changeEditor' () { this.refresh(); }


    '@changeTool' () {
        this.refresh();
    }

}