import { assert } from '@ember/debug';
import mockFunction from './function';

const PROXIES = new WeakMap();

function getProxyConfig(proxy) {
  assert(`Could not find '${proxy}' in the proxy map.`, PROXIES.has(proxy));
  return PROXIES.get(proxy);
}

function assertConfigurableDescriptor(target, key) {
  const descriptor = Object.getOwnPropertyDescriptor(target, key);
  assert(
    `Canot override non-configurable descriptor for '${key}' on '${target}'.`,
    !descriptor || descriptor.configurable
  );
}

function assertWritableDescriptor(target, key) {
  const descriptor = Object.getOwnPropertyDescriptor(target, key);
  if (descriptor && 'configurable' in descriptor && !descriptor.configurable) {
    assert(
      `Cannot directly set '${key}' on '${target}', because it is a non-configurable and non-writable property.\nSee https://github.com/kaliber5/ember-window-mock/issues/99`,
      'set' in descriptor || descriptor.writable
    );
  }
}

export default function proxyFactory(
  original,
  { makeHolder = () => ({}), makeDescriptors = () => ({}) } = {}
) {
  let holder = makeHolder();
  let descriptors = makeDescriptors();

  let proxy = new Proxy(original, {
    get(target, key) {
      if (key in holder) {
        return holder[key];
      }
      if (key in descriptors) {
        if (descriptors[key].get) {
          return descriptors[key].get.call(original);
        }
        return descriptors[key].value;
      }
      if (typeof target[key] === 'function') {
        return mockFunction(target[key], target);
      }
      if (typeof target[key] === 'object' && target[key] !== null) {
        let proxy = proxyFactory(target[key]);
        holder[key] = proxy;
        return proxy;
      }
      return target[key];
    },
    set(target, key, value) {
      assertWritableDescriptor(target, key);

      if (key in descriptors) {
        if (descriptors[key].set) {
          descriptors[key].set.call(original, value);
          return true;
        }
        if (!descriptors[key].writable) {
          return false;
        }
        descriptors[key].value = value;
        return true;
      }

      holder[key] = value;
      return true;
    },
    has(target, key) {
      return key in holder || key in target;
    },
    deleteProperty(target, key) {
      assertWritableDescriptor(target, key);
      delete holder[key];
      delete target[key];
      return true;
    },
    defineProperty(target, key, descriptor) {
      assertConfigurableDescriptor(target, key);
      descriptors[key] = descriptor;
      delete holder[key];
      return true;
    },
    getOwnPropertyDescriptor(target, key) {
      if (key in descriptors) {
        return descriptors[key];
      }

      return Object.getOwnPropertyDescriptor(target, key);
    }
  });

  function reset() {
    holder = makeHolder();
    descriptors = makeDescriptors();
  }

  PROXIES.set(proxy, { original, holder, descriptors, reset });

  return proxy;
}

export function reset(proxy) {
  getProxyConfig(proxy).reset();
}
