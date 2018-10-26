import BaseModule from "../../colorpicker/BaseModule";

var list = new Array(1000);
var lastIndex = -1;
var selectedItem = {}

var verticalKeys = ['y', 'centerY', 'y2']
var verticalAlign = { 'y' : 'top', 'centerY' : 'middle', 'y2' : 'bottom' }
var horizontalKeys = ['x', 'centerX', 'x2']
var horizontalAlign = { 'x' : 'left', 'centerX' : 'center', 'x2' : 'right' }
var maxDist = 1; 
var MAX_DIST = 1; 

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

    '*/guide/snap/layer' ($store, layer, dist = MAX_DIST) {
        var list = $store.read('/guide/line/layer', dist);
        var x, y;
        if (list.length) {

            var height = +((layer.style.height || '0px') .replace('px', ''))
            var width = +((layer.style.width || '0px').replace('px', ''))
            var topY = Math.min(...list.filter(it => it.align == 'top').map(it => it.y))
            var middleY = Math.min(...list.filter(it => it.align == 'middle').map(it => it.y))
            var bottomY = Math.min(...list.filter(it => it.align == 'bottom').map(it => it.y))
            var leftX = Math.min(...list.filter(it => it.align == 'left').map(it => it.x))
            var centerX = Math.min(...list.filter(it => it.align == 'center').map(it => it.x))
            var rightX = Math.min(...list.filter(it => it.align == 'right').map(it => it.x))

            if (topY != Infinity) {
                y = topY
            } else if (bottomY != Infinity) {
                y = bottomY -  height
            } else if (middleY != Infinity) {
                y =  Math.floor(middleY - height/2)
            }

            if (leftX  != Infinity) {
                x = leftX
            } else if (rightX != Infinity) {
                x = rightX -  width
            } else if (centerX != Infinity) {
                x =  Math.floor(centerX - width/2)
            }            

            return [x, y]
        }

        return []

    } 

    '*/guide/line/layer' ($store , dist = MAX_DIST, selectedId = '') {

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

            if (selectedId == item.id) {
                selectedItem = newItem
            } else if (item.selected) {
                selectedItem = newItem
            } else {
                list[index++] = newItem
            }
        })

        lastIndex = index; 
        
        return $store.read('/guide/paths', dist); 
    }

    '*/guide/paths' ($store, dist = MAX_DIST) {

        var results = [] 
        for(var i = 0; i < lastIndex; i++) {
            results.push(...$store.read('/guide/check', list[i], selectedItem, dist))
        }

        return results; 
    }

    '*/guide/check' ($store, item1, item2, dist = MAX_DIST) {
        var results = []

        // 가로 먼저 체크 

        results.push(...$store.read('/guide/check/vertical', item1, item2, dist))

        // 세로 체크 
        results.push(...$store.read('/guide/check/horizontal', item1, item2, dist))

        return results;
    }

    '*/guide/check/vertical' ($store, item1, item2, dist = MAX_DIST) {
        var results = []

        verticalKeys.forEach(key => {


            // top
            if (Math.abs(item1.y - item2[key]) < dist) {
                results.push({ type: '-', 
                    align: verticalAlign[key],
                    x: Math.min(item1.centerX, item2.centerX), 
                    y: item1.y,  
                    width: Math.max(item1.centerX, item2.centerX) - Math.min(item1.centerX, item2.centerX)
                })
            }

            // middle
            if (Math.abs(item1.centerY - item2[key]) < dist) {
                results.push({ type: '-', 
                    align: verticalAlign[key],
                    x: Math.min(item1.centerX, item2.centerX), 
                    y: item1.centerY,  
                    width: Math.max(item1.centerX, item2.centerX) - Math.min(item1.centerX, item2.centerX)
                })
            }

            // bottom
            if (Math.abs(item1.y2 - item2[key]) < dist) {
                results.push({ type: '-', 
                    align: verticalAlign[key],
                    x: Math.min(item1.centerX, item2.centerX), 
                    y: item1.y2,  
                    width: Math.max(item1.centerX, item2.centerX) - Math.min(item1.centerX, item2.centerX)
                })
            }

        })

        return results; 
    }

    '*/guide/check/horizontal' ($store, item1, item2, dist = MAX_DIST) {
        var results = []

        horizontalKeys.forEach(key => {

            // left 
            if (Math.abs(item1.x - item2[key]) < dist) {
                results.push({ type: '|', 
                    align: horizontalAlign[key],
                    x: item1.x, 
                    y: Math.min(item1.centerY, item2.centerY),  
                    height: Math.max(item1.centerY, item2.centerY) - Math.min(item1.centerY, item2.centerY)
                })
            }

            // center
            if (Math.abs(item1.centerX - item2[key]) < dist) {
                results.push({ type: '|', 
                    align: horizontalAlign[key],
                    x: item1.centerX, 
                    y: Math.min(item1.centerY, item2.centerY),  
                    height: Math.max(item1.centerY, item2.centerY) - Math.min(item1.centerY, item2.centerY)
                })
            }

            // right
            if (Math.abs(item1.x2 - item2[key]) < dist) {
                results.push({ type: '|', 
                    align: horizontalAlign[key],
                    x: item1.x2, 
                    y: Math.min(item1.centerY, item2.centerY),  
                    height: Math.max(item1.centerY, item2.centerY) - Math.min(item1.centerY, item2.centerY)
                })
            }

        })
        
        return results; 
    }


}