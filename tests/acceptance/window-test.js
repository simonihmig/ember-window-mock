import { click, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import window from 'ember-window-mock';

module('Acceptance | window', function(hooks) {
  setupApplicationTest(hooks);

  test('it can mock window in acceptance tests', async function(assert) {
    await visit('/');
    await click('button');

    assert.equal(window.location.href, 'http://www.example.com/');
  });
});
