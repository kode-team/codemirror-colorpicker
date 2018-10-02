import UIElement from './UIElement';

export default class BaseBox extends UIElement {

    refresh () {
        
    }

    refreshColorUI (e) {
        
    }    

    /** push change event  */
    changeColor (opt) {
        this.dispatch('/changeColor', opt || {})
    }

    // Event Bindings 
    'pointerend document' (e) { 
        this.onDragEnd(e);
    }

    'pointermove document' (e) {
        this.onDragMove(e);
    }

    'pointerstart $bar' (e) {
        e.preventDefault();
        this.isDown = true; 
    }
    
    'pointerstart $container' (e) {
        this.isDown = true 
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


    '@changeColor' () {
        this.refresh()
    }

    '@initColor' () { this.refresh() }    
    
}
