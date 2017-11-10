import locationFactory from '../mock/location';

function noop() {}

export default function windowMockFactory() {
  let location = locationFactory();

  let ProxyWindow = new Proxy(window, {
    get(target, name) {
      switch (name) {
        case 'location':
          return location;
        case 'alert':
        case 'confirm':
        case 'prompt':
          return noop;
        default:
          if (target.hasOwnProperty(name) && typeof target[name] === 'function') {
            return target[name].bind(target);
          }
          return target[name];
      }
    },
    set: function(target, name, value, receiver) {
      switch (name) {
        case 'location':
          // setting window.location is equivalent to setting window.location.href
          receiver.location.href = value;
          return true;
        default:
          target[name] = value;
          return true;
      }
    }
  });

  return Object.create(ProxyWindow);
}
