import { module } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { default as window, reset } from 'ember-window-mock';

module('service:window-mock', {
  beforeEach() {
    reset();
  }
});

test('it defaults to window.location', function(assert) {
  assert.equal(window.location.href, window.location.href);
});

test('it mocks window.location.href', function(assert) {
  window.location.href = 'http://www.example.com:8080/foo?q=bar#hash';
  assert.equal(window.location.href, 'http://www.example.com:8080/foo?q=bar#hash');
  assert.equal(window.location.host, 'www.example.com:8080');
  assert.equal(window.location.hostname, 'www.example.com');
  assert.equal(window.location.protocol, 'http:');
  assert.equal(window.location.origin, 'http://www.example.com:8080');
  assert.equal(window.location.port, '8080');
  assert.equal(window.location.pathname, '/foo');
  assert.equal(window.location.search, '?q=bar');
  assert.equal(window.location.hash, '#hash');
});

test('it mocks window.location', function(assert) {
  window.location = 'http://www.example.com';
  assert.equal(window.location.href, 'http://www.example.com/');
});

test('it mocks window.location.reload', function(assert) {
  window.location.href = 'http://www.example.com';
  window.location.reload();
  assert.equal(window.location.href, 'http://www.example.com/');
});

test('it mocks window.location.replace', function(assert) {
  window.location.href = 'http://www.example.com';
  window.location.replace('http://www.emberjs.com');
  assert.equal(window.location.href, 'http://www.emberjs.com/');
});

test('it mocks window.location.assign', function(assert) {
  window.location.href = 'http://www.example.com';
  window.location.assign('http://www.emberjs.com');
  assert.equal(window.location.href, 'http://www.emberjs.com/');
});

test('it mocks window.location.toString()', function(assert) {
  window.location.href = 'http://www.example.com';
  assert.equal(window.location.toString(), 'http://www.example.com/');
});

test('it mocks pathname', function(assert) {
  window.location.href = 'http://www.example.com';
  window.location.pathname = '/foo/';
  assert.equal(window.location.href, 'http://www.example.com/foo/');
});

test('it proxies properties', function(assert) {
  window.window_mock_test_property = 'foo';
  assert.equal(window.window_mock_test_property, 'foo');
  delete window.window_mock_test_property;
});

test('it proxies functions', function(assert) {
  assert.expect(1);
  window.focus();
  assert.ok(true);
});

test('it replaces alert with noop', function(assert) {
  assert.expect(1);
  assert.equal(window.alert('foo'), undefined);
});

test('it replaces confirm with noop', function(assert) {
  assert.expect(1);
  assert.equal(window.confirm('foo'), undefined);
});

test('it replaces prompt with prompt', function(assert) {
  assert.expect(1);
  assert.equal(window.prompt('foo'), undefined);
});

test('it can stub alert', function(assert) {
  let stub = this.stub(window, 'alert');
  window.alert('foo');
  assert.ok(stub.calledOnce);
  assert.ok(stub.calledWith('foo'));
});

test('it can stub confirm', function(assert) {
  let stub = this.stub(window, 'confirm');
  stub.returns(true);
  let result = window.confirm('foo');
  assert.ok(stub.calledOnce);
  assert.ok(stub.calledWith('foo'));
  assert.equal(result, true);
});

test('it can stub prompt', function(assert) {
  let stub = this.stub(window, 'prompt');
  stub.returns('bar');
  let result = window.prompt('foo');
  assert.ok(stub.calledOnce);
  assert.ok(stub.calledWith('foo'));
  assert.equal(result, 'bar');
});

test('it allows adding and deleting properties', function(assert) {
  window.testKey = 'test value';
  assert.ok('testKey' in window);
  delete window.testKey;
  assert.notOk('testKey' in window);
});

test('it allows adding and deleting functions', function(assert) {
  assert.expect(3);
  window.testFn = () => assert.ok(true);
  assert.ok('testFn' in window);
  window.testFn();
  delete window.testFn;
  assert.notOk('testFn' in window);
});

test('it allows retrieving sinon functions from the proxy', function(assert) {
  assert.expect(1);
  window.testFn = this.spy();
  assert.ok(window.testFn.reset);
});

test('it can call dispatchEvent', function(assert) {
  assert.expect(1);
  let spy = this.spy();
  window.addEventListener('test-event', spy);
  window.dispatchEvent(new Event('test-event'));
  assert.ok(spy.calledOnce);
});
