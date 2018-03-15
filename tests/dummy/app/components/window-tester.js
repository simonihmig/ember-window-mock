import Component from '@ember/component';
import layout from '../templates/components/window-tester';
import window from 'ember-window-mock';

export default Component.extend({
  layout,

  counter: 0,

  init() {
    this._super(...arguments);

    this.set('counter', +window.localStorage.getItem('counter') || 1);
  },

  actions: {
    redirect(url) {
      window.location.href = url;
    },

    increment() {
      this.incrementProperty('counter');
      window.localStorage.setItem('counter', this.get('counter'));
    }
  }

});
