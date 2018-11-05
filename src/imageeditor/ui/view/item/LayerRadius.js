import UIElement from '../../../../colorpicker/UIElement';

export default class LayerRadius extends UIElement {
    template () {
        return `<div ></div>`
    }

    refresh () {

        this.read('/item/current/layer', (layer) => {
            var radius = this.read('/layer/get/border-radius', layer);
            this.$el.css(radius); 
        })
    }

    '@startRadius' () {
        this.$el.css({
            'background-color': 'rgba(0, 0, 0, 0.1)',
            position: 'absolute',
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',
            border: '1px solid rgba(0, 0, 0, 0.3)'
        }).show();
    }

    '@changeRadius' () {
        this.refresh();

    }

    '@endRadius' () {
        this.$el.hide();
    }

}