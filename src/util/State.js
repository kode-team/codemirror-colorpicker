const DELEGATE_SPLIT = '.';

export default class State {
  constructor (masterObj, settingObj = {}) {

    this.masterObj = masterObj;
    this.settingObj = settingObj; 
  }

  set (key, value, defaultValue = undefined) {
    this.settingObj[key] = value || defaultValue;
  }

  init (key, ...args) {

    if (!this.has(key)) {

      const arr = key.split(DELEGATE_SPLIT);

      const obj = this.masterObj.refs[arr[0]] || this.masterObj[arr[0]] || this.masterObj;
      const method = arr.pop();

      if (obj[method]) {
        const value = obj[method].apply(obj, args);

        this.set(key, value);
      }

    }
  }

  get (key, defaultValue = '') {

    this.init(key, defaultValue);

    return this.settingObj[key] || defaultValue;
  }

  has (key) {
    return !!this.settingObj[key];
  }
}