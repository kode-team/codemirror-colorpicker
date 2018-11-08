import UnitRange from "./element/UnitRange";
import UIElement from "../../../../../colorpicker/UIElement";
import { parseParamNumber } from "../../../../../util/filter/functions";

export default class BackgroundSize extends UIElement {
    components () {
        return {
            UnitRange
        }
    }
    template () {
        return `
            <div class='property-item background'>
                <!-- <div class='title' ref="$title">Background</div> -->   
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
                        <label>x</label>
                        <UnitRange 
                            ref="$x" 
                            min="0" max="1000" step="1" value="0" unit="px" 
                            maxValueFunction="getMaxX"
                            updateFunction="updateX"
                        ></UnitRange>
                    </div>
                    <div>
                        <label>y</label>
                        <UnitRange 
                            ref="$y" 
                            min="0" max="1000" step="1" value="0" unit="px" 
                            maxValueFunction="getMaxY"
                            updateFunction="updateY"
                        ></UnitRange>
                    </div>
                    <div>
                        <label>width</label>
                        <UnitRange 
                            ref="$width" 
                            min="0" max="1000" step="1" value="0" unit="px" 
                            maxValueFunction="getMaxWidth"
                            updateFunction="updateWidth"
                        ></UnitRange>
                    </div>
                    <div>
                        <label>height</label>
                        <UnitRange 
                            ref="$height" 
                            min="0" max="1000" step="1" value="0" unit="px" 
                            maxValueFunction="getMaxHeight"
                            updateFunction="updateHeight"
                        ></UnitRange>
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

    updateWidth (value) {
        this.read('/item/current/image', (image) => {
            image.backgroundSizeWidth = value;
            this.dispatch('/item/set', image);
        })
    }

    updateHeight (value) {
        this.read('/item/current/image', (image) => {
            image.backgroundSizeHeight = value;
            this.dispatch('/item/set', image);
        })
    }

    updateX (value) {
        this.read('/item/current/image', (image) => {
            image.backgroundPositionX = value;
            this.dispatch('/item/set', image);
        })
    }    

    updateY (value) {
        this.read('/item/current/image', (image) => {
            image.backgroundPositionY = value;
            this.dispatch('/item/set', image);
        })
    }        

    getMaxHeight () {
        var layer = this.read('/item/current/layer');

        if (!layer) return 0;

        return parseParamNumber(layer.style.height)
    }

    getMaxY () {
        var layer = this.read('/item/current/layer');

        if (!layer) return 0;

        return parseParamNumber(layer.style.height) * 2; 
    }

    getMaxWidth () {
        var layer = this.read('/item/current/layer');

        if (!layer) return 0;

        return parseParamNumber(layer.style.width)
    }

    getMaxX () {
        var layer = this.read('/item/current/layer');

        if (!layer) return 0;

        return parseParamNumber(layer.style.width) * 2; 
    }    

    'click $size button' (e) {
        
        this.read('/item/current/image', (image) => {
            image.backgroundSize = e.$delegateTarget.val()
            this.selectBackgroundSize(image.backgroundSize);
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

        var isShow = this.isShow()

        this.$el.toggle(isShow)

        if (isShow) {
            this.read('/item/current/image', (image) => {
                this.children.$width.refresh(image.backgroundSizeWidth);
                this.children.$height.refresh(image.backgroundSizeHeight);
                this.children.$x.refresh(image.backgroundPositionX);
                this.children.$y.refresh(image.backgroundPositionY);
                this.selectBackgroundSize(image.backgroundSize);
                this.selectBackgroundRepeat(image.backgroundRepeat);
            })   
        }

    }

    isShow () {

        return true; 
    }

}