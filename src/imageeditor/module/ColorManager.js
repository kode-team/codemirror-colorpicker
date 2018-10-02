import BaseModule from "../../colorpicker/BaseModule";

import ColorList from './color-list/index'

export default class ColorManager extends BaseModule {

    initialize( ) {
        super.initialize() 

        this.$store.selectedColorType = 'material'
    }

    '/color/get/type' ($store) {
        return $store.selectedColorType;
    }

    '/color/change/type' ($store, type) {
        $store.selectedColorType = type  

        $store.emit('changeColorType')
    }

    '/color/list/type' ($store) {
        return ColorList.types; 
    }

    '/color/list' ($store) {
        return ColorList.list[$store.selectedColorType || 'material'];
    }
}