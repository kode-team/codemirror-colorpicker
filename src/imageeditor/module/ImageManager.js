import ImageLoader from '../../util/ImageLoader'
import BaseModule from "../../colorpicker/BaseModule";
import { ImageToRGB, palette } from '../../util/functions/image';
import { get } from '../../util/functions/func';

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


export default class ImageManager extends BaseModule { 
 
    '*/image/get/file' ($store, files, callback, colorCount = 16) {
        (files || []).forEach(file => {
            var fileType = file.name.split('.').pop();
            if (['jpg', 'png', 'gif', 'svg'].includes(fileType)) {

                if (typeof callback == 'function') {
                    new ImageLoader(file).getImage(image => {

                        ImageToRGB(file, { maxWidth: 100 }, (results) => {
                            callback ({
                                datauri: image.src,                 // export 용 
                                colors: palette(results, colorCount),    
                                url: URL.createObjectURL(file),     // 화면 제어용 
                                fileType 
                            })
                            
                        })
                    })

                }
            }
        });
    }

    '*/image/get/url' ($store, urls, callback, colorCount = 16) {
        (urls || []).forEach(url => {
            var fileType = url.split('.').pop();
            if (['jpg', 'png', 'gif', 'svg'].includes(fileType)) {

                if (typeof callback == 'function') {
                    ImageToRGB(url, { maxWidth: 100 }, (results) => {
                        callback ({
                            colors: palette(results, colorCount),    
                            url,
                            fileType 
                        })
                        
                    })
                }
            }
        });
    }    

    '*/image/get/blob' ($store, blobs, callback) {
        (blobs || []).forEach(file => {
            if (typeof callback == 'function') {
                new ImageLoader(file, { 
                    forceDataURI: true
                }).getImage(image => {
                    var url = file; 
                    var svg = ''; 
                    var svgContent = image.src.split('data:image/svg+xml;charset=utf-8;base64,'); 

                    if (svgContent.length > 1) {
                        svg = atob(svgContent[1]);
                    }

                    if (url instanceof Blob) {
                        url = URL.createObjectURL(file)
                    }

                    callback ({
                        datauri: image.src,                 // export 용 
                        url     // 화면 제어용 
                    })
                })
            }
        });
    }    

    '*/image/type/isGradient' ($store, type) {
        return $store.read('/image/type/isLinear', type) || $store.read('/image/type/isRadial', type) || $store.read('/image/type/isConic', type);
    }

    '*/image/type/isNotGradient' ($store, type) {
        return $store.read('/image/type/isGradient', type) == false;
    }    

    '*/image/type/isLinear' ($store, type) {
        return ['linear', 'repeating-linear'].includes(type)
    }

    '*/image/type/isRadial' ($store, type) {
        return ['radial', 'repeating-radial'].includes(type)
    }    

    '*/image/type/isConic' ($store, type) {
        return ['conic', 'repeating-conic'].includes(type)
    }        

    '*/image/type/isImage' ($store, type) {
        return ['image'].includes(type)
    }

    '*/image/type/isStatic' ($store, type) {
        return ['static'].includes(type)
    }    

    '*/image/angle' ($store, angle = '') {
        return typeof DEFINED_ANGLES[angle] == 'undefined' ? angle : (DEFINED_ANGLES[angle] || 0);
    }

    '*/image/radialPosition' ($store, position = '') {
        return position || $store.read('/image/get', 'radialPosition');
    }

    '*/image/toCSS' ($store, image = null, isExport = false) {

        var results = {} 
        var backgroundImage = $store.read('/image/toImageString', image, isExport)
        var backgroundPosition = $store.read('/image/toBackgroundPositionString', image, isExport)
        var backgroundSize = $store.read('/image/toBackgroundSizeString', image, isExport)
        var backgroundRepeat = $store.read('/image/toBackgroundRepeatString', image, isExport)

        if (backgroundImage) {
            results['background-image'] = backgroundImage;  // size, position, origin, attachment and etc 
        }

        if (backgroundSize) {
            results['background-size'] = backgroundSize;
        }

        if (backgroundPosition) {
            results['background-position'] = backgroundPosition;
        }        

        if (backgroundRepeat) {
            results['background-repeat'] = backgroundRepeat;
        }        

        return results
    }

    '*/image/toString' ($store, image = null) {

        var obj = $store.read('/image/toCSS', image)

        return Object.keys(obj).map(key => {
            return `${key}: ${obj[key]};`
        }).join(' ')

    } 

    '*/image/toImageString' ($store, image, isExport = false) {
        var type = image.type

        if (type == 'linear' || type == 'repeating-linear') {
            return $store.read('/image/toLinear', image, isExport)
        } else if (type == 'radial' || type == 'repeating-radial') {
            return $store.read('/image/toRadial', image, isExport)
        } else if (type == 'conic' || type == 'repeating-conic' ) {
            return $store.read('/image/toConic', image, isExport)            
        } else if (type == 'image' ) {
            return $store.read('/image/toImage', image, isExport)
        } else if (type == 'static' ) {
            return $store.read('/image/toStatic', image, isExport)
        }
    }

    '*/image/toBackgroundSizeString' ($store, image) {

        if (image.backgroundSize == 'contain' || image.backgroundSize == 'cover') {
            return image.backgroundSize; 
        } else if (image.backgroundSizeWidth && image.backgroundSizeHeight) {
            return [
                image.backgroundSizeWidth, 
                image.backgroundSizeHeight
            ].join(' ')
        } else if (image.backgroundSizeWidth) {
            return image.backgroundSizeWidth;
        }

        return 'auto'
    }  
    

