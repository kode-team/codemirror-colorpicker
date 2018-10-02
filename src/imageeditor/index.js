import ImageEditor from './xd/index'

export default {
    createImageEditor (opts = { type: 'xd'}) {
        switch(opts.type) {
        default:
            return new ImageEditor(opts);            
        }
    },
    ImageEditor
}     