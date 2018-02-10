import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { click, visit } from 'ember-native-dom-helpers';
import window from 'ember-window-mock';

moduleForAcceptance('Acceptance | window');

test('it can mock window in acceptance tests', async function(assert) {
  await visit('/');
  await click('button');

  assert.equal(window.location.href, 'http://www.example.com/');
});
