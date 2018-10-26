import BasePropertyItem from "./BasePropertyItem";

export default class ImageListView extends BasePropertyItem {
    template () {
        return `
            <div class='property-item image-list-view show'>
                <div class='items'>            
                    <ImageList></ImageList>
                </div>
            </div>
        `
    }
}