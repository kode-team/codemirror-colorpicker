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

    '*/blend/toString' ($store, layer, backgroundBlend = '', mixBlend = '', withStyle = true) {

        layer = $store.read('/clone', layer);

        layer.style['background-blend-mode'] = backgroundBlend;
        layer.style['mix-blend-mode'] = mixBlend;

        return $store.read('/layer/toString', layer, withStyle)
    }    

    '*/blend/toStringWithoutDimension' ($store, layer, backgroundBlend = '', mixBlend = '') {
        return $store.read('/blend/toString', layer, backgroundBlend, mixBlend, false)
    }        

    '*/blend/list' ($store) {
        return blend_list;
    }


}