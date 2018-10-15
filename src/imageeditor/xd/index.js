import BaseImageEditor from '../BaseImageEditor';
import PageList from '../ui/layer/PageList';
import FeatureControl from '../ui/control/FeatureControl';
import GradientView from '../ui/control/image/GradientView';

import LayerList from '../ui/layer/LayerList';
import ImageList from '../ui/layer/ImageList'
import SubFeatureControl from '../ui/control/SubFeatureControl';

export default class XDImageEditor extends BaseImageEditor {

    template () {
        return `

            <div class="layout-main">
                <div class="layout-header">
                    <h1 class="header-title">EASYLOGIC</h1>
                    <div class="page-tab-menu">
                        <PageList></PageList>
                    </div>
                </div>
                <div class="layout-left">      
                    <LayerList></LayerList>
                    <ImageList></ImageList>
                </div>
                <div class="layout-body">
                    <GradientView></GradientView>                      
                </div>                
                <div class="layout-right">
                    <FeatureControl></FeatureControl>
                </div>
                <div class="layout-footer">
                    <SubFeatureControl></SubFeatureControl>
                </div>
            </div>
        `
    }

    components() { 
        return { 
            GradientView, 
            PageList,
            FeatureControl, 
            LayerList, 
            SubFeatureControl, 
            ImageList
        }
    } 
}