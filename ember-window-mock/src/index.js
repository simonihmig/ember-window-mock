import { DEBUG } from '@glimmer/env';

let exportedWindow;
let _setCurrentHandler;

if (DEBUG) {
  // this Proxy handler will be used to preserve the unaltered behavior of the window global by default
  const doNothingHandler = {
    get(target, prop) {
      const value = Reflect.get(target, prop);

      // make sure the function receives the original window as the this context! (e.g. alert will throw an invalid invocation error)
      if (typeof value === 'function') {
        return new Proxy(value, {
          apply(t, _thisArg, argumentsList) {
            return Reflect.apply(value, target, argumentsList);
          },
        });
      }

      return value;
    },
    set: Reflect.set,
    has: Reflect.has,
    deleteProperty: Reflect.deleteProperty,
    getOwnPropertyDescriptor: Reflect.getOwnPropertyDescriptor,
    defineProperty: Reflect.defineProperty,
  };

  let currentHandler = doNothingHandler;

  // private function to replace the default handler in tests
  _setCurrentHandler = (handler = doNothingHandler) =>
    (currentHandler = handler);

  const proxyHandler = {
    get() {
      return currentHandler.get(...arguments);
    },
    set() {
      return currentHandler.set(...arguments);
    },
    has() {
      return currentHandler.has(...arguments);
    },
    deleteProperty() {
      return currentHandler.deleteProperty(...arguments);
    },
    getOwnPropertyDescriptor() {
      return currentHandler.getOwnPropertyDescriptor(...arguments);
    },
    defineProperty() {
      return currentHandler.defineProperty(...arguments);
    },
  };

  exportedWindow = new Proxy(window, proxyHandler);
} else {
  exportedWindow = window;
}

export default exportedWindow;
export { _setCurrentHandler };
