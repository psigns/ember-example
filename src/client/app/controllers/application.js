import Controller from '@ember/controller';
import { isBlank } from '@ember/utils';

export default Controller.extend({
  actions: {
    createTodo(e) {
      if (e.keyCode === 13 && !isBlank(e.target.value)) {
        const newPost = this.get('store').createRecord('todo', {
          text: e.target.value,
        });

        newPost.save().then(() => {
            let parent = this.store.peekAll('todo');
            let filtered = parent.filter(data => this.get(data, 'id') === null);

            filtered.forEach(item => item.deleteRecord());
        });

        e.target.value = '';
      }
    }
  }
});
