import BasePropertyItem from "./BasePropertyItem";

export default class BackgroundRepeat extends BasePropertyItem {
    template () {
        return `
            <div class='property-item background-repeat'>
                <div class='title' ref="$title">Background Repeat</div>                        
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

    refresh() {

        this.read('/item/current/image', (image) => {
            this.refs.$repeat.val(image.backgroundRepeat || 'repeat');
        })

    }

}