import Color from '../util/Color'



export default class ColorSetsList {
    constructor (colorpicker) {
        this.colorpicker = colorpicker; 


        this.colorSetsList = [
            { 
                name : "Material",  
                colors: [ 
                    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',  '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',  '#795548', '#9E9E9E', '#607D8B' 
                ]
            },
            { 
                name : "Custom", "edit" : true, "colors" : []
            },
            {
                name: "Color Scale", "scale" : ['red', 'yellow', 'black' ], count : 5
            }
        ]
        

        this.setUserList(this.colorpicker.getOption('colorSets'));
    }

    list () {
        return this.userList || this.colorSetsList;
    }

    setUserList (list) {
        this.userList = list; 

        this.resetUserList();

        this.setCurrentColorSets();
    }

    resetUserList () {
        if (this.userList && this.userList.length) {
            this.userList = this.userList.map( (element, index) => {

                if (typeof element.colors == 'function') {
                    const makeCallback = element.colors; 

                    element.colors = makeCallback(this.colorpicker, this);
                    element._colors = makeCallback;
                }

                return Object.assign({ 
                    name: `color-${index}`,
                    colors : [] 
                }, element)
            })
        }
    }

    setCurrentColorSets (nameOrIndex) {

        const _list = this.list();

        if (typeof nameOrIndex == 'undefined') {
            this.currentColorSets = _list[0];
        } else if (typeof nameOrIndex == 'number') {
            this.currentColorSets = _list[nameOrIndex];
        } else {
            this.currentColorSets = _list.filter(function (obj) {
                return obj.name == nameOrIndex;
            })[0];
        }
    

    }

    getCurrentColorSets () {
        return this.currentColorSets;
    }

    addCurrentColor ( color) {
        if (Array.isArray(this.currentColorSets.colors)) {
            this.currentColorSets.colors.push(color);
        } 
    }

    setCurrentColorAll(colors = []) {
        this.currentColorSets.colors = colors;
    }

    removeCurrentColor (index) {
        if (this.currentColorSets.colors[index]) {
            this.currentColorSets.colors.splice(index, 1);
        }
    }

    removeCurrentColorToTheRight (index) {
        if (this.currentColorSets.colors[index]) {
            this.currentColorSets.colors.splice(index, Number.MAX_VALUE);
        }
    }    

    clearPalette () {
        if (this.currentColorSets.colors) {
            this.currentColorSets.colors = [];
        }
    }

    getCurrentColors ( ) {
        return this.getColors(this.currentColorSets);
    }

    getColors (element) {

        if (element.scale) {
            return Color.scale(element.scale, element.count);
        }
        
        return element.colors || []; 
    }

    getColorSetsList () {
        return this.list().map(element => {
           return {
               name : element.name,
               edit : element.edit,
               colors : this.getColors(element)
           } 
        });
    }


    destroy () {
        
    }


    on (event, callback) {
        this.callbacks.push({ event, callback })
    }

    off (event, callback) {

        if (arguments.length == 0) {
            this.callbacks = [] 
        } else if (arguments.length == 1) {
            this.callbacks = this.callbacks.filter(f => {
                return f.event != event 
            })
        } else if (arguments.length == 2) {
            this.callbacks = this.callbacks.filter(f => {
                return f.event != event && f.callback != callback 
            })
        }


    }

    emit () {
        var args = [...arguments];
        var event = args.shift();

        this.callbacks.filter(f => {
            return (f.event == event)
        }).forEach(f => {
            f.callback(...args);
        })
    }    
}