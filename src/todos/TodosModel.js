const knex = require('knex')(require('../knexfile'));

class TodosModel {
  static async getAllTodos() {
    return knex
      .select()
      .table('todos');
  }

  static async getTodoById(id) {
    const todos = await knex('todos').where('id', id);

    if (todos.length) {
      return todos[0];
    } else {
      throw new Error('no results found');
    }
  }

  static async createTodo(text) {
    const todos = await knex('todos')
      .insert({
        text,
        status: 'INCOMPLETE',
      })
      .returning(['id', 'text', 'status']);

    return todos.length ? todos[0] : null;
  }

  static async deleteAllTodos() {
    return knex('todos')
      .del();
  }

  static async deleteTodoById(id) {
    return knex('todos')
      .where('id', id)
      .del();
  }

  static async updateTodo(updatedTodo) {
    const { id, text, status } = updatedTodo;

    try {
      const oldTodo = await this.getTodoById(id);
      
      if (oldTodo && oldTodo.length) {
        return knex('todos')
          .where('id', id)
          .update({
            status,
            text,
          });
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TodosModel;
