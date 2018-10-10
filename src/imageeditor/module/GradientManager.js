import BaseModule from "../../colorpicker/BaseModule";
import gradientList from './gradients/index';
import ColorList from "./color-list/index";

export default class GradientManager extends BaseModule {

 
    '*/gradient/list/sample' ($store, type = 'all') {

        var results = [] 

        if (type == 'all') {
            results.push(...gradientList.map(it => {
                return Object.assign({}, it)
            }));

            results.push(...ColorList.list['material'].map(color => {
                return Object.assign({}, { type: 'static', color})
            }))

        } else {
            results.push(...ColorList.list['material'].map(color => {
                return Object.assign({}, { type: 'static', color})
            }))
        }

        return results;
    }

    '/gradient/select' ($store, type, index) {
        var obj = $store.read('/gradient/list/sample', type)[index] 

        if (obj) {
            var image = $store.read('/item/current/image')

            if (image) {
                image = Object.assign({}, image, obj);

                if (image.colorsteps) {
                    image.colorsteps.forEach(step => {
                        step.parentId = image.id; 
                        $store.read('/item/create/colorstep', step);
                    })

                    delete image.colorsteps; 
                }

                $store.dispatch('/item/set', image);
            }
        }
    }


}