import BaseModule from "../../colorpicker/BaseModule";
import Color from "../../util/Color";


const defaultObject = {
    color: 'rgba(0, 0, 0, 0)',
    percent: 0,
    selected: false 
}

const isUndefined = (value) => {
    return typeof value == 'undefined' || value == null;
}

const INIT_COLOR_SOURCE = 'colorstep'

export default class ColorStepManager extends BaseModule {

    '*/colorstep/create' ($store, obj) {
        if (obj) {
            obj = $store.clone(obj)
        } else {
            obj = $store.clone(defaultObject)
        }

        return obj;
    }

    '*/colorstep/colorSource' ($store) {
        return INIT_COLOR_SOURCE
    }

    '*/colorstep/current' ($store, index) {
        if (!isUndefined(index)) {
            return $store.read('/colorstep/list')[index] || $store.read('/colorstep/create')
        } else {
            return $store.read('/colorstep/list').filter(item => !!item.selected)[0]
        }
    }

    '*/colorstep/currentIndex' ($store, index) {
        if (isUndefined(index)) {
            return $store.read('/colorstep/list').map((step, index) => { 
                return {step, index }
            }).filter(item => {
                return !!item.step.selected
            })[0].index
        } else {
            return index; 
        }
    }    

    // 이미지 얻어오기 
    '*/colorstep/get' ($store, colorStepOrKey, key) {

        var current = $store.read('/colorstep/current');
        if (arguments.length == 1) {
            return current
        } else if (arguments.length == 2) {
            if (!isUndefined(current[colorStepOrKey])) {
                return current[colorStepOrKey]
            }
        } else if (arguments.length == 3) {
            if ( colorStepOrKey && !isUndefined(colorStepOrKey[key])) {
                return colorStepOrKey[key];
            } else if (!isUndefined(current[key])) {
                return current[key]
            }
        }
    }

    // 이미지 리스트 얻어오기 
    '*/colorstep/list' ($store, imageIndex) {
        var image = $store.read('/image/current', imageIndex)

        if (image) {
            return image.colorsteps || []; 
        }

        return []
    }

    '/colorstep/initColor' ($store, color) {
        $store.dispatch('/tool/setColorSource',INIT_COLOR_SOURCE);
        $store.dispatch('/tool/changeColor', color);
    }


    // 이미지 변경하기 
    '/colorstep/change' ($store, newColorStep, index) {
        // 현재 image 설정 
        // 현재 layer 설정 
        $store.dispatch('/colorstep/set', newColorStep, index);
    }        

    // 이미지 설정하기 , 이벤트 까지 
    '/colorstep/set' ($store, newColorStep, index) {
        var current = $store.read('/colorstep/current', index)
        Object.assign(current, newColorStep);

        var colorsteps = $store.read('/colorstep/list');

        $store.dispatch('/image/change', { colorsteps })
    }


    '/colorstep/select' ($store, selectedIndex) {
        var colorsteps = $store.read('/colorstep/list');
        
        colorsteps.forEach( (step, index) => {
            step.selected = selectedIndex === index;
        })

        $store.dispatch('/colorstep/setAll', colorsteps);

    }


    '/colorstep/setStep' ($store, color, percent, index) {
        var current = $store.read('/colorstep/current', index)

        if (typeof color != 'undefined') {
            current.color = color; 
        }

        if (typeof percent != 'undefined') {
            current.percent = percent; 
        }

        var colorsteps = $store.read('/colorstep/list')

        $store.dispatch('/colorstep/setStepAll', colorsteps);
    }

    '/colorstep/setAll' ($store, colorsteps = []) {
        $store.dispatch('/image/change', { colorsteps });
    }

    '/colorstep/add' ($store, item, percent) {

        var list = $store.read('/item/list/children', item.id)

        if (!list.length) {

            $store.read('/item/create/colorstep', {parentId: item.id, color: 'rgba(0, 0, 0, 0)', percent});
            $store.read('/item/create/colorstep', {parentId: item.id, color: 'rgba(0, 0, 0, 1)', percent: 100});

            $store.dispatch('/item/set', item);
            return; 
        }

        var colorsteps = list.map(id => {
            return $store.items[id]
        })
    
        if (percent < colorsteps[0].percent) {

            $store.read('/item/create/colorstep', {parentId: item.id, color: colorsteps[0].color, percent});
            $store.dispatch('/item/set', item);
            return;             
        }

        if (colorsteps[colorsteps.length -1].percent < percent) {
            var color = colorsteps[colorsteps.length -1].color;         

            $store.read('/item/create/colorstep', {parentId: item.id, color, percent});

            $store.dispatch('/item/set', item);
            return;             
        }        
       
        for(var i = 0, len = colorsteps.length - 1; i < len; i++) {
            var step = colorsteps[i];
            var nextStep = colorsteps[i+1];

            if (step.percent <= percent && percent <= nextStep.percent) {
                var color = Color.mix(step.color, nextStep.color, (percent - step.percent)/(nextStep.percent - step.percent), 'rgb');

                $store.read('/item/create/colorstep', {parentId: item.id, color, percent});

                $store.dispatch('/item/set', item);            
                return; 
            }
        }
    }    

    '/colorstep/remove' ($store, id) {

        var parentId = $store.read('/item/get', id).parentId; 
        var image = $store.read('/item/get', parentId);

        $store.dispatch('/item/remove', id);

        $store.dispatch('/item/set', image);
    }

}