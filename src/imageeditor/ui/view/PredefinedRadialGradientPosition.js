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
        this.dispatch('/image/change', { radialPosition: e.$delegateTarget.attr('data-value') });
    }


    refresh () {
        this.$el.toggle(this.isShow())
    }

    isShow () {
        return !this.dispatch('/image/isLinearType') && this.read('/tool/get', 'guide.angle')
    }

    '@changeLayer' () {
        this.refresh()
    }

    '@initLayer' () { this.refresh() }    

    '@changeTool' () {
        this.refresh()
    }

}