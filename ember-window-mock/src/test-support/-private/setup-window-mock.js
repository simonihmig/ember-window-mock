import { reset, mockProxyHandler } from './window.js';
import { _setCurrentHandler } from '../../index.js';

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
