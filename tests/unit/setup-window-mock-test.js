import { module, test } from 'qunit';
import mockableWindow from 'ember-window-mock';
import { setupWindowMock } from 'ember-window-mock/test-support';

function testIsMocked(message) {
  test(message, function (assert) {
    mockableWindow.localStorage.setItem('foo', 'bar');
    assert.strictEqual(mockableWindow.localStorage.getItem('foo'), 'bar');
    assert.strictEqual(window.localStorage.getItem('foo'), null);
  });
}

function testIsResetted() {
  test('mocked state is resetted after test', function (assert) {
    assert.strictEqual(mockableWindow.localStorage.getItem('foo'), null);
  });
}

function testIsNOTMocked(message) {
  test(message, function (assert) {
    mockableWindow.localStorage.setItem('foo', 'bar');
    assert.strictEqual(mockableWindow.localStorage.getItem('foo'), 'bar');
    assert.strictEqual(window.localStorage.getItem('foo'), 'bar');
    mockableWindow.localStorage.removeItem('foo');
  });
}

module('setup-window-mock', function () {
  module('single', function () {
    module('module', function (hooks) {
      setupWindowMock(hooks);

      testIsMocked('window is mocked when test is inside setupWindowMock');
    });

    testIsResetted();
    testIsNOTMocked(
      'window is *not* mocked when test is *outside* setupWindowMock'
    );
  });

  module('nested', function () {
    module('outer module', function (hooks) {
      setupWindowMock(hooks);

      module('inner module', function (hooks) {
        setupWindowMock(hooks);

        testIsMocked(
          'window is mocked when test is inside inner setupWindowMock'
        );
      });

      testIsResetted();
      testIsMocked(
        'window is mocked when test is inside outer setupWindowMock'
      );
    });

    testIsResetted();
    testIsNOTMocked(
      'window is *not* mocked when test is *outside* setupWindowMock'
    );
  });
});
