import mockFunction from './mock/function.js';
import locationFactory from './mock/location.js';
import proxyFactory from './mock/proxy.js';
import Storage from './mock/storage.js';
import mockedGlobalWindow from '../../index.js';

function noop() {}
const _reset = Symbol('ember-window-mock:reset');

export function createWindowProxyHandler(originalWindow = window) {
  let holder;
  let location;
  let localStorage;
  let sessionStorage;

  const reset = () => {
    holder = {};
    location = locationFactory(originalWindow.location.href);
    localStorage = new Storage();
    sessionStorage = new Storage();
  };

  reset();

  return {
    get(target, name, receiver) {
      switch (name) {
        case _reset:
          return reset;
        case 'location':
          return location;
        case 'localStorage':
          return localStorage;
        case 'sessionStorage':
          return sessionStorage;
        case 'window':
          return receiver;
        case 'top':
        case 'parent':
          return holder[name] ?? receiver;
        case 'alert':
        case 'confirm':
        case 'prompt':
          return name in holder ? holder[name] : noop;
        case 'onerror':
        case 'onunhandledrejection':
          // Always return the original error handler
          return Reflect.get(target, name);
        default:
          if (name in holder) {
            return holder[name];
          }
          if (typeof window[name] === 'function') {
            return mockFunction(target[name], target);
          }
          if (typeof window[name] === 'object' && window[name] !== null) {
            let proxy = proxyFactory(window[name]);
            holder[name] = proxy;
            return proxy;
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
        case 'onerror':
        case 'onunhandledrejection':
          // onerror always must live on the real window object to work
          return Reflect.set(target, name, value);
        default:
          holder[name] = value;
          return true;
      }
    },
    has(target, prop) {
      return prop in holder || prop in target;
    },
    deleteProperty(target, prop) {
      delete holder[prop];
      delete target[prop];
      return true;
    },
    getOwnPropertyDescriptor(target, property) {
      return (
        Reflect.getOwnPropertyDescriptor(holder, property) ??
        Reflect.getOwnPropertyDescriptor(target, property)
      );
    },
    defineProperty(target, property, attributes) {
      return Reflect.defineProperty(holder, property, attributes);
    },
  };
}

export function createMockedWindow(_window = window) {
  return new Proxy(_window, createWindowProxyHandler(_window));
}

export function reset(_window = mockedGlobalWindow) {
  _window[_reset]?.();
}
