import { module } from 'qunit';
import {
  setupWindowMock,
  createMockedWindow,
} from 'ember-window-mock/test-support';
import { runWindowTests } from './run-window-tests';

module('create-mocked-window', function (hooks) {
  setupWindowMock(hooks);

  const mockedWindow = createMockedWindow();

  runWindowTests(mockedWindow);
});
