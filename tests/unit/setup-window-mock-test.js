import { module, test } from 'qunit';
import { reset, setupWindowMock } from 'ember-window-mock';
import { setupSinonSandbox } from 'ember-sinon-sandbox/test-support';

module('setup-window-mock', function(hooks) {
  setupSinonSandbox(hooks);

  test('it calls reset in the hooks', function(assert) {
    const _hooks = {
      beforeEach: this.sandbox.spy(),
    };

    setupWindowMock(_hooks);

    assert.ok(_hooks.beforeEach.calledWith(reset));
  });
});
