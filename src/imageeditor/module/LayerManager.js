import BaseModule from "../../colorpicker/BaseModule";

const defaultObject = {
    name: '',
    backgroundColor: '',
    backgroundBlendMode: '',
    mixBlendMode: '',
    selected: true,
    visible: true,
    images: [],
    filters: []
}


const isUndefined = (value) => {
    return typeof value == 'undefined' || value == null;
}

export default class LayerManager extends BaseModule {

    initialize () {
        super.initialize()

        this.$store.layers = []  
    }

    // 이미지 리스트 얻어오기 
    '/layer/list' ($store) {
        return $store.layers || []
    }

    '/layer/create' ($store, obj) {
        if (obj) {
            obj = $store.read('/clone', obj)
        } else {
            obj = $store.read('/clone', defaultObject)
        }

        return obj;
    }

    '/layer/current' ($store, index) {
        if (!isUndefined(index)) {
            return $store.read('/layer/list')[index] || $store.read('/layer/create')
        } else {

            var selectedList = $store.read('/layer/list').filter(item => !!item.selected);

            if (selectedList.length) {
                return selectedList[0]
            } else {
                if ($store.layers[0]) {
                    $store.layers[0].selected = true 
                }

                return $store.layers[0] || $store.read('/layer/create')
            }
        }
    }

    '/layer/currentIndex' ($store, index) {
        if (isUndefined(index)) {
            var selectedList = $store.read('/layer/list').map((layer, i) => { 
                return {layer, index: i }
            }).filter(item => {
                return !!item.layer.selected
            })

            return selectedList.length ? selectedList[0].index : 0; 
        } else {
            return index; 
        }
    }       

    // 레이어 얻어오기 
    '/layer/get' ($store, layerOrKey, key) {

        var current = $store.read('/layer/current');
        if (arguments.length == 1) {
            return current
        } else if (arguments.length == 2) {
            if (!isUndefined(current[layerOrKey])) {
                return current[layerOrKey]
            }
        } else if (arguments.length == 3) {
            if ( layerOrKey && !isUndefined(layerOrKey[key])) {
                return layerOrKey[key];
            } else if (!isUndefined(current[key])) {
                return current[key]
            }
        }
    }


    // 이미지 변경하기 
    '/layer/change' ($store, newLayer, index) {
        // 현재 image 설정 
        // 현재 layer 설정 
        $store.dispatch('/layer/set', newLayer, index)

        $store.emit('changeLayer')
    }        
    '/layer/toggle/visible' ($store, index) {
        var visible = $store.read('/layer/current', index).visible;

        $store.dispatch('/layer/change', { visible: !visible }, index)
    }

    // 이미지 설정하기 , 이벤트 까지 
    '/layer/set' ($store, newLayer, index) {
        var current = $store.read('/layer/current', index)
        current = Object.assign({}, current, newLayer);

        var currentIndex = $store.read('/layer/currentIndex', index);
        $store.layers[currentIndex] = current;
    }    

    '/layer/remove' ($store, index) {
        var layers = $store.layers; 
        index  = $store.read('/layer/currentIndex', index);

        if (layers[index]) {
            layers.splice(index, 1);

            $store.dispatch('/layer/select', index);
        }
    }


    '/layer/set/image' ($store, image, imageIndex) {
        var current = $store.read('/layer/current')
 
        current.images[imageIndex] = $store.read('/clone', image); 

        $store.dispatch('/layer/change', current)
    }


    '/layer/select' ($store, selectedIndex) {
        var list = $store.read('/layer/list');
        
        list.forEach( (layer, index) => {
            layer.selected = index === selectedIndex;
        })

        $store.emit('changeLayer')
    }

    '/layer/add' ($store, newLayer = null) {
        $store.layers.push($store.read('/layer/create', newLayer || $store.read('/layer/current')) )

        $store.dispatch('/layer/select', $store.layers.length - 1);
    }    

    '/layer/toString' ($store, layer) {

        layer = layer || $store.read('/layer/current');

        var obj = $store.read('/layer/toCSS', layer) || {};

        return Object.keys(obj).map(key => {
            return `${key}: ${obj[key]};`
        }).join(' ')
    }

    '/layer/toImageCSS' ($store, layer) {    
        layer = layer || $store.read('/layer/get')

        var results = {} 
        layer.images.forEach(image => {
            var css = $store.read('/image/toCSS', image);

            Object.keys(css).forEach(key => {
                if (!results[key]) {
                    results[key] = [] 
                }

                results[key].push(css[key]);
            })
        });

        Object.keys(results).forEach(key => {
            if (Array.isArray(results[key])) {
                results[key] = results[key].join(', ')
            }
        })

        return results; 
    }

    '/layer/toCSS' ($store, layer = null) {
        layer = layer || $store.read('/layer/get')

        var css = {} 

        if (layer.backgroundColor) {
            css['background-color'] = layer.backgroundColor; 
        } 

        if (layer.backgroundBlendMode) {
            css['background-blend-mode'] = layer.backgroundBlendMode || ""
        } 
        
        if (layer.mixBlendMode) {
            css['mix-blend-mode'] = layer.mixBlendMode || ""
        }

        var results = Object.assign(css, $store.read('/layer/toImageCSS', layer))

        var realCSS = {}
        Object.keys(results).filter(key => {
            return !!results[key]
        }).forEach(key => {
            realCSS[key] = results[key]
        })

        return realCSS; 
    }

}