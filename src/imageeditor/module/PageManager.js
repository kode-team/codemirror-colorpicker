import BaseModule from "../../colorpicker/BaseModule";

export default class PageManager extends BaseModule {

    '*/page/toString' ($store, id) {

        var page = $store.read('/item/get', id);
        var obj = $store.read('/page/toCSS', page) || {};

        return Object.keys(obj).map(key => {
            return `${key}: ${obj[key]};`
        }).join(' ')
    }

    '*/page/toCSS' ($store, page = {}) {
        var css = page.style || {} 

        var realCSS = {}
        Object.keys(css).filter(key => {
            return !!css[key]
        }).forEach(key => {
            realCSS[key] = css[key]
        })

        return realCSS; 
    }

    '*/page/cache/toCSS' ($store, page = {}) {
        var css = page.style || {} 

        var realCSS = {}
        Object.keys(css).filter(key => {
            return !!css[key]
        }).forEach(key => {
            realCSS[key] = css[key]
        })
 
        return realCSS; 
    }    

    '*/page/cache/toString' ($store, page) {
        var obj = $store.read('/page/cache/toCSS', page) || {};

        return {
            css: $store.read('/css/toString', obj),
            obj
        }
    }    


}