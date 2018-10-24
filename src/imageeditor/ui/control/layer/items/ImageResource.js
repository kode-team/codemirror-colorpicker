import BasePropertyItem from "./BasePropertyItem";

export default class ImageResource extends BasePropertyItem {
    template () {
        return `
            <div class='property-item image-resource show'>
                <div class='title'>Image Resource</div>            
                <div class='items' ref="$imageList">

                </div>
            </div>
        `
    }

    'load $imageList' () {
        return this.read('/svg/list').map((svg, index) => {
            return `<div class='svg-item' data-index="${index}">${svg}</div>`
        })
    }

    refresh () {
        var isShow = this.isShow();
        this.$el.toggle(isShow)
    }

    '@changeEditor' () {
        this.refresh()
    }

    isShow () {
        var item = this.read('/item/current/image')

        if (!item) return false; 

        return this.read('/image/type/isImage', item.type); 
    }

    'click $imageList .svg-item' (e) {
        var index = +e.$delegateTarget.attr('data-index')
        this.read('/item/current/image', (image) => {
            var file = this.read('/svg/get/blob', index);
            this.read('/image/get/blob', [file], (newImage) => {
                this.dispatch('/item/set/image/file', image.id, newImage)
            });
        })
    }

}