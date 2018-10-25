import CodeMirrorColorView from './colorview' 

try {
    var CodeMirror = require('codemirror')
} catch(e) { }

const CHECK_CODEMIRROR_OBJECT = () => (CodeMirror || window.CodeMirror);
function LOAD_CODEMIRROR_COLORPICKER () {
    var CODEMIRROR_OBJECT = CHECK_CODEMIRROR_OBJECT();

    if (CODEMIRROR_OBJECT) {
        CODEMIRROR_OBJECT.defineOption("colorpicker", false, function (cm, val, old) {
            if (old && old != CODEMIRROR_OBJECT.Init) {
        
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

}

LOAD_CODEMIRROR_COLORPICKER()

export default {
    load: LOAD_CODEMIRROR_COLORPICKER
}