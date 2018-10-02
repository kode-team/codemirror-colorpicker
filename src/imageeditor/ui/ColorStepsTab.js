import BaseTab from "./BaseTab";
import GradientInfo from "./colorsteps/GradientInfo";
import GradientSteps from "./colorsteps/GradientSteps";

export default class ColorStepsTab extends BaseTab {
    template () {
        return `
            <div class="tab color-steps-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="colorstep">Color Steps</div>
                    <div class="tab-item" data-id="image">Image</div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="colorstep">
                        <GradientSteps></GradientSteps>
                        <GradientInfo></GradientInfo>
                    </div>
                    <div class="tab-content" data-id="image">
                        <ImageForm></ImageForm>
                    </div>
                </div>
            </div>
        `
    }

    components () { 
        return { GradientInfo, GradientSteps }
    }

    refresh () {
        var isImageType = this.read('/image/isImageType')

        this.selectTab(isImageType ? 'image' : 'colorstep')
    }

    '@changeLayer' () {
        this.refresh();
    }

    "@initLayer" () {
        this.refresh();
    }
}