import UIElement from "../../../colorpicker/UIElement";

export default class Timeline extends UIElement {

    template () {
        return `
            <div class='timeline-view'>
                <div class="timeline-header" ref="$header">
                    Timeline
                </div>
                <div class='timeline-body"></div>
            </div>
        `
    }


    'click $header' () {
        this.parent.toggleTimeline();
    }
}