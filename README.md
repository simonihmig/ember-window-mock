# ember-window-mock

[![Build Status](https://travis-ci.org/kaliber5/ember-window-mock.svg?branch=master)](https://travis-ci.org/kaliber5/ember-window-mock)

This Ember.js addon provides the `window` global as a service that you can inject into any component or controller where
you need `window`. But some of its properties and functions like `location.href` or `alert` are prohibitive to be used 
in tests, so this service will be replaced in tests with one that mocks these critical parts.

## How to use it in your app

Let's say you want to redirect to an external URL. A simple controller could look like this:

```js
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    redirect(url) {
      window.location.href = url;
    }
  }
})
``` 

With this addon, you can rewrite it like this to access `window` through an injected service rather than through the 
global:

```js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  window: service(),
  
  actions: {
    redirect(url) {
      this.get('window').location.href = url;
    }
  }
})
```  

Apart from getting access to it, everything else works as you would expect, since the "service" is exactly the same as
the global. Note: since it's the same as the global `window`, it does *not* inherit form `Ember.Service`!

## How to use in tests

Although `ember test` runs in a normal browser (e.g. PhantomJS or headless Chrome) where you can directly use 
`window` and its properties, some of them are prohibitive to use in tests as they will break the test run:
* you cannot set `window.location.href` to trigger a redirect, as that will leave your test page
* `alert`, `confirm` and `prompt` are blocking calls, and cannot be closed without user interaction, so they will just
suspend your test run

To workaround this, we can replace the normal window service with a special version that is suitable for tests

### The window-mock service

This service is a drop-in replacement for the normal window service in tests. It is a proxy to `window`, so all of the 
non-critical properties and functions just use the normal `window` global. But the critical parts are replaced suitable 
for tests:
* `window.location` is mocked with an object with the same API (members like `.href` or `.host`), but setting 
`location.href` will just do nothing. Still reading from `location.href` will return the value that was previously set, 
so you can run assertions against that value to check if you app tried to redirect to the expected URL.
* `alert`, `confirm` and `prompt` are replaced by simple noop functions (they do nothing). You can use a mocking library
like [Sinon.js](http://sinonjs.org/) to replace them with spies or stubs to assert that they have been called or to 
return some predefined value (e.g. `true` for `confirm`).

See below for some examples.

**Important:**
* The `window-mock` service works by using an ES6 `Proxy`, so **your tests need to run in a browser like Chrome that 
supports `Proxy` natively** (as it cannot be transpiled by Babel) 
* Note that this will only work when you use these function through the service, and not by using the globals (e.g. 
`window.alert` or  simply `alert`)

## Acceptance tests

The addons default initializer will automatically register the special `window-mock` as `service:window` when used in 
tests, so you don't have to care about this. Given a controller like the one above, that redirect to some URL when a 
button is clicked, an acceptance test could like this:

```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { click, visit } from 'ember-native-dom-helpers';
import { lookupWindow } from 'ember-window-mock';

moduleForAcceptance('Acceptance | redirect');

test('it redirects when clicking the button', async function(assert) {
  await visit('/');
  await click('button');

  let window = lookupWindow(this);
  assert.equal(window.location.href, 'http://www.example.com');
});
```

Note the import and use of the `lookupWindow` helper provided by this addon to get access to the window service instance
in your test.

## Integration tests

In integration tests the initializer will not be executed automatically, so you can use the `mockWindow` helper to 
register the mocked service instead of the normal one. 

Here is an example that uses [ember-sinon-qunit](https://github.com/elwayman02/ember-sinon-qunit) to replace `confirm`, 
so you can easily check if it has been called, and to return some defined value:

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { lookupWindow, mockWindow } from 'ember-window-mock';
import { click } from 'ember-native-dom-helpers';

moduleForComponent('my-component', 'Integration | my-component', {
  integration: true,

  beforeEach() {
    mockWindow(this);
  }
});

test('it deletes an item', async function(assert) {
  let window = lookupWindow(this);
  let stub = this.stub(window, 'confirm');
  stub.returns(true);
  
  this.render(hbs`{{my-component}}`);
  await click('.delete');
  
  assert.ok(stub.calledOnce);
  assert.ok(stub.calledWith('Are you sure?'));
});
``` 

