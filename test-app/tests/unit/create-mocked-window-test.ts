import { module } from 'qunit';
import {
  setupWindowMock,
  createMockedWindow,
  reset,
} from 'ember-window-mock/test-support';
import { runWindowTests } from './run-window-tests';

module('create-mocked-window', function (hooks) {
  setupWindowMock(hooks);
  hooks.afterEach(function () {
    reset(mockedWindow);
  });

  const mockedWindow = createMockedWindow();

  runWindowTests(mockedWindow);
});
