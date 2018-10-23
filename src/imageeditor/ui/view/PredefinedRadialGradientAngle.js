import UIElement from '../../../colorpicker/UIElement';


export default class PredefinedRadialGradientAngle extends UIElement {

    template () { 
        return `
            <div class="predefined-radial-gradient-angle">
                <button ref="$center" type="button" data-value="center" title="center"><span class='circle'></span></button>            
                <select class="radial-type-list" ref="$select">
                    <option value="circle">circle</option>
                    <option value="ellipse">ellipse</option>
                    <option value="closest-side">closest-side</option> 
                    <option value="closest-corner">closest-corner</option>
                    <option value="farthest-side">farthest-side</option>
                    <option value="farthest-corner">farthest-corner</option>                    
                </select>
            </div>
        `
    }

    refresh () {
        this.read('/item/current/image', (image) => {
            this.refs.$select.val(image.radialType);
        })
    }

    '@changeEditor' () {
        this.refresh();
    }

    'change $select' (e) {
        this.read('/item/current/image', (image) => {
            image.radialType = this.refs.$select.val()
            this.dispatch('/item/set', image)
        });

    }

    'click $center' (e) {
        this.read('/item/current/image', (image) => {
            image.radialPosition = 'center' 
            this.dispatch('/item/set', image)
        });
    }
}