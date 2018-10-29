import BasePropertyItem from "./BasePropertyItem";
import ImageList from "../../../layer/ImageList";


export default class ImageListView extends BasePropertyItem {
    components () {
        return {ImageList}
    }
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