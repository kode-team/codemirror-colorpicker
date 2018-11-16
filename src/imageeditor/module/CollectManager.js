import BaseModule from "../../colorpicker/BaseModule";

export default class CollectManager extends BaseModule {

    '*/collect/colorsteps' ($store, imageId) {
        return $store.read('/item/map/children', imageId, (colorstep) => {
            var colorstep = $store.read('/clone', $store.items[colorstep.id]);
            delete colorstep.id;
            delete colorstep.parentId;
    
            return colorstep
        })
    }

    '*/collect/image/one' ($store, imageId) {
        var image = $store.read('/clone', $store.items[imageId]);
        delete image.id;
        delete image.parentId;

        return {
            image,
            colorsteps: $store.read('/collect/colorsteps', imageId)
        }
    }

    '*/collect/images' ($store, layerId) {
        return $store.read('/item/map/children', layerId, (image) => {
            return $store.read('/collect/image/one', image.id)
        })
    }

    '*/collect/layer/one' ($store, layerId) {
        var results = {} 

        if (!$store.items[layerId]) {
            return results; 
        }

        var layer = $store.read('/clone', $store.items[layerId]);
        delete layer.id;
        delete layer.parentId;

        return {
            layer,
            images: $store.read('/collect/images', layerId)
        }
    }

    '*/collect/layers' ($store, pageId) {
        return $store.read('/item/map/children', pageId, (layer) => {
            return $store.read('/collect/layer/one', layer.id)
        })
    }

    '*/collect/page/one' ($store, pageId) {
        var results = {} 

        if (!$store.items[pageId]) {
            return results; 
        }

        var page = $store.read('/clone', $store.items[pageId]);
        delete page.id;
        delete page.parentId;

        return {
            page,
            layers: $store.read('/collect/layers', pageId)
        }

    }

}