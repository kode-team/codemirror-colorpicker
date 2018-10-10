import TopLeftRadius from './TopLeftRadius';

export default class BottomLeftRadius extends TopLeftRadius {

    initialize () {
        super.initialize()

        this.radiusKey = 'border-bottom-left-radius'
    }

    template () {
        return `<button type='button' data-value='radius bottom left'></button>`
    }

}