import CodeMirror from 'codemirror'
import CodeMirrorColorView from './colorview' 


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