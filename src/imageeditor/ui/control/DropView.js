import UIElement from "../../../colorpicker/UIElement";

export default class DropView extends UIElement {

    template () {
        return `
            <div class='drop-view'>
                <div class='drop-overview'></div>
            </div>
        `
    }

    'dragover document' (e) {
        e.preventDefault() 
        this.$el.show();
    }

    'dragout document' (e) {
        e.preventDefault();
        this.$el.hide();
    }

    'drop document' (e) {
        e.preventDefault(); 
        
        var files = [...e.dataTransfer.files]; 

        this.read('/item/current/layer', (layer) => {
            this.read('/image/get/file', files, (img) => {
                this.dispatch('/item/add/image/file', img, true, layer.id);
            })
        })
    }
}