import GradientSampleList from "../../colorsteps/GradientSampleList";
import BasePropertyItem from "./BasePropertyItem";

export default class SampleList extends BasePropertyItem {
    template () {
        return `
            <div class='property-item sample-list show'>
                <div class='items'>            
                    <GradientSampleList></GradientSampleList>
                </div>
            </div>
        `
    }

    components() {
        return { GradientSampleList }
    }

}