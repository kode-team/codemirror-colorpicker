import BaseModule from "../../colorpicker/BaseModule";

const DEFINED_ANGLES = {
    'to top': 0,
    'to top right': 45,    
    'to right': 90,
    'to bottom right': 135,    
    'to bottom': 180,
    'to bottom left': 225,    
    'to left': 270,
    'to top left' : 315

}

const DEFINED_DIRECTIONS = {
    '0' : 'to top',
    '45': 'to top right',    
    '90': 'to right',
    '135': 'to bottom right',        
    '180': 'to bottom',
    '225': 'to bottom left',            
    '270': 'to left',
    '315': 'to top left'
}

const DEFINED_POSITIONS = {
    'center' : true, 
    'top' : true, 
    'left' : true, 
    'right' : true,
    'bottom' : true 
}


const defaultObject = {
    type: 'static',
    angle: 90,
    color: 'red',
    colorsteps: [],
    radialType: 'circle',
    radialPosition: 'center',
    visible: true,
    backgroundRepeat: null,
    backgroundSize: null,
    backgroundOrigin: null, 
    backgroundPosition: null,
    backgroundColor: null,
    backgroundAttachment: null,
    backgroundClip: null
}

const isUndefined = (value) => {
    return typeof value == 'undefined' || value == null;
}

export default class ImageManager extends BaseModule {

    id () {
        return 'image'
    }

    '/image/create' ($store, obj) {
        if (obj) {
            obj = $store.read('/clone', obj)
        } else {
            obj = $store.read('/clone', defaultObject)
        }

        return obj;
    }

    '/image/current' ($store, index) {
        if (!isUndefined(index)) {
            return $store.read('/image/list')[index] || $store.read('/image/create')
        } else {
            return $store.read('/image/list').filter(item => !!item.selected)[0]
        }
    }

    '/image/currentIndex' ($store, index) {
        if (isUndefined(index)) {
            return $store.read('/image/list').map((image, index) => { 
                return {image, index }
            }).filter(item => {
                return !!item.image.selected
            })[0].index
        } else {
            return index; 
        }
    }    

    // 이미지 얻어오기 
    '/image/get' ($store, imageOrKey, key) {

        if (arguments.length == 1) {
            return $store.read('/image/current');
        } else if (arguments.length == 2) {
            var current = $store.read('/image/current');
            if (current && !isUndefined(current[imageOrKey])) {
                return current[imageOrKey]
            }
        } else if (arguments.length == 3) {
            var current = $store.read('/image/current');            
            if ( imageOrKey && !isUndefined(imageOrKey[key])) {
                return imageOrKey[key];
            } else if (current && !isUndefined(current[key])) {
                return current[key]
            }
        }
    }

    // 이미지 리스트 얻어오기 
    '/image/list' ($store) {
        return $store.read('/layer/get', 'images') || []
    }

    // 이미지 변경하기 
    '/image/change' ($store, newImage, index) {
        // 현재 image 설정 
        // 현재 layer 설정 
        $store.dispatch('/image/set', newImage, index);
    }       

    '/image/change/color' ($store, color) {
        if ($store.read('/image/isStaticType')) {
            $store.dispatch('/tool/changeColor', color)
            $store.dispatch('/image/change', { color })
        }
    }

    '/image/toggle/visible' ($store, index) {
        var current = $store.read('/image/current', index)

        current.visible = !current.visible

        $store.dispatch('/image/change', current, index)
    }

    // 이미지 설정하기 , 이벤트 까지 
    '/image/set' ($store, newImage, index) {

        var current = $store.read('/image/current', index);
        current = Object.assign({}, current, newImage)

        var currentIndex = $store.read('/image/currentIndex', index)


        if (current.type == 'image' ) {  }
        else if (current.type == 'static') { }
        else {
            // gradient type 일 때 colorsteps 이 없으면 자동으로 셋팅해준다. 
            if (!current.colorsteps.length) {
                current.colorsteps = [
                    { color: 'red', percent: 0 },
                    { color: 'black', percent: 100 }
                ]
            }
        }

        $store.dispatch('/layer/set/image', current, currentIndex)

    }


    '/image/setAngle' ($store, angle = '') {
        angle = typeof DEFINED_ANGLES[angle] != 'undefined' ? DEFINED_ANGLES[angle] : ( +angle % 360);

        $store.dispatch('/image/change', { angle })
    }

    '/image/setRadialPosition' ($store, radialPosition = '') {
        $store.dispatch('/image/change', { radialPosition })
    }

    '/image/setRadialType' ($store, radialType = '') {
        $store.dispatch('/image/change', { radialType })
    }    


    '/image/select' ($store, selectedIndex) {
        var images = $store.read('/image/list');
        
        images.forEach( (image, index) => {
            image.selected = index === selectedIndex;; 
        })

        $store.dispatch('/layer/change', { images })
    }

    '/image/add' ($store, newImage = null) {
        
        var images = $store.read('/clone', $store.read('/layer/get', 'images') || [])

        images.forEach(img => {
            img.selected = false; 
        })

        if (newImage) {
            images.push(newImage);
        } else {
            var current = $store.read('/image/current') || $store.read('/image/create')
            images.push($store.read('/clone', current));
        }

        images[images.length-1].selected = true ;

        $store.dispatch('/layer/change', { images })
    }    

    '/image/remove' ($store, index) {
        var images = $store.read('/layer/get', 'images')
        index  = $store.read('/image/currentIndex', index);

        if (images[index]) {
            images.splice(index, 1);

            if (images.length - 1 > index) {
                images[index].selected = true; 
            }

            $store.emit('initLayer') 
        }
    }

