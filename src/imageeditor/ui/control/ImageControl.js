import UIElement from "../../../colorpicker/UIElement";
import GradientView from "./image/GradientView";
import BlendList from "./blend/BlendList";

export default class ImageControl extends UIElement {
    template () {
        return ` 
            <div class="control image-control">
                <div class='top'>
                    <GradientView></GradientView>                      
                </div>
                <div class='bottom'>
                    <BlendList></BlendList>
                </div>

            </div>     
        `
   }  

   components () {
       return { GradientView, BlendList }
   }
}