import Component from '@ember/component';
import layout from '../templates/components/window-tester';
import window from 'ember-window-mock';

export default Component.extend({
  layout,

  actions: {
    redirect(url) {
      window.location.href = url;
    }
  }

});
