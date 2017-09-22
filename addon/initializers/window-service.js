import WindowMockService from 'ember-window-mock/services/window-mock';
import WindowService from 'ember-window-mock/services/window-browser';
// @todo enable that once module import is available, see https://github.com/ember-cli/ember-rfc176-data/issues/12
// import { isTesting } from '@ember/test';
import Ember from 'ember';
const { testing: isTesting } = Ember;

export function initialize(application) {
  application.register('service:window', isTesting ? WindowMockService : WindowService, { instantiate: false });
}

export default {
  name: 'window-service',
  initialize
};
