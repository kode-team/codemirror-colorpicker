const CHECK_NUMBER_KEYS = [
    'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Space', 'Escape', 'Enter',
    'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0',
    'Period', 'Backspace','Tab'
];

const CHECK_UPDOWN_KEYS = [ 'ArrowDown', 'ArrowUp' ];

export default {    

    isArrowDown (e) {
        return e.code == 'ArrowDown';
    },

    isArrowUp (e) {
        return e.code == 'ArrowUp';
    },    

    checkUpDownKey(e) {
        return CHECK_UPDOWN_KEYS.includes(e.code);
    },

    checkNumberKey(e) {
        return CHECK_NUMBER_KEYS.includes(e.code);
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