import BaseTab from "./BaseTab";
import ImageControl from './control/ImageControl'
export default class ControlTab extends BaseTab {
    template () {
        return `
            <div class="tab control-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="image">Images</div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="image">
                        <ImageControl></ImageControl>
                    </div>
                </div>
            </div>
        `
    }

    components () {
        return { ImageControl   }
    }
}