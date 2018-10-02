import BaseTab from "./BaseTab";
import ColorPicker from "./color/ColorPicker";



export default class ColorTab extends BaseTab {
    template () {
        return `
            <div class="tab color-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="color">Color</div>
                    <div class="tab-item" data-id="swatch">Swatch</div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="color">
                        <ColorPicker></ColorPicker>
                    </div>
                    <div class="tab-content" data-id="swatch"></div>
                </div>
            </div>
        `
    }

    components () {
        return { ColorPicker }
    }
}