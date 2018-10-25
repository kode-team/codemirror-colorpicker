import BaseModule from "../../colorpicker/BaseModule";
import { uuid } from "../../util/functions/math";
import Dom from "../../util/Dom";

const INDEX_DIST = 100 ; 
const COPY_INDEX_DIST = 1; 
const NONE_INDEX = -99999;

const PAGE_DEFAULT_OBJECT = {
    itemType: 'page',
    name: '',
    parentId: '',
    index: 0,
    style: {
        width: '400px',
        height: '300px'
    }
}


const LAYER_DEFAULT_OBJECT = {
    itemType: 'layer',
    name: '',
    index: 0,    
    backgroundColor: '',
    backgroundBlendMode: 'normal',
    parentId: '',
    mixBlendMode: 'normal',
    selected: true,
    visible: true,
    style: {
        x: '0px',
        y: '0px',
        'background-blend-mode' : 'multiply',
        'mix-blend-mode': 'multiply'
    },    
    filters: {}
}

const IMAGE_DEFAULT_OBJECT = {
    itemType: 'image',
    type: 'static',
    fileType: '',       // select file type as imagefile,  png, gif, jpg, svg if type is image 
    index: 0,    
    parentId: '',    
    angle: 90,
    color: 'red',
    radialType: 'circle',
    radialPosition: 'center',
    visible: true,
    backgroundRepeat: null,
    backgroundSize: null,
    backgroundSizeWidth: 0,
    backgroundSizeHeight: 0,
    backgroundOrigin: null, 
    backgroundPosition: null,
    backgroundColor: null,
    backgroundAttachment: null,
    backgroundClip: null
}

const COLORSTEP_DEFAULT_OBJECT = {
    itemType: 'colorstep',
    parentId: '',
    percent: 0,
    color: 'rgba(0, 0, 0, 0)'
}

export const EDITOR_MODE_PAGE = 'page';
export const EDITOR_MODE_LAYER = 'layer-rect';
export const EDITOR_MODE_LAYER_BORDER = 'layer-border';
export const EDITOR_MODE_IMAGE = 'image'; 
export const EDITOR_MODE_IMAGE_LINEAR = 'image-linear'; 
export const EDITOR_MODE_IMAGE_RADIAL = 'image-radial'; 
export const EDITOR_MODE_IMAGE_STATIC = 'image-static'; 
export const EDITOR_MODE_IMAGE_IMAGE = 'image-image'; 


const isUndefined = (value) => {
    return typeof value == 'undefined' || value == null;
}

export default class ItemManager extends BaseModule {

    initialize () {
        super.initialize()

        this.$store.items = {}
        this.$store.selectedId = '' 
        this.$store.selectedMode = 'board';
    }

    afterDispatch () {
        this.$store.emit('changeEditor')
    }

    '*/item/collect/colorsteps' ($store, imageId) {
        return $store.read('/item/map/children', imageId, (colorstep) => {
            var colorstep = $store.read('/clone', $store.items[colorstep.id]);
            delete colorstep.id;
            delete colorstep.parentId;
    
            return colorstep
        })
    }

    '*/item/collect/image/one' ($store, imageId) {
        var image = $store.read('/clone', $store.items[imageId]);
        delete image.id;
        delete image.parentId;

        return {
            image,
            colorsteps: $store.read('/item/collect/colorsteps', imageId)
        }
    }

    '*/item/collect/images' ($store, layerId) {
        return $store.read('/item/map/children', layerId, (image) => {
            return $store.read('/item/collect/image/one', image.id)
        })
    }

    '*/item/collect/layer/one' ($store, layerId) {
        var results = {} 

        if (!$store.items[layerId]) {
            return results; 
        }

        var layer = $store.read('/clone', $store.items[layerId]);
        delete layer.id;
        delete layer.parentId;

        return {
            layer,
            images: $store.read('/item/collect/images', layerId)
        }
    }

    '*/item/collect/layers' ($store, pageId) {
        return $store.read('/item/map/children', pageId, (layer) => {
            return $store.read('/item/collect/layer/one', layer.id)
        })
    }

