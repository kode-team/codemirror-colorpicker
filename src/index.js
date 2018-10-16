import './scss/index.scss'

import Util from './util/index'
import ColorPicker from './colorpicker/index'
import CodeMirrorExtension from './extension/codemirror/index'


export default {
    ...Util,
    ...ColorPicker,
    ...CodeMirrorExtension
}