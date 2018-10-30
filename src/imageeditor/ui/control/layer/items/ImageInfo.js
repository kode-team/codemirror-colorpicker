import BasePropertyItem from "./BasePropertyItem";

export default class ImageInfo extends BasePropertyItem {
    template () {
        return `
            <div class='property-item image-info show'>
                <div class='title'>Image Information</div>            
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