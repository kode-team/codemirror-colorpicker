import BaseImageEditor from '../BaseImageEditor';
import PageList from '../ui/layer/PageList';
import FeatureControl from '../ui/control/FeatureControl';
import GradientView from '../ui/control/image/GradientView';

import LayerList from '../ui/layer/LayerList';
import ImageList from '../ui/layer/ImageList'
import SubFeatureControl from '../ui/control/SubFeatureControl';
import PropertyView from '../ui/control/layer/PropertyView';
import ExportView from '../ui/control/ExportView';
import Timeline from '../ui/control/Timeline';
import DropView from '../ui/control/DropView';
import VerticalColorStep from '../ui/control/VerticalColorStep';

const screenModes = ['expertor', 'beginner']

export default class XDImageEditor extends BaseImageEditor {


    afterRender() {
        this.refs.$layoutMain.removeClass('beginner-mode')
        this.refs.$layoutMain.removeClass('expertor-mode')
        this.refs.$layoutMain.addClass(this.read('/storage/get', 'layout') + '-mode')
    }

    template () {
        return `

            <div class="layout-main" ref="$layoutMain">
                <div class="layout-header">
                    <h1 class="header-title">EASYLOGIC</h1>
                    <div class="page-tab-menu">
                        <PageList></PageList>
                    </div>
                </div>
                <div class="layout-top">
                    <PropertyView></PropertyView>
                </div>
                <div class="layout-left">      
                    <LayerList></LayerList>
                    <ImageList></ImageList>
                </div>
                <div class="layout-body">
                    <VerticalColorStep></VerticalColorStep>
                    <GradientView></GradientView>                      
                </div>                
                <div class="layout-right">
                    <FeatureControl></FeatureControl>
                </div>
                <div class="layout-footer">
                    <Timeline></Timeline>
                </div>
                <ExportView></ExportView>
                <DropView></DropView>
            </div>
        `
    }

    components() { 
        return { 
            VerticalColorStep, 
            DropView,
            ExportView,
            PropertyView,
            GradientView, 
            PageList,
            FeatureControl, 
            LayerList, 
            SubFeatureControl, 
            ImageList,
            Timeline
        }
    } 

    loadStart (isAdd) {
        this.dispatch('/storage/load', (isLoaded) => {
            if (!isLoaded && isAdd) { 
                this.dispatch('/item/add/page', true)
            } else {
                this.dispatch('/item/load');
            }
        });
    }

    toggleTimeline () {
        this.$el.toggleClass('show-timeline')
    } 

    '@updateLayout' (layout) {
        screenModes.filter(key => key != layout).forEach(key => {
            this.refs.$layoutMain.removeClass(`${key}-mode`)
        })

        this.refs.$layoutMain.addClass(`${layout}-mode`)
    }


}