import BaseModule from "../../colorpicker/BaseModule";

const filterInfo = {

    'blur': { title: 'Blur', type: 'range', min: 0, max: 100, step: 1, unit: 'px', defaultValue: 0 },
    'grayscale' : { title: 'Grayscale', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 100 },
    'hue-rotate' : { title: 'Hue', type: 'range', min: 0, max: 360, step: 1, unit: 'deg', defaultValue: 0 },
    'invert' : { title: 'Invert', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 0 },    
    'brightness': { title: 'Brightness', type: 'range', min: 0, max: 200, step: 1, unit: '%', defaultValue: 100 },
    'contrast': { title: 'Contrast', type: 'range', min: 0, max: 200, step: 1, unit: '%', defaultValue: 100 },
    'drop-shadow': { 
        title: 'Drop Shadow', 
        type: 'multi',
        items: [
            { title: 'Offset X', type: 'range', min: 0, max: 100, step: 1, defaultValue: 0 },
            { title: 'Offset Y', type: 'range', min: 0, max: 100, step: 1, defaultValue: 0 },
            { title: 'Blur Radius', type: 'range', min: 0, max: 100, step: 1, defaultValue: 0 },
            { title: 'Spread Radius', type: 'range', min: 0, max: 100, step: 1, defaultValue: 0 },
            { title: 'Color', type: 'color', defaultValue: 'black' }
        ]  
    },
    'opacity' : { title: 'Opacity', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 100 },
    'saturate' : { title: 'Saturate', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 100 },
    'sepia' : { title: 'Sepia', type: 'range', min: 0, max: 100, step: 1, unit: '%', defaultValue: 0 },
}

export default class LayerManager extends BaseModule {
   
    '*/layer/filter/list' ($store) {
        return filterInfo;
    }

    '*/layer/get/filter' ($store, id) {
        return filterInfo[id];
    }    

    '*/layer/toString' ($store, layer, withStyle = true, image = null) {

        var obj = $store.read('/layer/toCSS', layer, withStyle, image) || {};

        if (image) {
            delete obj['background-color'];
            delete obj['background-blend-mode'];
            delete obj['mix-blend-mode'];
            delete obj['filter'];
        }

        return Object.keys(obj).map(key => {
            return `${key}: ${obj[key]};`
        }).join(' ')
    }

    '*/layer/make/filter' ($store, filters, defaultDataObject = {}) {        
        return Object.keys(filters).map(id => {
            var dataObject = filters[id] || defaultDataObject;
            
            // 적용하는 필터가 아니면 제외 한다. 
            if (!dataObject.checked) return '';

            var viewObject = $store.read('/layer/get/filter', id);

            var value = dataObject.value; 

            if (typeof value == 'undefined') {
                value = viewObject.defaultValue;
            }

            return `${id}(${value}${viewObject.unit})`
        }).join(' ')
    }

    '*/layer/filter/toString' ($store, layer, filterId = '', onlyFilter = false) {

        if (!layer) return '';
        if (!filterId && !layer.filters) return ''

        var obj = $store.read('/layer/toCSS', layer, true) || { filters: []};
        var filters = {}

        if (!filterId) {
            filters = layer.filters || {}
        } else {
            filters[filterId] = Object.assign({}, layer.filters[filterId] || {})
            filters[filterId].checked = true; 
        } 

        if (onlyFilter) {
            delete obj.width;
            delete obj.height;
            delete obj.left;
            delete obj.top;
        }

        obj.filter = $store.read('/layer/make/filter', filters )

        return Object.keys(obj).map(key => {
            return `${key}: ${obj[key]};`
        }).join(' ')
    }    

    '*/layer/toImageCSS' ($store, layer) {    
        var results = {}
        $store.read('/item/each/children', layer.id, (item)  => {
            var css = $store.read('/image/toCSS', item);

            Object.keys(css).forEach(key => {
                if (!results[key]) {
                    results[key] = [] 
                }

                results[key].push(css[key]);
            })
        })

        Object.keys(results).forEach(key => {
            if (Array.isArray(results[key])) {
                results[key] = results[key].join(', ')
            }
        })

        return results; 
    }

