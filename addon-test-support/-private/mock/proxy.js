export default function proxyFactory(target) {
  let holder = {};

  let proxy = new Proxy(target, {
    get (target, name) {
      if (name === '_reset') {
        return () => holder = {};
      }
      if (name in holder) {
        return holder[name];
      }
      // if (typeof window[name] === 'function') {
      //   return window[name].bind(window);
      // }
      return target[name];
    },
    set (target, name, value) {
      holder[name] = value;
      return true;
    },
    has(target, prop) {
      return prop in holder || prop in target;
    },
    deleteProperty(target, prop) {
      delete holder[prop];
      delete target[prop];
      return true;
    }
  });

  return proxy;
}