import BaseModule from "../../colorpicker/BaseModule";


export default class ExternalResourceManager extends BaseModule {


    afterDispatch () {
        this.$store.emit('changeEditor')
    }

    '/external/paste' ($store, dataTransfer, layerId) {
        var items = [...dataTransfer.items]
        var types = [...dataTransfer.types].filter(type => type == 'text/uri-list');
        
        var dataList = types.map(type => {
            return dataTransfer.getData(type);
        })
 
        if (dataList.length) {
            $store.read('/image/get/url', dataList, (url) => {

                $store.run('/item/prepend/image/url', url, true, layerId);
            })
        }

        var files = [...dataTransfer.files]; 
        if (files.length) {

            $store.read('/image/get/file', files, (img) => {
                $store.dispatch('/item/prepend/image/file', img, true, layerId);
            })
        }
    }

}