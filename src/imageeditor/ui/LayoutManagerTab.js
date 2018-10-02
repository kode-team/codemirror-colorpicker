import BaseTab from "./BaseTab";
import GradientLayers from "./layer/GradientLayers";

export default class LayerManagerTab extends BaseTab {
    template () {
        return `
            <div class="tab layout-manager-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="layer">Layer</div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="layer">
                        <GradientLayers></GradientLayers>
                    </div>
                </div>
            </div>
        `
    }

    components () {
        return { GradientLayers }
    }
}