    '*/image/toBackgroundPositionString' ($store, image) {

        var x = image.backgroundPositionX || 'center';
        var y = image.backgroundPositionY || 'center';

        if (typeof x == 'number') {
            x = x + 'px';
        }

        if (typeof y == 'number') {
            y = y + 'px';
        }

        return [x, y].join(' ')
    }      
    
    '*/image/toBackgroundRepeatString' ($store, image) {
        if (image.backgroundRepeat) {
            return image.backgroundRepeat;
        }
    }       

    '*/image/get/unitValue' ($store, step) {
        if (step.unit == 'px') {
            return step.px + 'px';
        } else if (step.unit == 'em') {
            return step.em + 'em';
        }

        return step.percent + '%'
    }

    '*/image/get/stepValue' ($store, step) {
        if (step.unit == 'px') {
            return step.px;
        } else if (step.unit == 'em') {
            return step.em;
        }

        return step.percent
    }    

    '*/image/toItemString' ($store, image = undefined ) {

        if (!image) return '';

        var colorsteps =  image.colorsteps || $store.read('/item/map/children', image.id, (step) => step )

        if (!colorsteps) return '';

        var colors = [...colorsteps]
        if (!colors.length) return ''; 
        
        colors.sort((a, b) => {
            if (a.index == b.index) return 0;
            return a.index > b.index ? 1 : -1;
        })

        var newColors = []
        colors.forEach( (c, index) => {
            if (c.cut && index > 0) {
                newColors.push(Object.assign({}, c, { 
                    unit : colors[index-1].unit,
                    percent : colors[index-1].percent,
                    px : colors[index-1].px,
                    em : colors[index-1].em
                } ));
            }

            newColors.push(c);
        })        
        
        colors = newColors.map(f => {

            var value = $store.read('/image/get/unitValue', f);

            return `${f.color} ${value}`
        }).join(',')

        return colors; 
    }


    '*/image/toConicItemString' ($store, image = undefined ) {

        if (!image) return '';

        var colorsteps =  image.colorsteps || $store.read('/item/map/children', image.id, (step) => step )

        if (!colorsteps) return '';

        var colors = [...colorsteps].map( (it, index) => {
            it.index = index; 
            return it;
        })
        if (!colors.length) return ''; 
        
        colors.sort((a, b) => {
            if (a.percent == b.percent) {
                if (a.index > b.index) return 1;
                if (a.index < b.index) return 0; 
                return 0;
            }
            return a.percent > b.percent ? 1 : -1;
        })


        var newColors = []
        colors.forEach( (c, index) => {
            if (c.cut && index > 0) {
                newColors.push(Object.assign({}, c, { percent : colors[index-1].percent} ));
            }

            newColors.push(c);
        })      
        
        colors = newColors.map(f => {
            var deg = Math.floor(f.percent * 3.6);
            return `${f.color} ${deg}deg`
        }).join(',')

        return colors; 
    }    

    '*/image/toLinear' ($store, image = {}) {
        var colors = $store.read('/image/toItemString', image)

        if (colors == '') return '' 

        var opt = ''
        var angle = image.angle
        var gradientType = image.type

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

    '*/image/toStatic' ($store, image = {}) {
        return $store.read('/image/toLinear', {
            type: 'linear',
            angle: 0,
            colorsteps: [ 
                { color: image.color, percent: 0} ,
                { color: image.color, percent: 100} ,
            ]
        })
    }

    '*/image/toLinearRight' ($store, image) {
        return $store.read('/image/toLinear', Object.assign({}, image, { type: 'linear', angle : 'to right'}))
    }

    '*/image/toRadial' ($store, image = {}) {
        var colors = $store.read('/image/toItemString', image)

        if (colors == '') return '' 
        var opt = ''
        var radialType = image.radialType;
        var radialPosition = image.radialPosition;
        var gradientType = image.type

        radialPosition = (DEFINED_POSITIONS[radialPosition]) ? radialPosition : radialPosition.join(' ')

        opt = radialPosition ? `${radialType} at ${radialPosition}` : radialType;

        return `${gradientType}-gradient(${opt}, ${colors})`
    }

    '*/image/toConic' ($store, image = {}) {
        var colors = $store.read('/image/toConicItemString', image)

        if (colors == '') return '' 
        var opt = []
        var conicAngle = image.angle;
        var conicPosition = image.radialPosition;
        var gradientType = image.type

        conicPosition = (DEFINED_POSITIONS[conicPosition]) ? conicPosition : conicPosition.join(' ')

        if (typeof conicAngle != 'undefined') {
            conicAngle = get(DEFINED_ANGLES, conicAngle, (it) => +it) 
            opt.push(`from ${conicAngle}deg`)
        }

        if (conicPosition) {
            opt.push(`at ${conicPosition}`)
        };

        var optString = opt.length ? opt.join(' ') + ',' : '';

        return `${gradientType}-gradient(${optString} ${colors})`
    }    

    '*/image/toImage' ($store, image = null, isExport = false) {
        var url = image.backgroundImage

        if (!isExport && url) {
            return `url(${url})`
        } else if (isExport) {
            return `url(${image.backgroundImageDataURI})`
        }
        
        return null;
    }
}