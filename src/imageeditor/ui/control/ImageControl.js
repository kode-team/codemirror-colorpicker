import UIElement from "../../../colorpicker/UIElement";
import GradientType from "./image/GradientType";
import GradientSampleList from './image/GradientSampleList';
import GradientView from "./image/GradientView";
import ImageList from './image/ImageList';

export default class ImageControl extends UIElement {
    template () {
        return ` 
            <div class="control image-control">
                <div class="left">
                    <ImageLIst></ImageList> 
                </div>
                <div class="right">
                    <GradientSampleList></GradientSampleList>                
                    <GradientType></GradientType>
                    <GradientView></GradientView>                      
                </div>

            </div>     
        `
   }  

   components () {
       return { GradientType, GradientView, GradientSampleList, ImageList }
   }
}