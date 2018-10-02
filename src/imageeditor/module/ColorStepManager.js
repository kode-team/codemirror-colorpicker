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

    '/colorstep/create' ($store, obj) {
        if (obj) {
            obj = $store.read('/clone', obj)
        } else {
            obj = $store.read('/clone', defaultObject)
        }

        return obj;
    }
    '/colorstep/initColor' ($store, color) {
        $store.dispatch('/tool/setColorSource',INIT_COLOR_SOURCE);
        $store.dispatch('/tool/changeColor', color);
    }

    '/colorstep/colorSource' ($store) {
        return INIT_COLOR_SOURCE
    }

    '/colorstep/current' ($store, index) {
        if (!isUndefined(index)) {
            return $store.read('/colorstep/list')[index] || $store.read('/colorstep/create')
        } else {
            return $store.read('/colorstep/list').filter(item => !!item.selected)[0]
        }
    }

    '/colorstep/currentIndex' ($store, index) {
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
    '/colorstep/get' ($store, colorStepOrKey, key) {

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
    '/colorstep/list' ($store, imageIndex) {
        var image = $store.read('/image/current', imageIndex)

        if (image) {
            return image.colorsteps || []; 
        }

        return []
    }

    // 이미지 변경하기 
    '/colorstep/change' ($store, newColorStep, index) {
        // 현재 image 설정 
        // 현재 layer 설정 
        $store.dispatch('/colorstep/set', newColorStep, index);

        $store.emit('changeLayer')
    }        

    // 이미지 설정하기 , 이벤트 까지 
    '/colorstep/set' ($store, newColorStep, index) {
        var current = $store.read('/colorstep/current', index)
        Object.assign(current, newColorStep);
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

    '/colorstep/add' ($store, percent) {
        var steps = [...$store.read('/colorstep/list')];

        if (!steps.length) {
            var color = 'rgba(0, 0, 0, 1)';
            $store.dispatch('/colorstep/setAll', [{color: 'rgba(0, 0, 0, 1)', percent}, {color: 'rgba(0, 0, 0, 0)', percent: 100}]);
            return;             
        }
        
        if (percent < steps[0].percent) {
            var color = steps[0].color;
            $store.dispatch('/colorstep/setAll', [{color, percent}, ...steps]);
            return; 
        }

        if (steps[steps.length -1].percent < percent) {
            var color = steps[steps.length -1].color;
            $store.dispatch('/colorstep/setAll', [...steps, {color, percent}]);
            return; 
        }        
       
        for(var i = 0, len = steps.length - 1; i < len; i++) {
            var step = steps[i];
            var nextStep = steps[i+1];

            if (step.percent <= percent && percent <= nextStep.percent) {
                var color = Color.mix(step.color, nextStep.color, (percent - step.percent)/(nextStep.percent - step.percent), 'rgb');

                steps.splice(i + 1, 0, {color, percent});

                $store.dispatch('/colorstep/setAll', steps);
                break; 
            }
        }
    }    

    '/colorstep/remove' ($store, index) {
        var colorsteps = $store.read('/colorstep/list');
        index  = $store.read('/colorstep/currentIndex', index);

        if (colorsteps[index]) {
            colorsteps.splice(index, 1);

            if (colorsteps.length - 1 > index) {
                colorsteps[index].selected = true; 
            }

            $store.emit('initLayer') 
        }
    }

}