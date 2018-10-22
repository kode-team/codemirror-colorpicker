import BaseTab from '../BaseTab';
import LayerView from './layer/LayerView';
 
export default class LayerMenuTab extends BaseTab {
 
    components() {
        return { 
            LayerView
        }
    } 
 
    template () { 

        return `
            <div>
                <LayerView></LayerView>
            </div>    
        `
    }

}