import BaseModule from "../../colorpicker/BaseModule";

export default class LayerManager extends BaseModule {
   
    '*/layer/toString' ($store, layer, withStyle = true) {

        var obj = $store.read('/layer/toCSS', layer, withStyle) || {};

        return Object.keys(obj).map(key => {
            return `${key}: ${obj[key]};`
        }).join(' ')
    }

    '*/layer/image/toString' ($store, layer, image, withStyle = true) {

        var obj = $store.read('/layer/image/toCSS', layer, image, withStyle) || {};

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



    '*/layer/image/toCSS' ($store, layer = null, image, withStyle = true) {
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

        if (layer.style['rotate']) {
            css['transform'] = `rotate(${layer.style['rotate']}deg)`
        }
 
        var results = Object.assign(css, $store.read('/layer/image/toImageCSS', image))

        var realCSS = {}
        Object.keys(results).filter(key => {
            return !!results[key]
        }).forEach(key => {
            realCSS[key] = results[key]
        })

        return realCSS; 
    }    

    '*/layer/toCSS' ($store, layer = null, withStyle = true) {
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

        if (layer.style['rotate']) {
            css['transform'] = `rotate(${layer.style['rotate']}deg)`
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