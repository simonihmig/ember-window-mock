import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { lookupWindow, mockWindow } from 'ember-window-mock';
import { click } from 'ember-native-dom-helpers';

moduleForComponent('window', 'Integration | window', {
  integration: true,

  beforeEach() {
    mockWindow(this);
  }
});

test('it can mock window in integration tests', async function(assert) {

  this.render(hbs`
    {{#window-tester as |window|}}
      <button {{action window.redirect "http://www.example.com"}}>Redirect</button>
    {{/window-tester}}
  `);

  await click('button');

  let window = lookupWindow(this);

  assert.equal(window.location.href, 'http://www.example.com');
});
