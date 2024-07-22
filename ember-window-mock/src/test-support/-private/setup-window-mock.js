import { reset, mockProxyHandler } from './window';
import { _setCurrentHandler } from 'ember-window-mock';

//
// Used to reset window-mock for a test.
//
// NOTE: the `hooks = self` is for mocha support
//
export default function setupWindowMock(hooks = self) {
  hooks.beforeEach(() => _setCurrentHandler(mockProxyHandler));
  hooks.afterEach(() => {
    reset();
    _setCurrentHandler();
  });
}
