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
    'click $el button' (e) {
        this.dispatch('/image/setAngle', e.$delegateTarget.attr('data-value'));
    }


    refresh () {
        this.$el.toggle(this.isShow())
    }

    isShow () {
        return this.dispatch('/image/isLinearType') && this.read('/tool/get', 'guide.angle')
    }

    '@changeLayer' () {
        this.refresh()
    }

    '@initLayer' () { this.refresh() }    


    '@changeTool' () {
        this.refresh();
    }

}