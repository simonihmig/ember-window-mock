import location from '../-private/mock/location';

const MockWindow = new Proxy(window, {
  get(target, name) {
    switch (name) {
      case 'location':
        return location;
      default:
        return target[name];
    }
  }
});

export default MockWindow;
