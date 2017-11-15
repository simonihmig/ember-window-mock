import locationFactory from '../mock/location';

function noop() {}

export default function windowMockFactory() {
  let location = locationFactory();
  let holder = {};

  return new Proxy(window, {
    get(target, name) {
      switch (name) {
        case 'location':
          return location;
        case 'alert':
        case 'confirm':
        case 'prompt':
          return name in holder ? holder[name] : noop;
        default:
          if (window.hasOwnProperty(name) && typeof window[name] === 'function') {
            return window[name].bind(window);
          }
          return target[name];
      }
    },
    set(target, name, value, receiver) {
      switch (name) {
        case 'location':
          // setting window.location is equivalent to setting window.location.href
          receiver.location.href = value;
          return true;
        case 'alert':
        case 'confirm':
        case 'prompt':
          holder[name] = value;
          return true;
        default:
          target[name] = value;
          return true;
      }
    }
  });
}
