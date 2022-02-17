function argumentError(f, required, given) {
  return new TypeError(
    "Failed to execute '" +
      f +
      "' on 'Storage': " +
      required +
      'arguments required, but only ' +
      given +
      'present.'
  );
}

export default class Storage {
  constructor() {
    Object.defineProperty(this, 'getItem', {
      value(key) {
        if (arguments.length < 1) {
          throw argumentError('getItem', 1, arguments.length);
        }
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          return this[key];
        }
        return null;
      },
      enumerable: false,
    });

    Object.defineProperty(this, 'setItem', {
      value(key, value) {
        if (arguments.length < 2) {
          throw argumentError('setItem', 2, arguments.length);
        }
        this[key] = value + '';
      },
      enumerable: false,
    });

    Object.defineProperty(this, 'removeItem', {
      value(key) {
        if (arguments.length < 1) {
          throw argumentError('removeItem', 1, arguments.length);
        }
        delete this[key];
      },
      enumerable: false,
    });

    Object.defineProperty(this, 'key', {
      value(index) {
        if (arguments.length < 1) {
          throw argumentError('key', 1, arguments.length);
        }
        index = parseInt(index, 10);

        if (Number.isNaN(index)) {
          index = 0;
        }

        if (index < 0 || index > this.length - 1) {
          return null;
        }

        return Object.keys(this)[index];
      },
      enumerable: false,
    });

    Object.defineProperty(this, 'clear', {
      value() {
        Object.keys(this).forEach((key) => delete this[key]);
      },
      enumerable: false,
    });

    Object.defineProperty(this, 'toString', {
      value() {
        return '[object Storage]';
      },
      enumerable: false,
    });
  }

  get length() {
    return Object.keys(this).length;
  }
}
