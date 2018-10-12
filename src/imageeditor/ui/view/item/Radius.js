import TopLeftRadius from './TopLeftRadius';

export default class Radius extends TopLeftRadius {

    initialize () {
        super.initialize()

        this.radiusKey = 'border-radius'
    }

    template () {
        return `<button type='button' data-value='radius'></button>`
    }

    isShow () {
        var layer = this.read('/item/current/layer')
        if (!layer) return false; 

        return !!layer.fixedRadius;
    }

}