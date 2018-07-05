import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    createTodo(e) {
      if (e.keyCode === 13 && !Ember.isBlank(e.target.value)) {
        const newPost = this.get('store').createRecord('todo', {
          text: e.target.value,
        });

        newPost.save().then(() => {
            // https://github.com/emberjs/data/issues/1829
            let parent = this.store.peekAll('todo');
            let filtered = parent.filter(data => get(data, 'id') === null);

            filtered.forEach(item => item.deleteRecord());
        });

        e.target.value = '';
      }
    }
  }
});
