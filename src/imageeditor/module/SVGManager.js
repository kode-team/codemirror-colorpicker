import BaseModule from "../../colorpicker/BaseModule";
import SVGList from "./svg/index";

export default class SVGManager extends BaseModule {

    afterDispatch( ) {
        this.$store.emit('changeEditor')
    }
 
    '*/svg/list' ($store) {
        return SVGList;
    } 

    '*/svg/get/blob' ($store, index) {
        var svg = `${SVGList[index]}`;

        return new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
    }

}