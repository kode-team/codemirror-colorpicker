import BaseModule from "../../colorpicker/BaseModule";
import gradientList from './gradients/index';
import ColorList from "./color-list/index";

export default class GradientManager extends BaseModule {

    afterDispatch( ) {
        this.$store.emit('changeEditor')
    }
 
    '*/gradient/list/sample' ($store, type = 'all') {

        var results = [] 

        if (type == 'all') {
            results.push(...gradientList.map(it => {
                return Object.assign({}, it)
            }));

            results.push( { 
                type: 'static', 
                color: ColorList.list['material'][0]
            })

        } else {
            results.push(...ColorList.list['material'].map(color => {
                return Object.assign({}, { type: 'static', color})
            }))
        }

        return results;
    }

    '/gradient/image/select' ($store, obj) {
        var image = $store.read('/item/current/image')

        if (image) {

            $store.run('/item/remove/children', image.id);

            image = Object.assign({}, image, obj);

            if (image.colorsteps) {

                if (typeof image.colorsteps[0].index == 'undefined') {
                    image.colorsteps.sort((a, b) => {

                        var aValue  = $store.read('/image/get/stepValue', a);
                        var bValue  = $store.read('/image/get/stepValue', b);

                        if (aValue == bValue) return 0; 

                        return aValue > bValue ? 1 : -1; 
                    })
                } else {
                    image.colorsteps.sort((a, b) => {

                        var aValue  = a.index;
                        var bValue  = b.index;

                        if (aValue == bValue) return 0; 

                        return aValue > bValue ? 1 : -1; 
                    })
                }

                image.colorsteps.forEach( (step, index) => {
                    step.parentId = image.id; 
                    step.index = index * 100; 
                    $store.read('/item/create/colorstep', step);
                })
                // 기존 데이타를 변경 후에 colorsteps 는 지운다. 
                delete image.colorsteps;
            }

            $store.run('/item/set', image);
        } else {
            $store.read('/item/current/layer', (layer) => {
                layer.style['background-color'] = obj.color;
                $store.run('/item/set', layer);
            })

        }
    }

    '/gradient/image/add' ($store, obj) {
        var image = $store.read('/item/current/image')

        if (image) {

            // $store.run('/item/remove/children', image.id);

            var newImageId = $store.read('/item/create/object', Object.assign({}, image, obj));            
            var newImage = $store.read('/item/get', newImageId);
            newImage.index -= 1; 

            if (newImage.colorsteps) {

                if (typeof newImage.colorsteps[0].index == 'undefined') {
                    newImage.colorsteps.sort((a, b) => {

                        var aValue  = $store.read('/image/get/stepValue', a);
                        var bValue  = $store.read('/image/get/stepValue', b);

                        if (aValue == bValue) return 0; 

                        return aValue > bValue ? 1 : -1; 
                    })
                } else {
                    newImage.colorsteps.sort((a, b) => {

                        var aValue  = a.index; 
                        var bValue  = b.index;

                        if (aValue == bValue) return 0; 

                        return aValue > bValue ? 1 : -1; 
                    })
                }

                newImage.colorsteps.forEach( (step, index) => {
                    step.parentId = newImage.id; 
                    step.index = index * 100; 
                    $store.read('/item/create/colorstep', step);
                })
                // 기존 데이타를 변경 후에 colorsteps 는 지운다. 
                delete newImage.colorsteps;
            }

            $store.run('/item/move/in', image.id, newImage.id);
            
        } else {
            // $store.read('/item/current/layer', (layer) => {
            //     layer.style['background-color'] = obj.color;
            //     $store.run('/item/set', layer);
            // })

        }
    }    

    '/gradient/select' ($store, type, index) {
        var obj = $store.read('/gradient/list/sample', type)[index] 

        if (obj) {
            $store.run('/gradient/image/select', obj);
        }
    }

    '/gradient/add' ($store, type, index) {
        var obj = $store.read('/gradient/list/sample', type)[index] 

        if (obj) {
            $store.run('/gradient/image/add', obj);
        }
    }



}