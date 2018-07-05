const knex = require('knex')(require('../knexfile'));

class TodosModel {
  static async getAllTodos() {
    return knex
      .select()
      .table('todos');
  }

  static async getTodoById(id) {
    try {
      const todos = await knex
        .select()
        .from('todos')
        .where('id', id)
        .orderBy('id', 'asc');
      if (todos.length) {
        return todos[0];
      } else {
        throw new Error('no results found');
      }
    } catch(e) {
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
      
      if (oldTodo) {
        const updatedTodo = await knex('todos')
          .where('id', id)
          .update({
            status,
            text,
          })
          .returning(['id', 'text', 'status']);

        if (updatedTodo.length) {
          return updatedTodo[0];
        } else {
          throw new Error('no results found');
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TodosModel;
