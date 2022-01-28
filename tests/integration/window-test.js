import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import window from 'ember-window-mock';
import { setupWindowMock } from 'ember-window-mock/test-support';

module('Integration | window', function (hooks) {
  setupRenderingTest(hooks);
  setupWindowMock(hooks);

  test('it can mock window in integration tests', async function (assert) {
    window.localStorage.setItem('counter', '2');

    await render(hbs`
      <WindowTester as |window|>
        <button type="button" data-test-counter {{on "click" window.increment}}>{{window.counter}}</button>
        <button type="button" data-test-redirect {{on "click" (fn window.redirect "http://www.example.com")}}>Redirect</button>
      </WindowTester>
    `);

    assert.dom('[data-test-counter]').hasText('2');

    await click('[data-test-redirect]');

    assert.strictEqual(window.location.href, 'http://www.example.com/');

    await click('[data-test-counter]');

    assert.dom('[data-test-counter]').hasText('3');
    assert.strictEqual(window.localStorage.getItem('counter'), '3');
  });

  test('each test gets a fresh copy - part 1 of 2', function (assert) {
    assert.expect(0);
    window.location.href = 'http://www.example.com/';
    window.foo = 'bar';
    window.localStorage.setItem('counter', '5');
  });

  test('each test gets a fresh copy - part 2 of 2', function (assert) {
    assert.notEqual(window.location.href, 'http://www.example.com/');
    assert.strictEqual(window.foo, undefined);
    assert.strictEqual(window.localStorage.getItem('counter'), null);
  });
});
