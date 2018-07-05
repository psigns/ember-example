import { module, test } from 'qunit';
import {
  click,
  currentURL,
  visit,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | list todos', function(hooks) {
  setupApplicationTest(hooks);

  test('should link to active todos view.', async function (assert) {
    await visit('/');
    await click(".menu__link--active-todos");
    assert.equal(currentURL(), '/active', 'should navigate to active');
  });

  test('should link to completed todos view.', async function (assert) {
    await visit('/');
    await click(".menu__link--completed-todos");
    assert.equal(currentURL(), '/completed', 'should navigate to completed');
  });
});
