import windowFactory from 'ember-window-mock/-private/services/window';

export function initialize(application) {
  application.register('service:window', windowFactory(), { instantiate: false });
}

export default {
  name: 'window-service',
  initialize
};
