import sinonTest from 'ember-sinon-qunit/test-support/test';
import {reset, setupWindowMock} from 'ember-window-mock';
import { module } from 'qunit';

module('setup-window-mock', function () {
  sinonTest('it calls reset in the hooks', function (assert) {
    const _hooks = {
      beforeEach: this.spy(),
    };

    setupWindowMock(_hooks);

    assert.ok(_hooks.beforeEach.calledWith(reset));
  });
});
