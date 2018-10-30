import BasePropertyItem from "./BasePropertyItem";

export default class ClipPath extends BasePropertyItem {
    template () {
        return `
            <div class='property-item background-color show'>
                <div class='title' ref="$title">Clip Image</div>
                <div class='items'>            
                    <div>
                        <label>Fit Size</label>
                        <div >
                            <input type="checkbox" ref="$fit" /> fit to layer
                        </div>
                    </div>                
                    <div>
                        <label>Clip</label>
                        <div style='cursor:pointer;width: 50px;height:50px;' ref="$clippath" title="Click me!!">

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
            if (layer.clipPathSvg) {
                this.refs.$clippath.html(layer.clipPathSvg)
            }

            this.refs.$fit.el.checked = !!layer.fitClipPathSize
        });
    }

    'click $clippath' () {
        this.emit('toggleClipPathImageResource')
    }

    'click $fit' () {
        this.read('/item/current/layer', (layer) => {
            layer.fitClipPathSize = this.refs.$fit.el.checked;
            this.dispatch('/item/set', layer);
        })
    }

}