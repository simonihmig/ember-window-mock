const mappedProperties = [
  // 'href',
  'port',
  'host',
  'hostname',
  'hash',
  'origin',
  'search',
  'pathname',
  'protocol',
  'username',
  'password',
];

/**
 * mock implementation of window.mock
 *
 * based on https://github.com/RyanV/jasmine-fake-window/blob/master/src/jasmine_fake_window.js
 *
 * @type {Object}
 * @public
 */
export default function locationFactory(defaultUrl) {
  let location = {};
  let url = new URL(defaultUrl);

  mappedProperties.forEach((propertyName) => {
    Object.defineProperty(location, propertyName, {
      get() {
        return url[propertyName];
      },
      set(value) {
        url[propertyName] = value;
      },
    });
  });

  Object.defineProperty(location, 'href', {
    get() {
      return url.href;
    },
    set(value) {
      try {
        // check if it's a valid absolute URL
        new URL(value);
        url.href = value;
      } catch (e) {
        // absolute path
        if (value.charAt(0) === '/') {
          url.href = url.origin + value;
        } else {
          // replace last part of path with new value
          let parts = url.pathname
            .split('/')
            .filter((item, index, array) => index !== array.length - 1)
            .concat(value);
          url.href = url.origin + parts.join('/');
        }
      }
    },
  });

  location.reload = function () {};
  location.assign = function (url) {
    this.href = url;
  };
  location.replace = location.assign;
  location.toString = function () {
    return this.href;
  };

  return location;
}
