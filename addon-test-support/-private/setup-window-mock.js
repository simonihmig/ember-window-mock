import { reset } from 'ember-window-mock';

//
// Used to reset window-mock for a test.
//
// NOTE: the `hooks = self` is for mocha support
//
export default function setupWindowMock(hooks = self) {
  hooks.beforeEach(reset);
}
