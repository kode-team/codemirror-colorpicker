import BaseModule from "../../colorpicker/BaseModule";

const blend_list = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 
    'lighten', 'color-dodge', 'color-burn', 'hard-light', 
    'soft-light', 'difference', 'exclusion', 'hue',
    'saturation', 'color', 'luminosity'
]

export default class BlendManager extends BaseModule {

    initialize() {
        super.initialize()

        this.$store.blendMode = '';
    }

    '/blend/list' ($store) {
        return blend_list;
    }

    '/blend/select' ($store, backgroundBlendMode) {

        if (!blend_list.includes(backgroundBlendMode))  {
            backgroundBlendMode = '' 
        }

        $store.dispatch('/layer/change', {backgroundBlendMode})
    }

    '/blend/select/mix' ($store, mixBlendMode) {

        if (!blend_list.includes(mixBlendMode))  {
            mixBlendMode = '' 
        }

        $store.dispatch('/layer/change', {mixBlendMode})
    }    

    '/blend/toString' ($store, layer, backgroundBlend = '', mixBlend = '') {
        return $store.read('/layer/toString', Object.assign({}, layer,  {
            backgroundBlendMode: backgroundBlend,
            mixBlendMode: mixBlend
        }))
    }
}