

import BaseTab from '../BaseTab';
import ImageView from './layer/ImageView';
 
export default class ImageMenuTab extends BaseTab {
 
    components() {
        return { 
            ImageView 
        }
    } 
 
    template () { 

        return `<div>
                    <ImageView></ImageView>
            </div>
        `
    }
}