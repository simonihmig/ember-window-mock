const mappedPorperties = [
  'href',
  'port',
  'host',
  'hostname',
  'hash',
  'origin',
  'search',
  'pathname',
  'protocol',
  'username',
  'password'
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

  mappedPorperties.forEach((propertyName) => {
    Object.defineProperty(location, propertyName, {
      get() {
        return url[propertyName];
      },
      set(value) {
        url[propertyName] = value;
      }
    });
  });

  location.reload = function() {};
  location.assign = function(url) {
    this.href = url;
  };
  location.replace = location.assign;
  location.toString = function() {
    return this.href;
  };

  return location;
}
