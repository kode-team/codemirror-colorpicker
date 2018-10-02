import BaseImageEditor from '../BaseImageEditor';
import ColorTab from '../ui/ColorTab';
import ColorStepsTab from '../ui/ColorStepsTab';
import LayerManagerTab from '../ui/LayoutManagerTab';
import ControlTab from '../ui/ControlTab'
import ImageControl from '../ui/control/ImageControl';


export default class XDImageEditor extends BaseImageEditor {

    constructor(opt, props) { 
        super(opt, props);


        this.dispatch('/layer/add')

        this.emit('initLayer')
    }

    template () {
        return `

            <div class="layout-main">
                <div class="layout-top">
                    <div class='layout-flow'>                
                        <ImageControl></ImageControl>
                    </div>
                </div>
                <div class="layout-left">
                    <div class='layout-flow'>
                        <LayerManagerTab></LayerManagerTab>                
                    </div>
                </div>
                <div class="layout-right">
                    <div class='layout-flow'>
                        <ColorTab></ColorTab>
                        <ColorStepsTab></ColorStepsTab>
                    </div>
                </div>
                <div class="layout-header">
                    <h1>Image Editor</h1>
                </div>
            </div>
        `
    }

    components() { 
        return { 
            ColorTab, ColorStepsTab, LayerManagerTab, ControlTab, ImageControl
        }
    } 
}