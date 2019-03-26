import { assert } from '@ember/debug';

export default window;

export function reset() {
  assert('reset() is only available in tests');
}
