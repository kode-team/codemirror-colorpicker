import UIElement from "../../../../../colorpicker/UIElement";

export default class PageLayout extends UIElement {
    template () {
        return `
            <div class='property-item layout'>
                <div class='items no-padding'>
                    <div>
                        <label>Layout</label>
                        <div class='layout-buttons' ref="$buttons">
                            <button type="button" class='beginner' ref="$beginner">B</button>
                            <button type="button" class='expertor' ref="$expertor">E</button>
                        </div>
                    </div>   
                                 
                </div>
            </div>
        `
    }

    refresh () {
        this.refs.$buttons.removeClass('beginner-mode').removeClass('expertor-mode')
        this.refs.$buttons.addClass(this.read('/storage/get', 'layout') + '-mode')
    }

    '@changeEditor' () {
        this.refresh()
    }

    '@changeStorage' () {
        this.refresh();
    }

    'click $beginner' (e) {
        this.emit('updateLayout', 'beginner')
        this.dispatch('/storage/set', 'layout', 'beginner')        
        this.refresh();        

        this.emit('changeEditor')        
    }

    'click $expertor' (e) {
        this.emit('updateLayout', 'expertor')
        this.dispatch('/storage/set', 'layout', 'expertor')
        this.refresh();
        this.emit('changeEditor')        
    }

}