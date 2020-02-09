import Component from '@ember/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';

export default class WindowTesterComponent extends Component {

  counter = +window.localStorage.getItem('counter') || 1;

  @action
  redirect(url) {
    window.location.href = url;
  }

  @action
  increment() {
    this.incrementProperty('counter');
    window.localStorage.setItem('counter', this.get('counter'));
  }

}
