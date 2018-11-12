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

    initialize () {
        super.initialize() 

        this.$store.step = {
            width: 400
        }
    }

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

    '/colorstep/add' ($store, item, percent) {

        var list = $store.read('/item/list/children', item.id)

        if (!list.length) {

            $store.read('/item/create/colorstep', {parentId: item.id, color: 'rgba(0, 0, 0, 0)', percent, index: 0});
            $store.read('/item/create/colorstep', {parentId: item.id, color: 'rgba(0, 0, 0, 1)', percent: 100, index: 100});

            $store.dispatch('/item/set', item);
            return; 
        }

        var colorsteps = list.map(id => {
            return $store.items[id]
        })
    
        if (percent < colorsteps[0].percent) {

            colorsteps[0].index = 1; 

            $store.read('/item/create/colorstep', {parentId: item.id, index: 0, color: colorsteps[0].color, percent});
            $store.run('/item/set', colorsteps[0]);
            $store.dispatch('/item/set', item);
            return;             
        }

        if (colorsteps[colorsteps.length -1].percent < percent) {
            var color = colorsteps[colorsteps.length -1].color;  
            var index = colorsteps[colorsteps.length -1].index;         

            $store.read('/item/create/colorstep', {parentId: item.id, index: index + 1,  color, percent});
            $store.dispatch('/item/set', item);
            return;             
        }        
       
        for(var i = 0, len = colorsteps.length - 1; i < len; i++) {
            var step = colorsteps[i];
            var nextStep = colorsteps[i+1];

            if (step.percent <= percent && percent <= nextStep.percent) {
                var color = Color.mix(step.color, nextStep.color, (percent - step.percent)/(nextStep.percent - step.percent), 'rgb');

                $store.read('/item/create/colorstep', {parentId: item.id, index: step.index + 1, color, percent});
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

    '/colorstep/sort' ($store, id, sortedList) {
        
        sortedList.forEach( (stepId, index) => {
            var item = $store.read('/item/get', stepId);
            item.index = index * 100; 
            
            $store.run('/item/set', item);
        })

        $store.run('/item/sort', id);
    }

    '*/colorstep/sort/list' ($store, parentId) {
        var colorsteps = $store.read('/item/map/children', parentId);

        colorsteps.sort( (a, b) => {
            if (a.index == b.index) return 0; 
            return a.index > b.index ? 1 : -1; 
        })

        return colorsteps;
    }

}