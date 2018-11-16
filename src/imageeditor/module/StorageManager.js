import BaseModule from "../../colorpicker/BaseModule";
import { uuid } from "../../util/functions/math";

const SAVE_ID = 'css-imageeditor'
const CACHED_PAGE_SAVE_ID = 'css-imageeditor-cached-pages'
const CACHED_LAYER_SAVE_ID = 'css-imageeditor-cached-layers'
const CACHED_IMAGE_SAVE_ID = 'css-imageeditor-cached-images'

export default class StorageManager extends BaseModule {

    initialize () {
        super.initialize()

        this.$store.cachedPages = []
        this.$store.cachedLayers = []
        this.$store.cachedImages = []
    }

    afterDispatch () {
        this.$store.emit('changeStorage')
    }

    '*/storage/get' ($store, key) {
        return JSON.parse(localStorage.getItem(`${SAVE_ID}-${key}`))
    }

    '/storage/set' ($store, key, value) {
        localStorage.setItem(`${SAVE_ID}-${key}`, JSON.stringify(value))
    }

    '*/storage/pages' ($store, id = undefined) {
        if (typeof id !== 'undefined' ) {
            var results = $store.cachedPages.filter(item => (item.id == id) );

            if (!results.length) {
                return {}
            }

            return results[0];
        }
        return $store.cachedPages;
    }

    '*/storage/layers' ($store, id = undefined) {
        if (typeof id !== 'undefined' ) {
            var results = $store.cachedLayers.filter(item => (item.id == id) );

            if (!results.length) {
                return {}
            }

            return results[0];
        }
        return $store.cachedLayers;
    }    

    '*/storage/images' ($store, index = undefined) {
        if (typeof index !== 'undefined' ) {
            return $store.cachedImages[index];
        }
        return $store.cachedImages;
    }

    '/storage/unshift/layer' ($store, layer) {
        var item = $store.read('/clone', layer);
        item.id = uuid()
        $store.cachedLayers.unshift(item);

        $store.run('/storage/save/layer');
    }

    '/storage/add/layer' ($store, layer) {
        var item = $store.read('/clone', layer);
        item.id = uuid()        
        $store.cachedLayers.push(item);

        $store.run('/storage/save/layer');
    }    

    '/storage/remove/layer' ($store, id) {

        $store.cachedLayers = $store.cachedLayers.filter(item => {
            return item.id != id; 
        });

        $store.run('/storage/save/layer');
    }        

    '/storage/remove/page' ($store, id) {

        $store.cachedLayers = $store.cachedPages.filter(item => {
            return item.id != id; 
        });

        $store.run('/storage/save/page');
    }            

    '/storage/unshift/page' ($store, page) {
        var item = $store.read('/clone', page);
        item.id = uuid()
        $store.cachedPages.unshift(item);

        $store.run('/storage/save/page');
    }

    '/storage/add/page' ($store, page) {
        var item = $store.read('/clone', page);
        item.id = uuid()        
        $store.cachedPages.push(item);

        $store.run('/storage/save/page');
    }    

    '/storage/delete/page' ($store, id) {

        $store.cachedPages = $store.cachedPages.filter(item => {
            return item.id != id; 
        });

        $store.run('/storage/save/page');
    }      

    '/storage/delete/image' ($store, id) {

        $store.cachedImages = $store.cachedImages.filter(item => {
            return item.id != id; 
        });

        $store.run('/storage/save/image');
    }            

    '/storage/add/image' ($store, image) {
        var item = $store.read('/clone', image);
        item.id = uuid()        
        $store.cachedImages.push(item);

        $store.run('/storage/save/image');
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

    '/storage/save/page' ($store) {
        localStorage.setItem(CACHED_PAGE_SAVE_ID, JSON.stringify($store.cachedPages))
    }        

    '/storage/save/image' ($store) {
        localStorage.setItem(CACHED_IMAGE_SAVE_ID, JSON.stringify($store.cachedImages))
    }        

    '/storage/load/layer' ($store) {
        $store.cachedLayers = JSON.parse(localStorage.getItem(CACHED_LAYER_SAVE_ID) || "[]");

        $store.cachedLayers = $store.cachedLayers.map(item => {
            if (!item.id) item.id = uuid();
            return item;
        })
    }        

    '/storage/load/page' ($store) {
        $store.cachedPages = JSON.parse(localStorage.getItem(CACHED_PAGE_SAVE_ID) || "[]");

        $store.cachedPages = $store.cachedPages.map(item => {
            if (!item.id) item.id = uuid();
            return item;
        })
    }            

    '/storage/load/image' ($store) {
        $store.cachedImages = JSON.parse(localStorage.getItem(CACHED_IMAGE_SAVE_ID) || "[]");

        $store.cachedLayers = $store.cachedLayers.map(item => {
            if (!item.id) item.id = uuid();
            return item;
        })        
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