import UIElement from "../../../../../colorpicker/UIElement";

export default class BackgroundRepeat extends UIElement {
    template () {
        return `
            <div class='property-item background'>
                <div class='items'>
                    <div>
                        <label>repeat</label>
                        <div>
                            <select ref="$repeat">
                                <option value='repeat'>repeat</option>
                                <option value='no-repeat'>no-repeat</option>
                                <option value='repeat-x'>repeat-x</option>
                                <option value='repeat-y'>repeat-y</option>
                            </selct>
                        </div>
                 
                    </div>

                </div>
            </div>
        `
    }

    'change $repeat' () {
        this.read('/item/current/image', (image) => {
            image.backgroundRepeat = this.refs.$repeat.val()
            console.log(image);
            this.dispatch('/item/set', image);
        })
    }


    '@changeEditor' () {
        this.refresh()
    }


    isShow () {
        return this.read('/item/is/mode', 'image');
    }

    refresh() {

        var isShow = this.isShow();

        this.$el.toggle(isShow)

        if (isShow) {        
            this.read('/item/current/image', (image) => {
                this.refs.$repeat.val(image.backgroundRepeat || 'repeat');
            })
        }
    }

}