    '*/item/collect/page' ($store, pageId) {
        var results = {} 

        if (!$store.items[pageId]) {
            return results; 
        }

        var page = $store.read('/clone', $store.items[pageId]);
        delete page.id;
        delete page.parentId;

        return {
            page,
            layers: $store.read('/item/collect/layers', pageId)
        }

    }

    '*/item/create/object' ($store, obj, defaultObj = {}) {
        obj = Object.assign({}, $store.read('/clone', defaultObj), obj);         
        obj.id = Date.now() + '-' + uuid();

        $store.items[obj.id] = obj;

        return obj.id; 
    }

    '*/item/create/page' ($store, obj = {}) {
        return $store.read('/item/create/object', obj, PAGE_DEFAULT_OBJECT);
    }

    '*/item/create/layer' ($store, obj = {}) {
        return $store.read('/item/create/object', obj, LAYER_DEFAULT_OBJECT);
    }
    
    '*/item/create/image' ($store, obj = {}) {

        var imageId = $store.read('/item/create/object', obj, IMAGE_DEFAULT_OBJECT);

        if (obj.type == 'static') {
 
        } else if (obj.type == 'image') {

        } else if (obj.type == 'linear') {
            $store.read('/item/create/colorstep', {parentId: imageId, color: 'rgba(0, 0, 0, 0)', percent: 0});
            $store.read('/item/create/colorstep', {parentId: imageId, color: 'rgba(0, 0, 0, 1)', percent: 100});
        } else if (obj.type == 'radial') {
            $store.read('/item/create/colorstep', {parentId: imageId, color: 'rgba(0, 0, 0, 0)', percent: 0});
            $store.read('/item/create/colorstep', {parentId: imageId, color: 'rgba(0, 0, 0, 1)', percent: 100});
        } else if (obj.type == 'repeating-linear') {
            $store.read('/item/create/colorstep', {parentId: imageId, color: 'rgba(0, 0, 0, 0)', percent: 0});
            $store.read('/item/create/colorstep', {parentId: imageId, color: 'rgba(0, 0, 0, 1)', percent: 10});
        } else if (obj.type == 'repeating-radial') {
            $store.read('/item/create/colorstep', {parentId: imageId, color: 'rgba(0, 0, 0, 0)', percent: 0});
            $store.read('/item/create/colorstep', {parentId: imageId, color: 'rgba(0, 0, 0, 1)', percent: 10});
        }

        return imageId; 
    }    

    '*/item/create/colorstep' ($store, obj = {}) {
        return $store.read('/item/create/object', obj, COLORSTEP_DEFAULT_OBJECT);
    }        

    // 객체를 생성하면 id 만 리턴한다. 
    '*/item/create' ($store, itemType, obj = {}) {
        return $store.read('/item/create/' + itemType, obj);
    }

    '*/item/copy' ($store, id) {
        var copyObject = $store.clone('/item/get', id);

        return $store.read('/item/create', copyObject.itemType, copyObject);
    }    

    '*/item/get' ($store, id) {
        return $store.items[id] || {};
    }

    '*/item/current' ($store) {
        return $store.read('/item/get', $store.selectedId)
    }

    '*/item/current/page' ($store, callback) {
        var item = $store.read('/item/current')
        var path = $store.read('/item/path', item.id);

        var page = $store.read('/item/get', path[path.length-1])

        if (page) {
            if (typeof callback == 'function') callback(page);
            return page; 
        }

        return null; 
    }    


    '*/item/current/layer' ($store, callback) {
        var item = $store.read('/item/current')

        if (item.itemType == 'layer') {
            if (typeof callback == 'function') callback(item)
            return item; 
        } else if (item.itemType == 'image') {
            var layer = $store.read('/item/get', item.parentId);
            if (typeof callback == 'function') callback(layer)
            return layer
        }
        
        return null; 
    }    

    '*/item/is' ($store, itemType) {
        var item = $store.read('/item/current')

        return item.itemType == itemType 
    }

