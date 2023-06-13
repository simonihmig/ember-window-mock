# ember-window-mock

[![CI](https://github.com/kaliber5/ember-window-mock/actions/workflows/ci.yml/badge.svg)](https://github.com/kaliber5/ember-window-mock/actions/workflows/ci.yml)
[![Ember Observer Score](https://emberobserver.com/badges/ember-window-mock.svg)](https://emberobserver.com/addons/ember-window-mock)
[![npm version](https://badge.fury.io/js/ember-window-mock.svg)](https://badge.fury.io/js/ember-window-mock)

This Ember CLI addon provides the `window` global as an ES6 module import that you can use in any component or controller where
you need `window`. But some of its properties and functions are prohibitive to be used
in tests as they will break the test run:

- you cannot set `window.location.href` to trigger a redirect, as that will leave your test page
- `alert`, `confirm` and `prompt` are blocking calls, and cannot be closed without user interaction, so they will just
  suspend your test run

So when running tests this import will be replaced with one that mocks these critical parts.

## Compatibility

- Ember.js v4.4 or above
- Ember CLI v4.4 or above
- Node.js v16 or above

## Installation

```
ember install ember-window-mock
```

## Usage

### How to use it in your app

Let's say you want to redirect to an external URL. A simple controller could look like this:

```js
import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class IndexController extends Controller {
  @action
  redirect(url) {
    window.location.href = url;
  }
}
```

With this addon, you can just import `window` instead of using the global:

```js
import Controller from "@ember/controller";
import { action } from "@ember/object";
import window from "ember-window-mock";

export default class IndexController extends Controller {
  @action
  redirect(url) {
    window.location.href = url;
  }
}
```

Everything else works as you would expect, since the import is exactly the same as the global, when not running tests.

### The window mock

When running in the test environment, the import will be replaced with a mock. It is a proxy to `window`, so all of the
non-critical properties and functions just use the normal `window` global. But the critical parts are replaced suitable
for tests:

- `window.location` is mocked with an object with the same API (members like `.href` or `.host`), but setting
  `location.href` will just do nothing. Still reading from `location.href` will return the value that was previously set,
  so you can run assertions against that value to check if you app tried to redirect to the expected URL.
- `window.localStorage` is also mocked with an object with the same API (`getItem`, `setItem`, `removeItem`, `clear`, `key`, and `length`). Storage is not persistent and does not affect your browser's `localStorage` object.
- `window.sessionStorage` is mocked similar to `window.localStorage`.
- `alert`, `confirm` and `prompt` are replaced by simple noop functions (they do nothing). You can use a mocking library
  like [Sinon.js](http://sinonjs.org/) to replace them with spies or stubs to assert that they have been called or to
  return some predefined value (e.g. `true` for `confirm`).

Moreover it allows you to set any (nested) properties, even if they are defined as read only. This way you can pretend
different environments in your tests. For example you can fake different devices by changing

- `window.navigator.userAgent` when you do user agent detection in your app.
- `window.screen.width` to test responsive layouts when your components render differently based on it.

See below for some examples.

**Important:**

- The window mock works by using an ES6 `Proxy`, so **your development environment and tests need to run in a browser like Chrome that
  supports `Proxy` natively** (as it cannot be transpiled by Babel)
- Note that this will only work when you use these function through the import, and not by using the global directly.

### Resetting the state in tests

It is possible to leak some state on the window mock between tests. For example when your app sets `location.href` in a
test like this:

```js
window.location.href = "http://www.example.com";
```

For the following test `window.location.href` will still be `'http://www.example.com'`, but instead it should have a
fresh instance of the window mock. Therefore this addon exports a `setupWindowMock` function to kill all changed state on `window`:

```js
import { setupWindowMock } from 'ember-window-mock/test-support';

module('SidebarController', function(hooks) {
  setupWindowMock(hooks);

  test(...);
});
```

### Test examples

#### Mocking `window.location`

Given a controller like the one above, that redirects to some URL when a button is clicked, an application test could like this:

```js
import { module, test } from "qunit";
import { click, visit } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import window from "ember-window-mock";
import { setupWindowMock } from "ember-window-mock/test-support";

module("Acceptance | redirect", function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test("it redirects when clicking the button", async function (assert) {
    await visit("/");
    await click("button");

    assert.equal(window.location.href, "http://www.example.com");
  });
});
```

#### Mocking `confirm()`

Here is an example that uses [ember-sinon-qunit](https://github.com/elwayman02/ember-sinon-qunit) to replace `confirm`,
so you can easily check if it has been called, and to return some defined value:

```js
import { module, test } from "qunit";
import { click, visit } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import window from "ember-window-mock";
import { setupWindowMock } from "ember-window-mock/test-support";
import sinon from "sinon";

module("Acceptance | redirect", function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test("it deletes an item", async function (assert) {
    let stub = sinon.stub(window, "confirm");
    stub.returns(true);

    await visit("/");
    await click("[data-test-delete]");

    assert.ok(stub.calledOnce);
    assert.ok(stub.calledWith("Are you sure?"));
  });
});
```

#### Mocking `open()`

Here is an example that assigns a new function to replace `open`.
You can check if the function has been called as well as the value of its parameters.

```js
import { module, test } from "qunit";
import { click, visit } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import window from "ember-window-mock";
import { setupWindowMock } from "ember-window-mock/test-support";

module("Acceptance | new window", function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test("it opens a new window when clicking the button", async function (assert) {
    await visit("/");
    window.open = (urlToOpen) => {
      assert.equal(urlToOpen, "http://www.example.com/some-file.jpg");
    };
    await click("button");
  });
});
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
