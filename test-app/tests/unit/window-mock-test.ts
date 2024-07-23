import _window from 'ember-window-mock';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { module } from 'qunit';
import { runWindowTests } from './run-window-tests';

module('window-mock', function (hooks) {
  setupWindowMock(hooks);

  runWindowTests(_window);
});
