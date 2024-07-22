import mockFunction from './mock/function';
import locationFactory from './mock/location';
import proxyFactory from './mock/proxy';
import Storage from './mock/storage';

const originalWindow = window;

let location = locationFactory(originalWindow.location.href);
let localStorage = new Storage();
let sessionStorage = new Storage();
let holder = {};

function noop() {}

export const mockProxyHandler = {
  get(target, name, receiver) {
    switch (name) {
      case 'location':
        return location;
      case 'localStorage':
        return localStorage;
      case 'sessionStorage':
        return sessionStorage;
      case 'window':
        return receiver;
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

export function reset() {
  location = locationFactory(originalWindow.location.href);
  localStorage = new Storage();
  sessionStorage = new Storage();
  holder = {};
}
