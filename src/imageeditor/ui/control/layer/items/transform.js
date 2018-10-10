import UIElement from "../../../../../colorpicker/UIElement";

export default class Transform extends UIElement {
    template () {
        return `
            <div class='property-item transform'>
                <div class='title'>Transform</div>
                <div class='items'>            
                    <div>
                        <label>Rotate</label>
                        <div>
                            <input type='number' ref="$rotate"> <span>deg</span>
                        </div>
                    </div>
                    <div>
                        <label>SkewX</label>
                        <div>
                            <input type='number' ref="$skewX"> <span>deg</span>
                        </div>
                    </div>  
                    <div>
                        <label>SkewY</label>
                        <div>
                            <input type='number' ref="$skewY"> <span>deg</span>
                        </div>
                    </div>     
                    <div>
                        <label>Scale</label>
                        <div>
                            <input type='number' ref="$scale" min="0.5" max="10.0" step="0.1"> <span></span>
                        </div>
                    </div>     
                    <div>
                        <label>translateX</label>
                        <div>
                            <input type='number' ref="$translateX"> <span>px</span>
                        </div>
                    </div>     
                    <div>
                        <label>translateY</label>
                        <div>
                            <input type='number' ref="$translateY"> <span>px</span>
                        </div>
                    </div>                                                         
                    
                    <div>
                        <label>translateZ</label>
                        <div>
                            <input type='number' ref="$translateZ"> <span>px</span>
                        </div>
                    </div>                                                                             
                </div>
            </div>
        `
    }

    '@changeEditor' () {
        this.refresh()
    }

    refresh() {
        this.read('/item/current/layer', (item) => {

            var attr = ['rotate', 'skewX', 'skewY', 'scale', 'translateX', 'translateY', 'translateZ']

            attr.forEach( key => {
                if (item.style[key]) {
                    this.refs[`$${key}`].val(item.style[key])    
                }
            })        
        })
        
    }

    updateTransform (key) {
        this.read('/item/current/layer', (item) => {
            item.style[key] = this.refs['$' + key].val()
            this.dispatch('/item/set', item)
        })
    }

    'input $rotate' () { this.updateTransform('rotate'); }
    'input $skewX' () { this.updateTransform('skewX'); }
    'input $skewY' () { this.updateTransform('skewY'); }
    'input $scale' () { this.updateTransform('scale'); }
    'input $translateX' () { this.updateTransform('translateX'); }
    'input $translateY' () { this.updateTransform('translateY'); }
    'input $translateZ' () { this.updateTransform('translateZ'); }
    
}