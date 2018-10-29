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
                    <div>
                        <label>Clip</label>
                        <div>
                            <input type="checkbox" ref="$clipPath" /> is clip path 
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
            this.refs.$clipPath.el.checked = image.isClipPath;
        })
    }

    '@changeEditor' () {
        this.refresh()
    }

    'click $clipPath' (e) {
        this.read('/item/current/image', (image) => {
            image.isClipPath = this.refs.$clipPath.el.checked;
            this.dispatch('/item/set', image);
        })
    }

    isShow () {
        var item = this.read('/item/current/image')

        if (!item) return false; 

        return this.read('/image/type/isImage', item.type); 
    }


}