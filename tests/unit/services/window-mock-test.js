import { module, test } from 'ember-qunit';
import windowMock from 'ember-window-mock/services/window-mock';

module('service:window-mock', 'Unit | Service | window mock', {
});

test('it mocks window.location', function(assert) {
  windowMock.location.href = 'http://www.example.com';
  assert.equal(windowMock.location.href, 'http://www.example.com');
  assert.equal(windowMock.location.host, 'www.example.com');
  assert.equal(windowMock.location.protocol, 'http:');
});

test('it proxies other properties', function(assert) {
  window.window_mock_test_property = 'foo';
  assert.equal(windowMock.window_mock_test_property, 'foo');
  delete window.window_mock_test_property;
});