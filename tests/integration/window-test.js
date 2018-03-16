import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { default as window, reset } from 'ember-window-mock';

module('Integration | window', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(reset);

  test('it can mock window in integration tests', async function(assert) {
    window.localStorage.setItem('counter', '2');

    await render(hbs`
      {{#window-tester as |window|}}
        <span {{action window.increment}}>{{window.counter}}</span>
        <button {{action window.redirect "http://www.example.com"}}>Redirect</button>
      {{/window-tester}}
    `);

    assert.equal(find('span').textContent.trim(), '2');

    await click('button');

    assert.equal(window.location.href, 'http://www.example.com/');

    await click('span');

    assert.equal(find('span').textContent.trim(), '3');
    assert.equal(window.localStorage.getItem('counter'), '3');
  });

  test('each test gets a fresh copy - part 1 of 2', function(assert) {
    assert.expect(0);
    window.location.href = 'http://www.example.com/';
    window.foo = 'bar';
    window.localStorage.setItem('counter', '5');
  });

  test('each test gets a fresh copy - part 2 of 2', function(assert) {
    assert.notEqual(window.location.href, 'http://www.example.com/');
    assert.equal(window.foo, undefined);
    assert.equal(window.localStorage.getItem('counter'), null);
  });
});
