import Component from '@ember/component';
import { set } from '@ember/object';
import { isBlank } from '@ember/utils';

export default Component.extend({
    isComplete: false,
    isEditable: false,

    didReceiveAttrs() {
      this.isComplete = this.get('todo').status === 'COMPLETE';
    },

    actions: {
      deleteTodo() {
        let todo = this.get('todo');

        todo.destroyRecord();
      },

      doneEditing(todoText) {
        if (!this.get('isEditable')) { return; }
        if (isBlank(todoText)) {
          this.deleteTodo();
        } else {
          let todo = this.get('todo');

          this.set('isEditable', false);
          set(todo, 'text', todoText);
          todo.save();
        }
      },

      handleKeydown(e) {
        if (e.keyCode === 13) {
          e.target.blur();
        } else if (e.keyCode === 27) {
          this.set('isEditable', false);
        }
      },
      setToEditableIfIncomplete() {
        if (!this.isComplete) {
          this.set('isEditable', true);
        }
      },
      toggleComplete(e) {
        let todo = this.get('todo');

        this.set('isComplete', !this.isComplete);
        set(todo, 'status', e.target.checked ? 'COMPLETE' : 'INCOMPLETE');
        todo.save();
      },
    }
});
