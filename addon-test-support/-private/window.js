import locationFactory from './mock/location';
import LocalStorage from './mock/local-storage';
import proxyFactory, { reset as resetProxy } from './mock/proxy';

const originalWindow = window;

function makeHolder() {
  function noop() {}

  return {
    localStorage: new LocalStorage(),
    alert: noop,
    confirm: noop,
    prompt: noop
  };
}

function makeDescriptors() {
  const location = locationFactory(originalWindow.location.href);
  return {
    location: {
      enumerable: true,
      configurable: false,
      get: () => location,
      set: href => (location.href = href)
    }
  };
}

const windowProxy = proxyFactory(originalWindow, {
  makeHolder,
  makeDescriptors
});

export default windowProxy;

export function reset(proxy = windowProxy) {
  resetProxy(proxy);
}