    '*/item/is/page' ($store) {
        return $store.read('/item/is', 'page');
    }

    '*/item/is/layer' ($store) {
        return $store.read('/item/is', 'layer');
    }    

    '*/item/is/image' ($store) {
        return $store.read('/item/is', 'image');
    }        

    '*/item/is/mode' ($store, mode, mode2) {
        return $store.selectedMode == mode || $store.selectedMode == mode2;
    }            

    '*/item/current/image' ($store, callback) {
        var item = $store.read('/item/current')

        if (item && item.itemType == 'image') {
            if (typeof callback == 'function') {
                callback(item);
            } 
            return item; 
        }

        return null; 
    }

    '*/item/keys' ($store) {
        return Object.keys($store.items)
    }

    '*/item/list' ($store, filterCallback) {
        var list = $store.read('/item/keys').filter(filterCallback)

        list.sort( (a, b) => {
            return $store.items[a].index > $store.items[b].index ? 1 : -1;
        })

        return list; 
    }

    '*/item/filter' ($store, filterCallback) {
        return $store.read('/item/list', filterCallback)
    }    

    '*/item/list/page' ($store) {
        return $store.read('/item/filter', function (id) {
            return $store.items[id].itemType == 'page'
        });
    } 

    '*/item/map/page' ($store, callback) {
        return $store.read('/item/filter', function (id) {
            return $store.items[id].itemType == 'page'
        }).map( (id, index) => {
            return callback($store.items[id], index)
        });
    }    

    '*/item/list/children' ($store, parentId) {
        return $store.read('/item/filter', function (id) {
            return $store.items[id].parentId == parentId
        });
    }

    '*/item/map/children' ($store, parentId, callback) {
        return $store.read('/item/filter', function (id) {
            return $store.items[id].parentId == parentId
        }).map(function (id, index) { 
            return callback($store.items[id], index)
        });
    }    

    '*/item/filter/children' ($store, parentId, callback) {
        return $store.read('/item/filter', function (id) {
            return $store.items[id].parentId == parentId
        }).filter(function (id, index) { 
            return callback($store.items[id], index)
        });
    }        

    '*/item/each/children' ($store, parentId, callback) {
        return $store.read('/item/filter', function (id) {
            return $store.items[id].parentId == parentId
        }).forEach(function (id, index) { 
            callback($store.items[id], index)
        });
    }        

    '*/item/traverse' ($store, parentId) {
        var list = $store.read('/item/list/children', parentId);
        
        list.sort( (a, b) => {
            var $a = $store.items[a];
            var $b = $store.items[b];

            if ($a.order == $b.order) {
                
                if (a > b) return 1; 
                if (a < b) return -1;  

                return 0; 
            }
            return $a.order > $b.order ? 1 : -1; 
        })
        
        return list.map(childId => {
            return { id: childId, children: $store.read('/item/traverse', childId)}
        })
    }

    '*/item/tree' ($store) {
        return $store.read('/item/traverse', '');
    }

    '*/item/tree/normalize' ($store, root = [], children = [], depth = 0) {
        var results = [] 

        var list = (root != null ? $store.read('/item/tree') : children);
        list.forEach(item => {
            results.push({ id: item.id, depth })
            results.push(... $store.read('/item/tree/normalize', null, item.children, depth + 1))
        });

        return results; 
    }   
    
    '*/item/path' ($store, id) {
        var results = [id] 
        var targetId = id; 

        do {
            var item = $store.read('/item/get', targetId);

            if (item.parentId == '') {
                results.push(item.id);
                break; 
            } else {
                results.push(item.id);
                targetId = item.parentId
            }

        } while(targetId)
        
        return results;
    }

    '*/item/get/mode' ($store) {
        return $store.selectedMode
    }

    '*/item/get/editMode' ($store) {
        return $store.editMode
    }    

    '*/item/dom' ($store, id) {
        var dom = document.querySelector('[item-layer-id="' + id + '"]');

        if (dom) {
            return new Dom(dom)
        }
    }


