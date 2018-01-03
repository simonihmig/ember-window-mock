import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { lookupWindow, mockWindow } from 'ember-window-mock';
import { click } from 'ember-native-dom-helpers';

module('Integration | window rfc232', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    mockWindow(this);
  });

  test('it can mock window in rfc232 style integration tests', async function(assert) {
    assert.expect(1);

    await render(hbs`
    {{#window-tester as |window|}}
      <button {{action window.redirect "http://www.example.com"}}>Redirect</button>
    {{/window-tester}}
  `);

    await click('button');

    let window = lookupWindow(this);

    assert.equal(window.location.href, 'http://www.example.com/');
  });
});
