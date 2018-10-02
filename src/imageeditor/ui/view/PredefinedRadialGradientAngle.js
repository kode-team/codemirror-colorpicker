import UIElement from '../../../colorpicker/UIElement';


export default class PredefinedRadialGradientAngle extends UIElement {

    template () { 
        return `
            <div class="predefined-angluar-group">
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
    'change $select' (e) {
        this.dispatch('/image/change', { radialType: this.refs.$select.val() });
    }

    'click $center' (e) {
        this.dispatch('/image/change', { radialPosition: 'center' });
    }
}