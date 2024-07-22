import mockFunction from './function';

export default function proxyFactory(original) {
  let holder = {};

  let proxy = new Proxy(original, {
    get(target, name) {
      if (name === '_reset') {
        return () => (holder = {});
      }
      if (name in holder) {
        return holder[name];
      }
      if (typeof target[name] === 'function') {
        return mockFunction(target[name], target);
      }
      if (typeof target[name] === 'object' && target[name] !== null) {
        let proxy = proxyFactory(target[name]);
        holder[name] = proxy;
        return proxy;
      }
      return target[name];
    },
    set(target, name, value) {
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
  });

  return proxy;
}
