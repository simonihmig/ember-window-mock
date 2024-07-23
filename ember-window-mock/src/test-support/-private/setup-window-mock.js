import { reset, createWindowProxyHandler } from './window.js';
import { _setCurrentHandler } from '../../index.js';

//
// Used to reset window-mock for a test.
//
// NOTE: the `hooks = self` is for mocha support
//
export default function setupWindowMock(hooks = self) {
  hooks.beforeEach(() => _setCurrentHandler(createWindowProxyHandler()));
  hooks.afterEach(() => {
    reset();
    _setCurrentHandler();
  });
}
