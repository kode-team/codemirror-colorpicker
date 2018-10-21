import UIElement from "../../../colorpicker/UIElement";

export default class DropView extends UIElement {

    template () {
        return `
            <div class='drop-view'>

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
        var items = [...e.dataTransfer.items].map(item => {
            return { kind: item.kind, type: item.type, item } 
        });
        var types = [...e.dataTransfer.types].filter(type => {
            return type == 'text/uri-list'
        }).map(type => {
            return e.dataTransfer.getData(type);
        });

        this.read('/item/current/layer', (layer) => {
            this.read('/image/get/file', files, (img) => {
                this.dispatch('/item/add/image/file', img, true, layer.id);
            })
        })
    }
}