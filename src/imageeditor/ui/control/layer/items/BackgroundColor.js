import UIElement from "../../../../../colorpicker/UIElement";

export default class BackgroundColor extends UIElement {
    template () {
        return `
            <div class='property-item background-color show'>
                <div class='items'>            
                    <div>
                        <label>Background Color</label>
                        <div style='width: 40px'>
                            <span class='color' ref="$color"></span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    '@changeEditor' () {
        this.refresh()
    }

    refresh() {
        this.read('/item/current/layer', (layer) => {
            this.refs.$color.css('background-color', layer.style['background-color'])
        });
    }

}