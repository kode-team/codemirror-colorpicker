import UIElement from "../../colorpicker/UIElement";

export default class BaseTab extends UIElement {

    template () {
        return `
        <div class="tab">
            <div class="tab-header" ref="$header">
                <div class="tab-item selected" data-id="1">1</div>
                <div class="tab-item" data-id="2">2</div>
            </div>
            <div class="tab-body" ref="$body">
                <div class="tab-content selected" data-id="1"></div>
                <div class="tab-content" data-id="2"></div>
            </div>
        </div>
        `
    }

    isNotSelectedTab (e) {
        return !e.$delegateTarget.hasClass('selected')
    }

    'click.isNotSelectedTab $header .tab-item' (e) {
        this.selectTab(e.$delegateTarget.attr('data-id'))
    }

    selectTab (id) {

        this.refs.$header.children().forEach($dom => {
            $dom.toggleClass('selected', $dom.attr('data-id') == id )
        })

        this.refs.$body.children().forEach($dom => {
            $dom.toggleClass('selected', $dom.attr('data-id') == id )
        })        
    } 

} 