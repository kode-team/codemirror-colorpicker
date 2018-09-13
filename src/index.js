import './scss/index.scss'

import CodeMirror from 'codemirror'
import Color from './util/Color'
import HueColor from './util/HueColor'
import ColorNames from './util/ColorNames'
import ImageFilter from './util/ImageFilter'
import GL from './util/GL'
import Canvas from './util/Canvas'
import ImageLoader from './util/ImageLoader'
import CodeMirrorColorView from './extension/codemirror/index'
import ColorPicker from './colorpicker/index' 


if (CodeMirror) {

    CodeMirror.defineOption("colorpicker", false, function (cm, val, old) {
        if (old && old != CodeMirror.Init) {
    
            if (cm.state.colorpicker)
            { 
                cm.state.colorpicker.destroy(); 
                cm.state.colorpicker = null;  
    
            } 
            // remove event listener
        }
    
        if (val)
        {
            cm.state.colorpicker = new CodeMirrorColorView(cm, val);
        }
    });
}

export default {
    Color,
    ColorNames,    
    ...ColorPicker,    
    ImageFilter,
    GL,
    HueColor,
    Canvas,
    ImageLoader
}