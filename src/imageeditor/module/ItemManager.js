import BaseModule from "../../colorpicker/BaseModule";
import { uuid } from "../../util/functions/math";
import Dom from "../../util/Dom";


const PAGE_DEFAULT_OBJECT = {
    itemType: 'page',
    name: '',
    parentId: '',
    style: {
        width: '200px',
        height: '200px'
    }
}


const LAYER_DEFAULT_OBJECT = {
    itemType: 'layer',
    name: '',
    backgroundColor: '',
    backgroundBlendMode: 'normal',
    parentId: '',
    mixBlendMode: 'normal',
    selected: true,
    visible: true,
    style: {
        x: '0px',
        y: '0px'
    },    
    filters: []
}

const IMAGE_DEFAULT_OBJECT = {
    itemType: 'image',
    type: 'static',
    parentId: '',    
    angle: 90,
    color: 'red',
    radialType: 'circle',
    radialPosition: 'center',
    visible: true,
    backgroundRepeat: null,
    backgroundSize: null,
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
        return $store.read('/item/create/object', obj, IMAGE_DEFAULT_OBJECT);
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
        return $store.read('/item/keys').filter(filterCallback)
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

    '*/item/rect' ($store, id) {
        var dom = document.querySelector('[item-id="' + id + '"]');

        if (dom) {
            return new Dom(dom).rect()
        }
    }


    '/item/remove' ($store, id) {
        if (id) {
            delete $store.items[id];
        } else {
            $store.items = {} 
        }
    }

    '/item/select' ($store, selectedId) {
        $store.read('/item/keys').forEach(id => {

            var item = $store.items[id]

            if (item.itemType == 'colorstep') {
                // NOOP 
            } else {
                $store.items[id].selected = id === selectedId; 
            }

        })

        $store.items[selectedId].selectTime = Date.now();

        $store.selectedId = selectedId;

        $store.run('/item/select/mode', $store.items[selectedId].itemType);
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

    '/item/add' ($store, itemType, isSelected = false, parentId = '') {
        var id = $store.read('/item/create', itemType);
        var item = $store.read('/item/get', id);
        item.parentId = parentId; 

        if (item.itemType == 'layer') {
            var page = $store.read('/item/get', parentId);

            item.style = Object.assign(item.style, page.style)
        }

        $store.run('/item/set', item, isSelected);
    }

    '/item/add/page' ($store, isSelected = false) {
        var pageId = $store.read('/item/create', 'page');        
        var layerId = $store.read('/item/create', 'layer');
        var imageId = $store.read('/item/create', 'image');

        var page = $store.read('/item/get', pageId);
        $store.run('/item/set', page);

        var layer = $store.read('/item/get', layerId);
        layer.parentId = pageId; 

        layer.style = Object.assign({}, layer.style, page.style)        
        $store.run('/item/set', layer);

        var image = $store.read('/item/get', imageId);
        image.parentId = layerId; 
        $store.run('/item/set', image, isSelected);        
    }

    '/item/addCopy' ($store, id, isSelected = false) {
        id = $store.read('/item/copy', id)
        $store.run('/item/set', $store.read('/item/get', id), isSelected);
    }

    '/item/set/parent' ($store, id, parentId) {
        $store.items[id] = Object.assign($store.clone('/item/get', id), { parentId });
    }    
}