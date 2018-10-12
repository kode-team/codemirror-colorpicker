import TopRightRadius from "./TopRightRadius";

export default class BottomRightRadius extends TopRightRadius {

    initialize () {
        super.initialize()

        this.radiusKey = 'border-bottom-right-radius'
    }

    template () {
        return `<button type='button' data-value='radius bottom right'></button>`
    }
    

}