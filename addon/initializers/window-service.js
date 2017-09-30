import WindowService from 'ember-window-mock/services/window-browser';

export function initialize(application) {
  application.register('service:window', WindowService, { instantiate: false });
}

export default {
  name: 'window-service',
  initialize
};
