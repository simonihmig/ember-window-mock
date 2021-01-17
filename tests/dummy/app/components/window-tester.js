import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class WindowTesterComponent extends Component {
  @tracked
  counter = +window.localStorage.getItem('counter') || 1;

  @action
  redirect(url) {
    window.location.href = url;
  }

  @action
  increment() {
    this.counter++;
    window.localStorage.setItem('counter', this.counter);
  }

}