    '*/layer/image/toImageCSS' ($store, image) {    
        var results = {}

        var css = $store.read('/image/toCSS', image);

        Object.keys(css).forEach(key => {
            if (!results[key]) {
                results[key] = [] 
            }

            results[key].push(css[key]);
        })


        Object.keys(results).forEach(key => {
            if (Array.isArray(results[key])) {
                results[key] = results[key].join(', ')
            }
        })

        return results; 
    }    

    '*/layer/make/transform' ($store, layer) {

        var results = [] 

        if (layer.style['rotate']) {
            results.push(`rotate(${layer.style['rotate']}deg)`)
        }

        if (layer.style['skewX']) {
            results.push(`skewX(${layer.style['skewX']}deg)`)
        }        

        if (layer.style['skewY']) {
            results.push(`skewY(${layer.style['skewY']}deg)`)
        }                

        if (layer.style['scale']) {
            results.push(`scale(${layer.style['scale']})`)
        }                        

        if (layer.style['translateX']) {
            results.push(`translateX(${layer.style['translateX']}px)`)
        }                                

        if (layer.style['translateY']) {
            results.push(`translateY(${layer.style['translateY']}px)`)
        }

        if (layer.style['translateZ']) {
            results.push(`translateZ(${layer.style['translateZ']}px)`)
        }

        if (layer.style['rotate3dX'] || layer.style['rotate3dY'] || layer.style['rotate3dZ'] || layer.style['rotate3dA']) {
            results.push(`rotate3d( ${layer.style['rotate3dX']||0}, ${layer.style['rotate3dY']||0}, ${layer.style['rotate3dZ']||0}, ${layer.style['rotate3dA'] || 0}deg  )`);
        }

        if (layer.style['scale3dX'] || layer.style['scale3dY'] || layer.style['scale3dZ']) {
            results.push(`scale3d( ${layer.style['scale3dX'] || 1}, ${layer.style['scale3dY'] || 1}, ${layer.style['scale3dZ'] || 1})`);
        }        

        if (layer.style['translate3dX'] || layer.style['translate3dY'] || layer.style['translate3dZ']) {
            results.push(`translate3d( ${layer.style['translate3dX']||0}px, ${layer.style['translate3dY']||0}px, ${layer.style['translate3dZ']||0}px)`);
        }                

        return results.length ? results.join(' ') : 'none';
    }

    '*/layer/toCSS' ($store, layer = null, withStyle = true, image = null) {
        var css = Object.assign({}, withStyle ? (layer.style || {}) : {});


        if (withStyle) {
            css.left = css.x 
            css.top = css.y
        }

        if (layer.style['background-color']) {
            css['background-color'] = layer.style['background-color']
        }         

        if (layer.style['background-blend-mode']) {
            css['background-blend-mode'] = layer.style['background-blend-mode'] || ""
        } 
        
        if (layer.style['mix-blend-mode']) {
            css['mix-blend-mode'] = layer.style['mix-blend-mode'] || ""
        }

        if (layer.fixedRadius) {
            css['border-radius'] = layer.style['border-radius']
            css['border-top-left-radius'] = ''
            css['border-top-right-radius'] = ''
            css['border-bottom-left-radius'] = ''
            css['border-bottom-right-radius'] = ''  
        } else {

        }

        css['transform'] = $store.read('/layer/make/transform', layer)
        css['filter'] = $store.read('/layer/make/filter', layer.filters);

        var results = Object.assign(css, 
             (image) ? $store.read('/layer/image/toImageCSS', image) : $store.read('/layer/toImageCSS', layer)
        )
        
        var realCSS = {}
        Object.keys(results).filter(key => {
            return !!results[key]
        }).forEach(key => {
            realCSS[key] = results[key]
        })

        return realCSS; 
    }

}