    '/image/right' ($store, index) {
        var images = $store.read('/image/list')
        var currentIndex = $store.read('/image/currentIndex', index)
        var nextIndex = (currentIndex + 1) % images.length; 

        $store.dispatch('/image/swap', currentIndex, nextIndex)
    }

    '/image/last' ($store, index) {
        var images = $store.read('/image/list')
        var currentIndex = $store.read('/image/currentIndex', index)
        var nextIndex = images.length - 1; 

        $store.dispatch('/image/swap', currentIndex, nextIndex)
    }    

    '/image/left' ($store, index) {
        var images = $store.read('/image/list')
        var currentIndex = $store.read('/image/currentIndex', index)
        var prevIndex = (currentIndex - 1); 

        if (prevIndex < -1) {
            prevIndex = images.length - 1; 
        }

        $store.dispatch('/image/swap', currentIndex, prevIndex)
    }    

    '/image/first' ($store, index) {
        var currentIndex = $store.read('/image/currentIndex', index)
        var prevIndex = 0; 

        $store.dispatch('/image/swap', currentIndex, prevIndex)
    }        

    '/image/swap' ($store, startIndex, endIndex) {
        var images = $store.read('/image/list')

        if (images[endIndex]) {
            var current = images[startIndex];
            images[startIndex] = images[endIndex]; 
            images[endIndex] = current

            $store.dispatch('/layer/change', { images })
        }
    }

    '/image/isGradientType' ($store) {
        return $store.read('/image/isLinearType') || $store.read('/image/isRadialType');
    }

    '/image/isLinearType' ($store) {
        return ['linear', 'repeating-linear'].includes($store.read('/image/get', 'type'))
    }

    '/image/isRadialType' ($store) {
        return ['radial', 'repeating-radial'].includes($store.read('/image/get', 'type'))
    }    

    '/image/isImageType' ($store) {
        return ['image'].includes($store.read('/image/get', 'type'))
    }

    '/image/isStaticType' ($store) {
        return ['static'].includes($store.read('/image/get', 'type'))
    }    

    '/image/angle' ($store, angle = '') {
        return DEFINED_ANGLES[angle] || angle || $store.read('/image/get', 'angle');
    }

    '/image/radialPosition' ($store, position = '') {
        return position || $store.read('/image/get', 'radialPosition');
    }

    '/image/toCSS' ($store, image = null) {
        image = image || $store.read('/image/get')

        var results = {} 
        var backgroundImage = $store.read('/image/toImageString', image)

        if (backgroundImage) {
            results['background-image'] = backgroundImage;  // size, position, origin, attachment and etc 
        }

        return results
    }

    '/image/toString' ($store, image = null) {
        image = image || $store.read('/image/get')
        var obj = $store.read('/image/toCSS', image)

        return Object.keys(obj).map(key => {
            return `${key}: ${obj[key]};`
        }).join(' ')

    } 

    '/image/toImageString' ($store, image = null) {
        var type = $store.read('/image/get', image, 'type')

        if (type == 'linear' || type == 'repeating-linear') {
            return $store.read('/image/toLinear', image)
        } else if (type == 'radial' || type == 'repeating-radial') {
            return $store.read('/image/toRadial', image)
        } else if (type == 'image' ) {
            return $store.read('/image/toImage', image)
        } else if (type == 'static' ) {
            return $store.read('/image/toStatic', image)
        }
    }

    '/image/toItemString' ($store, image = undefined ) {

        if (!image) return '';


        var colorsteps = $store.read('/image/get', image, 'colorsteps');

        if (!colorsteps) return '';

        var colors = [...colorsteps]

        if (!colors.length) return ''; 
        
        colors.sort((a, b) => {
            if (a.percent == b.percent) return 0;
            return a.percent > b.percent ? 1 : -1;
        })
        
        colors = colors.map(f => {
            return `${f.color} ${f.percent}%`
        }).join(',')

        return colors; 
    }

    '/image/toLinear' ($store, image = {}) {
        var colors = $store.read('/image/toItemString', image)

        if (colors == '') return '' 

        var opt = ''
        var angle = $store.read('/image/get', image, 'angle')
        var gradientType = $store.read('/image/get', image, 'type')

        opt = angle;

        if (typeof opt === 'number') {
            opt = DEFINED_DIRECTIONS[`${opt}`] || opt 
        }

        if (typeof opt === 'number') {
            opt = opt > 360 ? opt % 360 : opt;
            
            opt = `${opt}deg`
        }

        return `${gradientType}-gradient(${opt}, ${colors})`
    }

    '/image/toStatic' ($store, image = {}) {
        return $store.read('/image/toLinear', {
            type: 'linear',
            angle: 0,
            colorsteps: [ 
                { color: image.color, percent: 0} ,
                { color: image.color, percent: 100} ,
            ]
        })
    }

    '/image/toLinearRight' ($store) {
        return $store.read('/image/toLinear', { type: 'linear', angle : 'to right'})
    }

    '/image/toRadial' ($store, image = {}) {
        var colors = $store.read('/image/toItemString', image)

        if (colors == '') return '' 
        var opt = ''
        var radialType = $store.read('/image/get', image, 'radialType') ;
        var radialPosition = $store.read('/image/get', image, 'radialPosition') ;
        var gradientType = $store.read('/image/get', image, 'type')

        radialPosition = (DEFINED_POSITIONS[radialPosition]) ? radialPosition : radialPosition.join(' ')

        opt = radialPosition ? `${radialType} at ${radialPosition}` : radialType;

        return `${gradientType}-gradient(${opt}, ${colors})`
    }

    '/image/toImage' ($store, image = null) {
        var url = $store.read('/image/get', image, 'url') || ''  

        if (url) {
            return `url(${url})`
        }
        
        return null;
    }
}