import UIElement from "../../../../../colorpicker/UIElement";

export default class Background extends UIElement {
    template () {
        return `
            <div class='property-item background'>
                <div class='items'>
                    <div>
                        <label>size</label>
                        <div>
                            <input type="text" ref="$width" />
                            <select ref="$widthSelect">
                                <option value='auto'>auto</option>
                                <option value='initial'>initial</option>
                                <option value='contain'>contain</option>
                                <option value='cover'>cover</option>
                                <option value='%'>%</option>
                                <option value='px'>px</option>
                            </selct>
                        </div>

                        <div>
                            <input type="text" ref="$height" />
                            <select ref="$heightSelect">
                                <option value='auto'>auto</option>
                                <option value='initial'>initial</option>
                                <option value='%'>%</option>
                                <option value='px'>px</option>
                            </selct>
                        </div>                        
                    </div>

                </div>
            </div>
        `
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

        // if (!item) reutrn; 
        // if (item.itemType == 'image') return; 

        // if (item.style.width) {
        //     this.refs.$width.val(item.style.width.replace('px', ''))
        // }

        // if (item.style.height) {
        //     this.refs.$height.val(item.style.height.replace('px', ''))
        // }
        
    }

}