    '/item/remove' ($store, id) {
        if (id) {

            var item = $store.read('/item/get', id);

            if (item.parentId) {
                var list = $store.read('/item/list/children', item.parentId);
            } else {
                var list = $store.read('/item/list/page');
            }

            var nextSelectedId = '' 
            for(var i = 0, len = list.length; i < len; i++) {
                var nodeId = list[i]
                if ($store.items[id].index > item.index) {
                    nextSelectedId = nodeId; 
                    break;
                }
            }

            if (nextSelectedId) {
                $store.run('/item/select', nextSelectedId)
            } else {
                if (item.index > 0 ) {
                    for(var i = 0, len = list.length; i < len; i++) {
                        var nodeId = list[i]
                        if ($store.items[nodeId].index == item.index - INDEX_DIST) {
                            nextSelectedId = nodeId; 
                            break;
                        }
                    }

                    if (nextSelectedId) {
                        $store.run('/item/select', nextSelectedId)
                    }                        
                } else {
                    $store.run('/item/select', item.parentId)
                }
            }


            $store.items[id].index = NONE_INDEX;
            $store.read('/item/sort', id);

            if ($store.items[id].backgroundImage) {
                URL.revokeObjectURL($store.items[id].backgroundImage);
            }
            delete $store.items[id]
        }
    }

    '/item/remove/children' ($store, parentId) {
        $store.read('/item/each/children', parentId, (item) => {
            $store.run('/item/remove', item.id);
        })
    }

    '/item/select' ($store, selectedId = '') {
        $store.read('/item/keys').forEach(id => {

            var item = $store.items[id]

            if (item.itemType == 'colorstep') {
                // NOOP 
            } else {
                $store.items[id].selected = id === selectedId; 
            }

        })

        if (selectedId) {
            $store.items[selectedId].selectTime = Date.now();

            $store.selectedId = selectedId;
    
            $store.run('/item/select/mode', $store.items[selectedId].itemType);
        } else {
            $store.selectedId = selectedId
            $store.run('/item/select/mode', 'board');
        }

        var item = $store.items[$store.selectedId]

        if (item.itemType == 'image' && item.type == 'image') {
            $store.emit('selectImage');
        }
    }

    '/item/select/mode' ($store, mode, editMode) {
        $store.selectedMode = mode; 

        if (!editMode) {

            switch(mode) {
            case 'page': 
                editMode = EDITOR_MODE_PAGE;
                break; 
            case 'layer': 
                editMode = EDITOR_MODE_LAYER;
                break; 
            case 'image': 

                var item = $store.items[$store.selectedId];

                switch(item.type) {
                case 'linear':
                case 'repeating-linear':
                    editMode = EDITOR_MODE_IMAGE_LINEAR;    
                    break; 
                case 'radial':
                case 'repeating-radial':
                    editMode = EDITOR_MODE_IMAGE_RADIAL;    
                    break;                     
                case 'static':
                    editMode = EDITOR_MODE_IMAGE_STATIC;    
                    break;                                  
                case 'image':
                    editMode = EDITOR_MODE_IMAGE_IMAGE;    
                    break;
                }
                break; 
            }
        }


        $store.run('/item/select/editMode', editMode)
    }  

    '/item/select/editMode' ($store, editMode) {
        $store.editMode = editMode 
    }

    // 현재 기준으로 editMode 를 변경 
    '/item/switch/editMode' ($store) {

        switch ($store.editMode) {
        case EDITOR_MODE_LAYER: 
            $store.editMode = EDITOR_MODE_LAYER_BORDER;
            break; 
        case EDITOR_MODE_LAYER_BORDER:
            $store.editMode = EDITOR_MODE_LAYER;
            break;
        }

    }

    '/item/set' ($store, obj = {}, isSelected = false) {
        var id = obj.id; 
        $store.items[id] = Object.assign($store.clone('/item/get', id), obj);

        if (isSelected) $store.run('/item/select', id)
    }

    '*/item/add/index' ($store, id, dist = INDEX_DIST) {
        return $store.items[id].index + dist;
    }

