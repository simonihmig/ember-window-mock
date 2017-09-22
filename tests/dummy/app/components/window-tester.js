import Ember from 'ember';
import layout from '../templates/components/window-tester';

export default Ember.Component.extend({
  layout,
  window: Ember.inject.service(),

  actions: {
    redirect(url) {
      this.get('window').location.href = url;
    }
  }

});
