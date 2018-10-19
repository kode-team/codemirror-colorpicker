import BasePropertyItem from "./BasePropertyItem";

export default class BackgroundSize extends BasePropertyItem {
    template () {
        return `
            <div class='property-item background-size'>
                <div class='title' ref="$title">Background Size</div>            
                <div class='items'>
                    <div>
                        <label>size</label>
                        <div>
                            <button type="button" ref="$contain">Contain</button>
                            <button type="button" ref="$cover">Cover</button>
                            <button type="button" ref="$auto">Auto</button>
                        </div>
                    </div>
                    <div>
                        <label>width</label>
                        <div>
                            <input type="text" ref="$width" />
                            <select ref="$widthSelect">
                                <option value='%'>%</option>
                                <option value='px'>px</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>height</label>
                        <div>
                            <input type="text" ref="$height" />
                            <select ref="$heightSelect">
                                <option value='%'>%</option>
                                <option value='px'>px</option>
                            </select>
                        </div>                        
                    </div>

                </div>
            </div>
        `
    }

    'click $contain' () {
        this.read('/item/current/image', (image) => {
            image.backgroundSize = 'contain'
            this.dispatch('/item/set', image);
        })
    }

    'click $cover' () {
        this.read('/item/current/image', (image) => {
            image.backgroundSize = 'cover'
            this.dispatch('/item/set', image);
        })
    }    

    'click $auto' () {
        this.read('/item/current/image', (image) => {
            image.backgroundSize = 'auto'
            this.dispatch('/item/set', image);
        })
    }        

    'change $widthSelect' () {
        this.refs.$width.val(this.refs.$widthSelect.val());
    }

    'change $heightSelect' () {
        this.refs.$height.val(this.refs.$heightSelect.val());
    }    

    'input $width' (e) {
        this.read('/item/current/image', (image) => {
            image.backgroundSizeWidth = this.refs.$width.val()
            this.dispatch('/item/set', image);
        })
    }

    'input $height' (e) {
        this.read('/item/current/image', (image) => {
            image.backgroundSizeHeight = this.refs.$height.val()
            this.dispatch('/item/set', image);
        })
    }

    '@changeEditor' () {
        this.refresh()
    }

    refresh() {

        this.read('/item/current/image', (image) => {
            if (image.backgroundSizeWidth) {
                this.refs.$width.val(image.backgroundSizeWidth);
            }

            if (image.backgroundSizeHeight) {
                this.refs.$height.val(image.backgroundSizeHeight);
            }            
        })
        
    }

}