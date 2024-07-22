import window from 'ember-window-mock';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('sinon', function (hooks) {
  setupWindowMock(hooks);

  test('it allows retrieving sinon functions from the proxy', function (assert) {
    window.testFn = sinon.spy();
    assert.strictEqual(window.testFn.callCount, 0);
  });

  test('it can set window property with spy', function (assert) {
    window.testFn = sinon.spy();
    window.testFn();
    assert.true(window.testFn.calledOnce);
  });

  test('it can stub window.confirm', function (assert) {
    sinon.stub(window, 'confirm').returns(true);
    assert.true(window.confirm(), 'window.confirm can be stubbed');
  });

  test('it can spy on window.fetch', function (assert) {
    sinon.spy(window, 'fetch');
    window.fetch();
    assert.true(window.fetch.calledOnce, 'window.fetch can be spied on');
  });

  test('it can replace window.fetch with spy', function (assert) {
    window.fetch = sinon.spy();
    window.fetch();
    assert.true(window.fetch.calledOnce, 'window.fetch can be spied on');
  });
});
