import ColorView from './colorview/index'

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