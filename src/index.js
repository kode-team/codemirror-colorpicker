import './scss/index.scss'

import CodeMirror from 'codemirror'
import ColorView from './colorview/index'
import ColorPicker from './colorpicker/index'

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
        cm.state.colorpicker = new ColorView(cm, val);
    }
});

CodeMirror.defineExtension("colorpicker", function (opt) {
    return new ColorPicker(opt);
})

export default {
    ColorView,
    ColorPicker 
}