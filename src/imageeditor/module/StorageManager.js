import BaseModule from "../../colorpicker/BaseModule";

const SAVE_ID = 'css-imageeditor'
const CACHED_LAYER_SAVE_ID = 'css-imageeditor-cached-layers'
const CACHED_IMAGE_SAVE_ID = 'css-imageeditor-cached-images'

export default class StorageManager extends BaseModule {

    initialize () {
        super.initialize()

        this.$store.cachedLayers = []
        this.$store.cachedImages = []
    }

    afterDispatch () {
        this.$store.emit('changeEditor')
    }

    '*/storage/layers' ($store) {
        return $store.cachedLayers;
    }

    '/storage/unshift/layer' ($store, layer) {
        var item = $store.read('/clone', layer);
        $store.cachedLayers.unshift(item);

        $store.run('/storage/save/layer');
    }

    '/storage/add/layer' ($store, layer) {
        var item = $store.read('/clone', layer);
        $store.cachedLayers.add(item);

        $store.run('/storage/save/layer');
    }    

    '/storage/add/image' ($store, image) {
        var item = $store.read('/clone', image);
        $store.cachedImages.add(item);

        $store.run('/storage/save/image');
    }        

    '/storage/add/current/layer' ($store) {
        $store.read('/item/current/layer', (layer) => {
            $store.dispatch('/storage/add/layer', [
                $store.read('/clone', layer),
                ...$store.read('/item/map/children', layer.id, (item) => $store.read('/clone', item) )
            ])  
        })
    }

    '/storage/add/current/image' ($store) {
        $store.read('/item/current/image', (image) => {
            $store.dispatch('/storage/add/image', image)  
        })
    }


    '/storage/save' ($store) {
        localStorage.setItem(SAVE_ID, JSON.stringify({
            items: $store.items,
            selectedId: $store.selectedId,
            selectedMode: $store.selectedMode
        }))
    }

    '/storage/save/layer' ($store) {
        localStorage.setItem(CACHED_LAYER_SAVE_ID, JSON.stringify($store.cachedLayers))
    }    

    '/storage/save/image' ($store) {
        localStorage.setItem(CACHED_IMAGE_SAVE_ID, JSON.stringify($store.cachedImages))
    }        

    '/storage/load/layer' ($store) {
        $store.cachedLayers = JSON.parse(localStorage.getItem(CACHED_LAYER_SAVE_ID) || "[]");
    }        

    '/storage/load/image' ($store) {
        $store.cachedImages = JSON.parse(localStorage.getItem(CACHED_IMAGE_SAVE_ID) || "[]");
    }            

    '/storage/load' ($store, callback) {
        var obj = JSON.parse(localStorage.getItem(SAVE_ID) || "{}");

        if (obj.items) $store.items = obj.items 
        if (obj.selectedId) $store.selectedId = obj.selectedId
        if (obj.selectedMode) $store.selectedMode = obj.selectedMode

        if (typeof callback == 'function') {
            callback(!!obj.items)
        }
    }

}