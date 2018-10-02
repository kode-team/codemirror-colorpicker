import UIElement from "../../../colorpicker/UIElement";
import GradientView from "./image/GradientView";
import BlendList from './blend/BlendList'

export default class BlendControl extends UIElement {
    template () {
        return ` 
            <div class="control blend-control">
                <div class="left">
                    <BlendList></BlendList> 
                </div>
                <div class="right">
                    <GradientView></GradientView>
                </div>
 
            </div>     
        `
   }  

   components () {
       return { GradientView, BlendList  }
   }
}