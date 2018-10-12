import BaseModule from "../../colorpicker/BaseModule";

export default class LayerManager extends BaseModule {
   
    '*/layer/toString' ($store, layer, withStyle = true, image = null) {

        var obj = $store.read('/layer/toCSS', layer, withStyle, image) || {};

        if (image) {
            delete obj['background-color'];
            delete obj['background-blend-mode'];
            delete obj['mix-blend-mode'];
        }

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