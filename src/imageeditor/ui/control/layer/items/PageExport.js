import UIElement from "../../../../../colorpicker/UIElement";

export default class PageExport extends UIElement {
    template () {
        return `
            <div class='property-item export'>
                <div class='title'>Export</div>
                <div class='items'>
                    <div>
                        <button type="button" ref="$export">view</button>
                    </div>   
                                 
                </div>
            </div>
        `
    }

    'click $export' (e) {
        this.emit('showExport')
    }

}