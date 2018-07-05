import Component from '@ember/component';
import { set } from '@ember/object';

export default Component.extend({
    isComplete: false,

    didReceiveAttrs() {
      this.isComplete = this.get('todo').status === 'COMPLETE';
    },

    actions: {
      toggleComplete(e) {
        let todo = this.get('todo');

        set(todo, 'status', e.target.checked ? 'COMPLETE' : 'INCOMPLETE');
        todo.save();
      },
      deleteTodo() {
        let todo = this.get('todo');

        todo.destroyRecord();
      }
    }
});
