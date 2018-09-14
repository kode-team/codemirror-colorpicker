
import Event from '../util/Event'
import UIElement from './UIElement';

export default class BaseBox extends UIElement {

    constructor (opt) {
        super(opt)

        this.source = 'base-box'
    }

 
    refresh () {
        
    }

    refreshColorUI (e) {
        
    }    

    /** push change event  */
    changeColor (opt) {
        this.$store.dispatch('/changeColor',Object.assign({
            source: this.source
        }, opt || {}))
    }

    // Event Bindings 
    'mouseup document' (e) { 
        this.onDragEnd(e);
    }

    'mousemove document' (e) {
        this.onDragMove(e);
    }

    'mousedown $bar' (e) {
        e.preventDefault();
        this.isDown = true; 
    }
    
    'mousedown $container' (e) {
        this.isDown = true 
        this.onDragStart(e);
    }

    'touchend document' (e) {
        this.onDragEnd(e);
    }

    'touchmove document' (e) {
        this.onDragMove(e);
    }

    'touchstart $bar' (e) {
        e.preventDefault();
        this.isDown = true; 
    }    

    'touchstart $container' (e) {
        this.onDragStart(e);
    }


    onDragStart (e) {
        this.isDown = true; 
        this.refreshColorUI(e);
    }

    onDragMove (e) {
        if (this.isDown) {
            this.refreshColorUI(e);
        }
    }

    /* called when mouse is ended move  */
    onDragEnd (e) {
        this.isDown = false 
    }


    '@changeColor' (sourceType) {
        if (this.source != sourceType) {
            this.refresh()
        }
    }

    '@initColor' () { this.refresh() }    
    
}
