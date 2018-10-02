import BaseModule from "../../colorpicker/BaseModule";
import gradientList from './gradients/index';

export default class GradientManager extends BaseModule {

 
    '/gradient/list/sample' ($store) {
        return gradientList.map(it => {
            return Object.assign({}, $store.read('/image/create'), it)
        });
    }

    '/gradient/select' ($store, index) {
        var obj = $store.read('/gradient/list/sample')[index]

        if (obj) {
            $store.read('/image/change', obj)
        }
    }


}