import location from '../mock/location';

function noop() {}

const ProxyWindow = new Proxy(window, {
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
  }
});

const MockWindow = Object.create(ProxyWindow);

export default MockWindow;
