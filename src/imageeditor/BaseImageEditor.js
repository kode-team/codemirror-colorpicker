import Dom from '../util/Dom'
import BaseStore from '../colorpicker/BaseStore'

import ModuleList from './module/index'
import UIElement from '../colorpicker/UIElement';

export default class BaseImageEditor extends UIElement {

    initialize (modules = []) {
        this.$body = null;
        this.$root = null; 
        
        this.$store = new BaseStore({
            modules: [
                ...ModuleList,
                ...modules
            ]
        });

        this.$body = new Dom(this.getContainer());
        this.$root = new Dom('div', 'imageeditor');

        this.$body.append(this.$root);        

        if (this.opt.type) {    // to change css style
            this.$root.addClass(this.opt.type);
        }

        this.render(this.$root)

        // 이벤트 연결 
        this.initializeEvent();           
    }

    getContainer () {
        return this.opt.container || document.body;
    }   
}