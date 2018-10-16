import CodeMirror from 'codemirror'
import CodeMirrorColorView from './colorview' 

const CHECK_CODEMIRROR_OBJECT = () => (CodeMirror || window.CodeMirror);
const CHECK_CODEMIRROR_LOAD_TIME = window.CHECK_CODEMIRROR_LOAD_TIME || 10; 
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
    } else {
        setTimeout(LOAD_CODEMIRROR_COLORPICKER, CHECK_CODEMIRROR_LOAD_TIME);
    }

}

LOAD_CODEMIRROR_COLORPICKER()