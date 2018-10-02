import BaseTab from "./BaseTab";
import GradientInfo from "./colorsteps/GradientInfo";
import GradientSteps from "./colorsteps/GradientSteps";
import GradientSampleList from './colorsteps/GradientSampleList';
import ColorList from "./control/color/ColorList";


export default class ColorStepsTab extends BaseTab {
    template () {
        return `
            <div class="tab color-steps-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="colorstep">Color Steps</div>
                    <div class="tab-item" data-id="color">Color</div>
                    <div class="tab-item" data-id="image">Image</div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="colorstep">
                        <GradientSteps></GradientSteps>
                        <div class="layout-flow gradient-list-layout"> 
                            <GradientInfo></GradientInfo>
                            <GradientSampleList></GradientSampleList>                          
                        </div>
                    </div>
                    <div class="tab-content" data-id="image">
                        <ImageForm></ImageForm>
                    </div>
                    <div class="tab-content" data-id="color">
                        <ColorList></ColorList>
                    </div>
                </div> 
            </div>
        `
    }

    components () { 
        return { GradientInfo, GradientSteps, GradientSampleList, ColorList }
    }

    refresh () {
        var selectedId = 'colorstep'

        if (this.read('/image/isImageType')) {
            selectedId = 'image'
        } else if (this.read('/image/isStaticType')) {
            selectedId = 'color'
        }

        this.selectTab(selectedId)
    }

    '@changeLayer' () {
        this.refresh();
    }

    "@initLayer" () {
        this.refresh();
    }
}