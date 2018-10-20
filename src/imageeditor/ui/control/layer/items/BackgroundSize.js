import BasePropertyItem from "./BasePropertyItem";

export default class BackgroundSize extends BasePropertyItem {
    template () {
        return `
            <div class='property-item background'>
                <div class='title' ref="$title">Background</div>            
                <div class='items'>
                    <div>
                        <label>size</label>
                        <div class='size-list' ref="$size">
                            <button type="button" value="contain" title="contain" ></button>
                            <button type="button" value="cover" title="cover"></button>
                            <button type="button" value="auto" title="auto"></button>
                        </div>
                    </div>
                    <div>
                        <label>width</label>
                        <div>
                            <input type="range" min="0" max="1000" step="1" value="0" data-value="width" />
                            <input type="number" min="0" max="1000" step="1"  value="0" data-value="width" />
                            <select ref="$widthUnit">
                                <option value='px'>px</option>                            
                                <option value='%'>%</option>
                                <option value='em'>em</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>height</label>
                        <div>
                            <input type="range" min="0" max="1000" step="1"  value="0" data-value="height" />
                            <input type="number" min="0" max="1000" step="1"  value="0" data-value="height" />
                            <select ref="$heightUnit">
                                <option value='px'>px</option>                            
                                <option value='%'>%</option>
                                <option value='em'>em</option>
                                <option value='auto'>auto</option>                                
                            </select>
                        </div>                        
                    </div>
                    <div>
                        <label>repeat</label>
                        <div class='flex repeat-list' ref="$repeat">
                            <button type="button" value='no-repeat' title="no-repeat">
                                <span></span>
                            </button>                        
                            <button type="button" value='repeat' title="repeat">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            <button type="button" value='repeat-x' title="repeat-x">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            <button type="button" value='repeat-y' title="repeat-y">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            <button type="button" value='space' title="space">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>                                
                            </button>
                            <button type="button" value='round' title="round">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>                                                                
                            </button>                            
                            
                        </div>
                 
                    </div>

                </div>
            </div>
        `
    }

    'input $el input[type=range][data-value]' (e) {
        var target = e.$delegateTarget.attr('data-value')
        var value = e.$delegateTarget.val()
        var obj = this.$el.$(`input[type=number][data-value=${target}]`)
        if (obj) {
            obj.val(value);
        }
    }

    'input $el input[type=number][data-value]' (e) {
        var target = e.$delegateTarget.attr('data-value')
        var value = e.$delegateTarget.val()
        var obj = this.$el.$(`input[type=range][data-value=${target}]`)
        if (obj) {
            obj.val(value);
        }
    }    

    'click $size button' (e) {
        
        this.read('/item/current/image', (image) => {
            image.backgroundSize = e.$delegateTarget.val()
            this.selectBackgroundSize(image.backgroundSize);
            this.dispatch('/item/set', image);
        })
    }    

    'change $widthUnit' (e) {
        this.read('/item/current/image', (image) => {
            image.backgroundSizeWidthUnit = e.$delegateTarget.val()
            this.dispatch('/item/set', image);
        })
    }

    'change $heightUnit' () {
        this.read('/item/current/image', (image) => {
            image.backgroundSizeHeightUnit = e.$delegateTarget.val()
            this.dispatch('/item/set', image);
        })
    }    

    'input $el [data-value=width]' (e) {
        this.read('/item/current/image', (image) => {
            image.backgroundSizeWidth = e.$delegateTarget.val()
            this.dispatch('/item/set', image);
        })
    }

    'input $el [data-value=height]' (e) {
        this.read('/item/current/image', (image) => {
            image.backgroundSizeHeight = e.$delegateTarget.val()
            this.dispatch('/item/set', image);
        })
    }

    selectBackgroundSize(value = 'auto') {
        var selectedItem = this.refs.$size.$('.selected');
        if (selectedItem) selectedItem.removeClass('selected');

        if (!['contain', 'cover', 'auto'].includes(value)) {
            value = 'auto'; 
        }

        var item = this.refs.$size.$(`[value=${value}]`);

        if (item) {
            item.addClass('selected');
        }
    }

    selectBackgroundRepeat(value) {
        var selectedItem = this.refs.$repeat.$('.selected');
        if (selectedItem) selectedItem.removeClass('selected');

        var item = this.refs.$repeat.$(`[value=${value}]`);

        if (item) {
            item.addClass('selected');
        }
    }

    'click $repeat button' (e) {
        
        this.read('/item/current/image', (image) => {
            
            image.backgroundRepeat = e.$delegateTarget.val()
            
            this.selectBackgroundRepeat(image.backgroundRepeat);

            this.dispatch('/item/set', image);
        })
    }



    '@changeEditor' () {
        this.refresh()
    }

    refresh() {

        this.read('/item/current/image', (image) => {
            if (image.backgroundSizeWidth) {
                this.$el.$$('[data-value=width]').forEach($node => {
                    $node.val(image.backgroundSizeWidth);
                })

                this.refs.$widthUnit.val(image.backgroundSizeWidthUnit);                
            }

            if (image.backgroundSizeHeight) {
                this.$el.$$('[data-value=height]').forEach($node => {
                    $node.val(image.backgroundSizeHeight);
                })
                this.refs.$heightUnit.val(image.backgroundSizeHeightUnit);
            }

            this.selectBackgroundSize(image.backgroundSize);
            this.selectBackgroundRepeat(image.backgroundRepeat);
        })
        
    }

}