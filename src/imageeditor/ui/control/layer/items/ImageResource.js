import BasePropertyItem from "./BasePropertyItem";

export default class ImageResource extends BasePropertyItem {
    template () {
        return `
            <div class='property-item image-resource show'>
                <div class='title'>Image Resource</div>            
                <div class='items'>            
                    <div>
                        <label>File Type</label>
                        <div>
                            <input type="text" readonly ref="$fileType" />
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    refresh () {
        var isShow = this.isShow();
        this.$el.toggle(isShow)

        if (isShow) {
            this.updateView();
        }
    }

    updateView () {
        this.read('/item/current/image', (image) => {
            this.refs.$fileType.val(image.fileType); 
        })
    }

    '@changeEditor' () {
        this.refresh()
    }

    isShow () {
        var item = this.read('/item/current/image')

        if (!item) return false; 

        return this.read('/image/type/isImage', item.type); 
    }


}