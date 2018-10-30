import BaseModule from "../../colorpicker/BaseModule";
import { parseParamNumber } from "../../util/filter/functions";
import Dom from "../../util/Dom";

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

    '*/layer/toExport' ($store, layer, withStyle = true) {

        var obj = $store.read('/layer/toCSS', layer, withStyle, null, true) || {};
        obj.position = obj.position || 'absolute';

        return $store.read('/css/toString', obj);
    }    

    '*/layer/make/clip-path' ($store, layer) {

        if (layer.clipPathType == 'circle') {

            if (!layer.clipPathCenter) return ;
            if (!layer.clipPathRadius) return ;

            var width = parseParamNumber(layer.style.width);
            var height = parseParamNumber(layer.style.height);


            var placeCenter = [
                Math.floor(layer.clipPathCenter[0]/width*100) + '%', // centerX 
                Math.floor(layer.clipPathCenter[1]/height*100) + '%' // centerY
            ]
    
            var radiusSize = Math.sqrt(
                Math.pow(layer.clipPathRadius[0] - layer.clipPathCenter[0], 2)  
                + 
                Math.pow(layer.clipPathRadius[1] - layer.clipPathCenter[1], 2)
            )/Math.sqrt(2);
    
            var dist = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))/Math.sqrt(2)
            var radiusPercent = Math.floor(radiusSize / dist * 100) + '%';  
    
            return `circle(${radiusPercent} at ${placeCenter.join(' ')})`;
        } else {
            if (layer.clipPathSvg) {
                return `url(#clippath-${layer.id})`
            }
    
        }

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

    '*/layer/toImageCSS' ($store, layer, isExport = false) {    
        var results = {}
        $store.read('/item/each/children', layer.id, (item)  => {
            var css = $store.read('/image/toCSS', item, isExport);

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

    '*/layer/toStringClipPath' ($store, layer) {
        
        if (['circle'].includes(layer.clipPathType)) return ''; 
        if (!layer.clipPathSvg) return ''; 

        let transform = '';

        if (layer.fitClipPathSize) {
            const widthScale = parseParamNumber(layer.style.width) / layer.clipPathSvgWidth;
            const heightScale = parseParamNumber(layer.style.height) / layer.clipPathSvgHeight;
    
            transform = `scale(${widthScale} ${heightScale})`    
        }

        var $div = new Dom ('div');
        var paths = $div.html(layer.clipPathSvg).$('svg').html();
        var svg = `<svg height="0" width="0"><defs><clipPath id="clippath-${layer.id}" ${transform ? `transform="${transform}"` : ""} >${paths}</clipPath></defs></svg>`

        return svg 
    }

    '*/layer/getClipPath' ($store, layer) {
        var items = $store.read('/item/filter/children', layer.id, function (image) {
            return image.isClipPath
        }).map(id => {
            return $store.items[id]
        })

        return items.length ? items[0] : null;
    }

    '*/layer/toCSS' ($store, layer = null, withStyle = true, image = null, isExport = false) {
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
        css['clip-path'] = $store.read('/layer/make/clip-path', layer);

        var results = Object.assign(css, 
             (image) ? $store.read('/layer/image/toImageCSS', image) : $store.read('/layer/toImageCSS', layer, isExport)
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