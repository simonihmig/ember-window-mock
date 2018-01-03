'use strict';

module.exports = {
  name: 'ember-window-mock',


  treeForAddonTestSupport(tree) {
    // intentionally not calling _super here
    // so that can have our `import`'s be
    // import { mockWindow } from 'ember-window-mock';
    // shamelessly stolen from https://github.com/cibernox/ember-native-dom-helpers/blob/19adea1683fc386baca6eb7c83cd0a147bd4d586/index.js

    const Funnel = require('broccoli-funnel');

    let namespacedTree = new Funnel(tree, {
      srcDir: '/',
      destDir: `/${this.moduleName()}`,
      annotation: `Addon#treeForTestSupport (${this.name})`,
    });

    return this.preprocessJs(namespacedTree, '/', this.name, {
      registry: this.registry,
    });
  }
};
