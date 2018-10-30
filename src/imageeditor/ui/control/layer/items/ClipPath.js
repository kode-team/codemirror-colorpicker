import BasePropertyItem from "./BasePropertyItem";

export default class ClipPath extends BasePropertyItem {
    template () {
        return `
            <div class='property-item clip-path show'>
                <div class='title' ref="$title">Clip Image</div>
                <div class='items'>            
                    <div>
                        <label>Type</label>
                        <div >
                            <select ref="$clipType">
                                <option value="">none</option>
                                <!-- <option value="circle">circle</option>-->
                                <!-- <option value="inset">inset</option> -->
                                <!-- <option value="polygon">polygon</option> -->
                                <option value="svg">svg</option>
                            </select>
                        </div>
                    </div>                                
                    <div>
                        <label>Fit Size</label>
                        <div >
                            <label><input type="checkbox" ref="$fit" /> fit to layer</label>
                        </div>
                    </div>                
                    <div>
                        <label>Clip</label>
                        <div class='clip-path-container' ref="$clipPath" title="Click me!!">

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
                this.refs.$clipPath.html(layer.clipPathSvg)
            }

            this.refs.$fit.el.checked = !!layer.fitClipPathSize
            this.refs.$clipType.val(layer.clipPathType);
        });
    }

    'click $clipPath' () {
        this.emit('toggleClipPathImageResource')
    }

    'click $fit' () {
        this.read('/item/current/layer', (layer) => {
            layer.fitClipPathSize = this.refs.$fit.el.checked;
            this.dispatch('/item/set', layer);
        })
    }

    'change $clipType' () {
        this.read('/item/current/layer', (layer) => {
            layer.clipPathType = this.refs.$clipType.val();
            this.dispatch('/item/set', layer);
        })
    }

}