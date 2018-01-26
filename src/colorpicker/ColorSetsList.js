let colorSetsList = [
    { name : "Material",  'colors': [ 'rgba(255, 255, 0, 0.5)', '#f00', '#0ff', '#f0f', '#fff', '#f00', '#0ff', '#f0f', '#fff', '#f00', '#0ff', '#f0f' ]},
    { name : "Custom",  "edit" : true, 'colors': [ ]},             
    { name : "Pages",  'colors': [ '#fff', '#f00', '#0ff', '#f0f' ]}
]

export default class ColorSetsList {
    constructor (colorpicker) {
        this.colorpicker = colorpicker; 

        this.setUserList(this.colorpicker.getOption('colorSets'));
    }

    list () {
        return this.userList || colorSetsList;
    }

    setUserList (list) {
        this.userList = list; 

        this.resetUserList();

        this.setCurrentColorSets();
    }

    resetUserList () {
        if (this.userList && this.userList.length) {
            this.userList = this.userList.map( (element, index) => {
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

        if (typeof this.currentColorSets.colors == 'function') {
            this.currentColorSets.edit = false; 
        }

        return this.currentColorSets;
    }

    getCurrentColors ( ) {
        return this.getColors(this.currentColorSets);
    }

    getColors (element) {
        if (typeof element.colors == 'function') {
            return element.colors(this.colorpicker, this);
        }

        return element.colors || []; 
    }

    getColorSetsList () {
        return this.list().map(element => {
           return {
               name : element.name,
               colors : this.getColors(element)
           } 
        });
    }


    destroy () {
        
    }
}