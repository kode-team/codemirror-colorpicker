let colorSetsList = [
    { name : "Material",  "edit" : true, 'colors': [ '#fff', '#f00', '#0ff', '#f0f', '#fff', '#f00', '#0ff', '#f0f', '#fff', '#f00', '#0ff', '#f0f' ]},
    { name : "Custom",  "edit" : true, 'colors': [ ]},
    { name : "Pages",  "edit" : true, 'colors': [ '#fff', '#f00', '#0ff', '#f0f' ]}
]

export default class ColorSetsList {
    constructor (colorpicker) {
        this.colorpicker = colorpicker; 
        this.setCurrentColorSets();
    }

    setCurrentColorSets (name) {
        
        if (!name) {
            this.currentColorSets = colorSetsList[0];
        } else {
            this.currentColorSets = colorSetsList.filter(function (obj) {
                return obj.name == name;
            })[0];
        }
    
    }

    getCurrentColorSets () {
        return this.currentColorSets;
    }

    getColorSetsList () {
        return colorSetsList;
    }


    destroy () {
        
    }
}