import Route from '@ember/routing/route';

export default Route.extend({
    async model() {
      const allTodos = await this.get('store').findAll('todo');

      return allTodos.filter(todo => todo.status === 'COMPLETE');
    }
});
