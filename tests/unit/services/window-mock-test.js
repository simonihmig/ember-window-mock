import { module } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import windowMock from 'ember-window-mock/services/window-mock';

module('service:window-mock', 'Unit | Service | window mock', {
});

test('it mocks window.location', function(assert) {
  windowMock.location.href = 'http://www.example.com';
  assert.equal(windowMock.location.href, 'http://www.example.com');
  assert.equal(windowMock.location.host, 'www.example.com');
  assert.equal(windowMock.location.protocol, 'http:');
});

test('it proxies properties', function(assert) {
  window.window_mock_test_property = 'foo';
  assert.equal(windowMock.window_mock_test_property, 'foo');
  delete window.window_mock_test_property;
});

test('it proxies functions', function(assert) {
  assert.expect(1);
  windowMock.focus();
  assert.ok(true);
});

test('it replaces alert with noop', function(assert) {
  assert.expect(1);
  assert.equal(windowMock.alert('foo'), undefined);
});

test('it replaces confirm with noop', function(assert) {
  assert.expect(1);
  assert.equal(windowMock.confirm('foo'), undefined);
});

test('it replaces prompt with prompt', function(assert) {
  assert.expect(1);
  assert.equal(windowMock.prompt('foo'), undefined);
});

test('it can stub alert', function(assert) {
  let stub = this.stub(windowMock, 'alert');
  windowMock.alert('foo');
  assert.ok(stub.calledOnce);
  assert.ok(stub.calledWith('foo'));
});

test('it can stub confirm', function(assert) {
  let stub = this.stub(windowMock, 'confirm');
  stub.returns(true);
  let result = windowMock.confirm('foo');
  assert.ok(stub.calledOnce);
  assert.ok(stub.calledWith('foo'));
  assert.equal(result, true);
});

test('it can stub prompt', function(assert) {
  let stub = this.stub(windowMock, 'prompt');
  stub.returns('bar');
  let result = windowMock.prompt('foo');
  assert.ok(stub.calledOnce);
  assert.ok(stub.calledWith('foo'));
  assert.equal(result, 'bar');
});
