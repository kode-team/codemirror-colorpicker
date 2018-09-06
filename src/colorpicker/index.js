import MacOSColorPicker from './macos/index'
import ChromeDevToolColorPicker from './chromedevtool/index'

export default {
    create (opts) {
        switch(opts.type) {
        case 'macos': 
            return new MacOSColorPicker(opts);
        case 'sketch':
        case 'palette':
        default: 
            return new ChromeDevToolColorPicker(opts);
        }
    },
    ColorPicker: ChromeDevToolColorPicker,
    ChromeDevToolColorPicker,
    MacOSColorPicker
}    