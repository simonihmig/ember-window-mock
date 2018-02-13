import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { default as window, reset } from 'ember-window-mock';
import { click } from 'ember-native-dom-helpers';

moduleForComponent('window', 'Integration | window', {
  integration: true,

  beforeEach() {
    reset()
  }
});

test('it can mock window in integration tests', async function(assert) {

  this.render(hbs`
    {{#window-tester as |window|}}
      <button {{action window.redirect "http://www.example.com"}}>Redirect</button>
    {{/window-tester}}
  `);

  await click('button');

  assert.equal(window.location.href, 'http://www.example.com/');
});

test('each test gets a fresh copy - part 1 of 2', function(assert) {
  assert.notEqual(window.location.href, 'http://www.example.com/');

  window.location.href = 'http://www.example.com/';
  window.foo = 'bar';
});

test('each test gets a fresh copy - part 2 of 2', function(assert) {
  assert.notEqual(window.location.href, 'http://www.example.com/');
  assert.equal(window.foo, undefined);
});