    '*/item/next/index' ($store, id) {
        return $store.read('/item/add/index', id, INDEX_DIST + COPY_INDEX_DIST);
    }    

    '*/item/prev/index' ($store, id) {
        return $store.read('/item/add/index', id, -1 * (INDEX_DIST + COPY_INDEX_DIST));
    }   
    
    // initialize items 
    '/item/load' ($store) { }  

    '/item/add' ($store, itemType, isSelected = false, parentId = '') {
        var id = $store.read('/item/create', itemType);
        var item = $store.read('/item/get', id);
        item.parentId = parentId; 

        if (item.itemType == 'layer') {
            var page = $store.read('/item/get', parentId);

            item.style = Object.assign(item.style, page.style)
        }

        item.index = Number.MAX_SAFE_INTEGER; 

        $store.run('/item/set', item, isSelected);
        $store.run('/item/sort', item.id)
    }

    '/item/add/image' ($store, imageType, isSelected = false, parentId = '') {
        var id = $store.read('/item/create/image', { type : imageType });
        var item = $store.read('/item/get', id);
        item.type = imageType; 
        item.parentId = parentId; 
        item.index = Number.MAX_SAFE_INTEGER; 

        $store.run('/item/set', item, isSelected);
        $store.run('/item/sort', id); 
    }    

    '/item/add/image/file' ($store, img, isSelected = false, parentId = '') {
        var id = $store.read('/item/create/image');
        var item = $store.read('/item/get', id);
        item.type = 'image'; 
        item.parentId = parentId; 
        item.index = Number.MAX_SAFE_INTEGER;
        item.colors = img.colors;         
        item.fileType = img.fileType;
        item.backgroundImage = img.url;
        item.backgroundImageDataURI = img.datauri;
        item.backgroundSizeWidth = '100%';

        $store.run('/item/set', item, isSelected);
        $store.run('/item/sort', id); 
    }     

    '/item/set/image/file' ($store, id, img) {
        var item = $store.read('/item/get', id);
        item.type = 'image'; 
        item.colors = img.colors;         
        item.fileType = img.fileType || 'svg';
        item.backgroundImage = img.url;
        item.backgroundImageDataURI = img.datauri;
        item.backgroundSizeWidth = '100%';

        $store.run('/item/set', item);
    }         
    
    '/item/add/image/url' ($store, img, isSelected = false, parentId = '') {
        var id = $store.read('/item/create/image');
        var item = $store.read('/item/get', id);
        item.type = 'image'; 
        item.parentId = parentId; 
        item.index = Number.MAX_SAFE_INTEGER;
        item.colors = img.colors;         
        item.fileType = img.fileType;
        item.backgroundImage = img.url;
        item.backgroundSizeWidth = '100%';

        $store.run('/item/set', item, isSelected);
        $store.run('/item/sort', id); 
    }         

    '/item/add/page' ($store, isSelected = false) {
        var pageId = $store.read('/item/create', 'page');        
        var layerId = $store.read('/item/create', 'layer');
        var imageId = $store.read('/item/create', 'image');

        // 페이지 생성 
        var page = $store.read('/item/get', pageId);
        page.index = Number.MAX_SAFE_INTEGER;  
        $store.run('/item/set', page);

        // 레이어 생성 
        var layer = $store.read('/item/get', layerId);
        layer.parentId = pageId; 

        layer.style = Object.assign({}, layer.style, page.style)        
        $store.run('/item/set', layer);

        // 이미지 생성 
        var image = $store.read('/item/get', imageId);
        image.parentId = layerId; 
        $store.run('/item/set', image, isSelected);        
    }

    '/item/addCopy' ($store, sourceId, isSelected = false) {
        var newItemId = $store.read('/item/copy', sourceId)
        $store.run('/item/move/to', sourceId, newItemId);
    }

    '/item/move/to' ($store, sourceId, newItemId) {

        var currentItem = $store.read('/item/get', sourceId);

        var newItem = $store.read('/item/get', newItemId);
        newItem.index = currentItem.index + COPY_INDEX_DIST;

        $store.run('/item/set', newItem, true);
        $store.run('/item/sort', newItemId);

    }    

