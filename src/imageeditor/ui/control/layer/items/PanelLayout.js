import UIElement from "../../../../../colorpicker/UIElement";

export default class PanelLayout extends UIElement {
    template () {
        return `
            <div class='property-item layout'>
                <div class='items'>
                    <div>
                        <div class='layout-buttons' ref="$buttons">
                            <button type="button" class='small' ref="$small">S</button>
                            <button type="button" class='large' ref="$large">L</button>
                        </div>
                    </div>   
                                 
                </div>
            </div>
        `
    }

    refresh () {
        this.refs.$buttons.removeClass('small-mode').removeClass('large-mode')

        var mode = this.read('/storage/get', 'panel') || 'large';
        this.refs.$buttons.addClass(mode + '-mode')
    }

    '@changeEditor' () {
        this.refresh()
    }

    '@changeStorage' () {
        this.refresh();
    }

    'click $small' (e) {
        this.emit('updatePanelLayout', 'small')
        this.dispatch('/storage/set', 'panel', 'small')
        this.refresh();        
    }

    'click $large' (e) {
        this.emit('updatePanelLayout', 'large')
        this.dispatch('/storage/set', 'panel', 'large')
        this.refresh();
    }

}