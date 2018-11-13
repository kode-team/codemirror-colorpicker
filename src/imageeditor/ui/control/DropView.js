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

        var dataTransfer = e.dataTransfer;

        var items = [...dataTransfer.items]
        var types = [...dataTransfer.types].filter(type => type == 'text/uri-list');
        
        var dataList = types.map(type => {
            return dataTransfer.getData(type);
        })

        if (dataList.length) {
            this.read('/item/current/layer', (layer) => {
                this.read('/image/get/url', dataList, (img) => {
                    this.dispatch('/item/prepend/image/url', img, true, layer.id);
                })
            })            
        }

        var files = [...dataTransfer.files]; 
        if (files.length) {
            this.read('/item/current/layer', (layer) => {
                this.read('/image/get/file', files, (img) => {
                    this.dispatch('/item/prepend/image/file', img, true, layer.id);
                })
            })
        }

    }


    'paste document' (e) {

        var dataTransfer = e.clipboardData;

        var items = [...dataTransfer.items]
        var types = [...dataTransfer.types].filter(type => type == 'text/uri-list');
        
        var dataList = types.map(type => {
            return dataTransfer.getData(type);
        })

        if (dataList.length) {
            this.read('/item/current/layer', (layer) => {
                this.read('/image/get/url', dataList, (url) => {
                    this.dispatch('/item/prepend/image/url', url, true, layer.id);
                })
            })            
        }

        var files = [...dataTransfer.files]; 
        if (files.length) {
            this.read('/item/current/layer', (layer) => {
                this.read('/image/get/file', files, (img) => {
                    this.dispatch('/item/prepend/image/file', img, true, layer.id);
                    this.refresh();
                })
            })
        }

    }
}