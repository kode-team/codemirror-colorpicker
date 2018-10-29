import BaseModule from "../../colorpicker/BaseModule";
import SVGList from "./svg/index";
import Dom from "../../util/Dom";
import { uuid } from "../../util/functions/math";

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

    '*/svg/get/clipPath' ($store, svg, callback) {

        var $div = new Dom('div');
        var paths = $div.html(svg).$('svg').html();

        var id = uuid();
        var svg = `<svg height="0" width="0">
                <defs>
                <clipPath id="${id}">
                    ${paths}
                </clipPath>
                </defs>
            </svg>`

        callback && callback(svg, id);
    }

    '*/svg/get/blob' ($store, index, key) {
        if (SVGList[index]) {
            var svg = `${SVGList[index]}`;

            return new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
        } else {
            var list = $store.svgList.filter(item => item.key == key);

            if (list.length) {
                return new Blob([list[0].svg], {type:"image/svg+xml;charset=utf-8"});
            }
        }

        return ''; 
    }

}