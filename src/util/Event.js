export default {    

    addEvent (dom, eventName, callback) {
        dom.addEventListener(eventName, callback);
    },
   
    removeEvent(dom, eventName, callback) {
        dom.removeEventListener(eventName, callback);
    },

    pos(e) {
        if (e.touches && e.touches[0]) {
            return e.touches[0];
        }
    
        return e;
    }
}