export default {

    checkNumberKey(e) {
        var code = e.which,
            isExcept = false;

        if(code == 37 || code == 39 || code == 8 || code == 46 || code == 9)
            isExcept = true;

        if(!isExcept && (code < 48 || code > 57))
            return false;

        return true;
    },
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