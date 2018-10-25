import BaseModule from "../../colorpicker/BaseModule";
import SVGList from "./svg/index";

export default class SVGManager extends BaseModule {

    initialize () {
        super.initialize()

        this.$store.svgList = []
    }

    afterDispatch( ) {
        this.$store.emit('changeSvgList')
    }
 
    '*/svg/list' ($store) {
        return [...SVGList, ...$store.svgList];
    } 

    '/svg/list/load' ($store, loadList = []) {
        $store.svgList = $store.read('/clone', loadList);
    }

    '*/svg/get/blob' ($store, index, key) {
        if (SVGList[index]) {
            var svg = `${SVGList[index]}`;

            return new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
        } else {
            var list = $store.svgList.filter(item => item.key == key);

            if (list.length) {
                return list[0].url;
            }
        }

        return ''; 
    }

}