import BaseModule from "../../colorpicker/BaseModule";

var list = new Array(1000);
var lastIndex = -1;
var selectedItem = {}

var verticalKeys = ['y', 'centerY', 'y2']
var horizontalKeys = ['x', 'centerX', 'x2']
var maxDist = 1; 

export default class GuideManager extends BaseModule {

    '*/guide/rect' ($store, obj) {
        var x = +((obj.x || '0px').replace('px', ''))
        var y = +((obj.y || '0px').replace('px', ''))
        var width = +((obj.width || '0px').replace('px', ''))
        var height = +((obj.height || '0px').replace('px', ''))

        var x2 = x + width; 
        var y2 = y + height;

        var centerX = x + Math.floor(width/2); 
        var centerY = y + Math.floor(height/2); 

        return {x, y, x2, y2, width, height, centerX, centerY}
    }
 
    '*/guide/line/layer' ($store) {

        var page = $store.read('/item/current/page');

        if (!page) return []
        if (!page.style) return []

        if (page.selected) return []


        var index = 0; 
        list[index++] = $store.read('/guide/rect', { 
            x: 0, 
            y: 0, 
            width: page.style.width, 
            height: page.style.height 
        })

        $store.read('/item/each/children', page.id, (item) => {
            var newItem = $store.read('/guide/rect', { 
                x: item.style.x, 
                y: item.style.y,
                width: item.style.width,
                height: item.style.height
            })

            if (item.selected) {
                selectedItem = newItem
            } else {
                list[index++] = newItem
            }
        })

        lastIndex = index; 
        
        return $store.read('/guide/paths'); 
    }

    '*/guide/paths' ($store) {

        var results = [] 
        for(var i = 0; i < lastIndex; i++) {
            results.push(...$store.read('/guide/check', list[i], selectedItem))
        }

        return results; 
    }

    '*/guide/check' ($store, item1, item2) {
        var results = []

        // 가로 먼저 체크 

        results.push(...$store.read('/guide/check/vertical', item1, item2))

        // 세로 체크 
        results.push(...$store.read('/guide/check/horizontal', item1, item2))

        return results;
    }

    '*/guide/check/vertical' ($store, item1, item2) {
        var results = []

        verticalKeys.forEach(key => {


            // top
            if (Math.abs(item1.y - item2[key]) < maxDist) {
                results.push({ type: '-', 
                    x: Math.min(item1.centerX, item2.centerX), 
                    y: item1.y,  
                    width: Math.max(item1.centerX, item2.centerX) - Math.min(item1.centerX, item2.centerX)
                })
            }

            // middle
            if (Math.abs(item1.centerY - item2[key]) < maxDist) {
                results.push({ type: '-', 
                    x: Math.min(item1.centerX, item2.centerX), 
                    y: item1.centerY,  
                    width: Math.max(item1.centerX, item2.centerX) - Math.min(item1.centerX, item2.centerX)
                })
            }

            // bottom
            if (Math.abs(item1.y2 - item2[key]) < maxDist) {
                results.push({ type: '-', 
                    x: Math.min(item1.centerX, item2.centerX), 
                    y: item1.y2,  
                    width: Math.max(item1.centerX, item2.centerX) - Math.min(item1.centerX, item2.centerX)
                })
            }

        })

        return results; 
    }

    '*/guide/check/horizontal' ($store, item1, item2) {
        var results = []

        horizontalKeys.forEach(key => {

            // left 
            if (Math.abs(item1.x - item2[key]) < maxDist) {
                results.push({ type: '|', 
                    x: item1.x, 
                    y: Math.min(item1.centerY, item2.centerY),  
                    height: Math.max(item1.centerY, item2.centerY) - Math.min(item1.centerY, item2.centerY)
                })
            }

            // center
            if (Math.abs(item1.centerX - item2[key]) < maxDist) {
                results.push({ type: '|', 
                x: item1.centerX, 
                y: Math.min(item1.centerY, item2.centerY),  
                height: Math.max(item1.centerY, item2.centerY) - Math.min(item1.centerY, item2.centerY)
            })
            }

            // right
            if (Math.abs(item1.x2 - item2[key]) < maxDist) {
                results.push({ type: '|', 
                x: item1.x2, 
                y: Math.min(item1.centerY, item2.centerY),  
                height: Math.max(item1.centerY, item2.centerY) - Math.min(item1.centerY, item2.centerY)
            })
            }

        })
        
        return results; 
    }


}