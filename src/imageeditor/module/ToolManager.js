import BaseModule from "../../colorpicker/BaseModule";

export default class ToolManager extends BaseModule {

    initialize () {        
        super.initialize()

        this.$store.tool = {
            color : '',
            colorSource : '',
            'guide.only': false,            
            'guide.angle': true,
            'guide.position': true
        }
    } 

    '/clone' ($store, object) {
        return JSON.parse(JSON.stringify(object))
    }

    '/tool/setColorSource' ($store, colorSource) {
        $store.tool.colorSource = colorSource;
    }

    '/tool/colorSource' ($store) {
        return $store.tool.colorSource
    }

    '/tool/changeColor' ($store, color) {
        $store.tool.color = color 

        $store.emit('changeColor')
    }


    '/tool/set' ($store, key, value) {
        $store.tool[key] = value

        $store.emit('changeTool')
    }

    '/tool/get' ($store, key, defaultValue) {
        return typeof $store.tool[key] == 'undefined' ? defaultValue : $store.tool[key]
    }

    '/tool/toggle' ($store, key, isForce) {
        if (typeof isForce == 'undefined') {
            $store.tool[key] = !$store.tool[key]
        } else {
            $store.tool[key] = isForce
        }

        $store.emit('changeTool')
    }

}