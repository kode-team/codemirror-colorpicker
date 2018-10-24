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
        


        var items = [...e.dataTransfer.items]
        var types = [...e.dataTransfer.types].filter(type => type == 'text/uri-list');
        
        var dataList = types.map(type => {
            return e.dataTransfer.getData(type);
        })

        if (dataList.length) {

            this.read('/item/current/layer', (layer) => {
                this.read('/image/get/url', dataList, (url) => {
                    this.dispatch('/item/add/image/url', url, true, layer.id);
                })
            })            
        }

        console.log(items, types, dataList);
        var files = [...e.dataTransfer.files]; 
        if (files.length) {

            this.read('/item/current/layer', (layer) => {
                this.read('/image/get/file', files, (img) => {
                    this.dispatch('/item/add/image/file', img, true, layer.id);
                })
            })
        }

    }
}