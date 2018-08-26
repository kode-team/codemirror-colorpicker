import ChromeDevToolColorPicker from './chromedevtool/index'

export default {
    create (opts) {
        switch(opts.type) {
        case 'sketch':
        case 'palette':
        default: 
            return new ChromeDevToolColorPicker(opts);
        }
    },
    ColorPicker: ChromeDevToolColorPicker,
    ChromeDevToolColorPicker
}    