    '/item/addCopy/page' ($store, sourceId) {
        var page = $store.read('/item/collect/page', sourceId);
        var newPageId = $store.read('/item/create/object', page.page);

        page.layers.forEach( layer => {
            var newLayerId = $store.read('/item/create/object', Object.assign({}, layer.layer, {parentId: newPageId}));
            layer.images.forEach(image => {
                var newImageId = $store.read('/item/create/object', Object.assign({}, image.image, {parentId: newLayerId}));
                
                image.colorsteps.forEach(step => {
                    $store.read('/item/create/object', Object.assign({}, step, {parentId: newImageId}))
                })
    
            })
    
        })

        $store.run('/item/move/to', sourceId, newPageId);
    }

    '/item/addCopy/layer' ($store, sourceId) {
        var currentLayer = $store.read('/item/get', sourceId);
        var layer = $store.read('/item/collect/layer/one', sourceId);
        var newLayerId = $store.read('/item/create/object', Object.assign({parentId: currentLayer.parentId}, layer.layer));
        layer.images.forEach(image => {
            var newImageId = $store.read('/item/create/object', Object.assign({}, image.image, {parentId: newLayerId}));
            
            image.colorsteps.forEach(step => {
                $store.read('/item/create/object', Object.assign({}, step, {parentId: newImageId}))
            })

        })

        $store.run('/item/move/to', sourceId, newLayerId);        

    }

    '/item/addCopy/image' ($store, sourceId) {
        var currentImage = $store.read('/item/get', sourceId);
        var image = $store.read('/item/collect/image/one', sourceId);
        var newImageId = $store.read('/item/create/object', Object.assign({parentId: currentImage.parentId}, image.image));
        image.colorsteps.forEach(step => {
            $store.read('/item/create/object', Object.assign({}, step, {parentId: newImageId}))
        })
        $store.run('/item/move/to', sourceId, newImageId); 

    }

    '/item/move/next' ($store, id) {
        var item = $store.read('/item/get', id);
        item.index = $store.read('/item/next/index', id);

        $store.run('/item/set', item, item.selected);
        $store.run('/item/sort', id);
    }

    '/item/move/last' ($store, id) {
        var item = $store.read('/item/get', id);
        item.index = Number.MAX_SAFE_INTEGER;

        $store.run('/item/set', item, item.selected);
        $store.run('/item/sort', id);
    }   
    
    '/item/move/first' ($store, id) {
        var item = $store.read('/item/get', id);
        item.index = -1 * COPY_INDEX_DIST;

        $store.run('/item/set', item, item.selected);
        $store.run('/item/sort', id);
    }       

    '/item/move/in' ($store, destId, sourceId) {
        var destItem = $store.read('/item/get', destId);
        var sourceItem = $store.read('/item/get', sourceId);
        sourceItem.index = destItem.index - COPY_INDEX_DIST;

        $store.run('/item/set', sourceItem, true);
        $store.run('/item/sort', sourceId);
    }    

    '/item/move/prev' ($store, id) {
        var item = $store.read('/item/get', id);
        item.index = $store.read('/item/prev/index', id);

        $store.run('/item/set', item, item.selected);
        $store.run('/item/sort', id);
    }

    '/item/sort' ($store, id) {
        var item = $store.read('/item/get', id);

        if (item.parentId) {
            var list = $store.read('/item/list/children', item.parentId);
        } else {
            var list = $store.read('/item/list/page');
        }

        // 필요 없는 index 를 가진 객체는 지운다. 
        list = list.filter(id => {
            return $store.items[id].index != NONE_INDEX
        });

        list.sort( (a, b) => {
            return $store.items[a].index > $store.items[b].index ? 1 : -1;
        })

        list.forEach((id, index) => {
            $store.items[id].index = index * INDEX_DIST
        })
    }

    '/item/set/parent' ($store, id, parentId) {
        $store.items[id] = Object.assign($store.clone('/item/get', id), { parentId });
    }    
}