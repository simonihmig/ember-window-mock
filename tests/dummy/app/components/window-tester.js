import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/window-tester';

export default Component.extend({
  layout,
  window: service(),

  actions: {
    redirect(url) {
      this.get('window').location.href = url;
    }
  }

});
