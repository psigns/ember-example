const knex = require('knex')(require('../knexfile'));

class TodosModel {
  static async getAllTodos() {
    return knex
      .select()
      .table('todos');
  }

  static async getTodoById(id) {
    return knex('todos').where('id', id);
  }

  static async createTodo(text) {
    return knex('todos')
      .insert({
        text,
        status: 'INCOMPLETE',
      })
      .returning(['id', 'text', 'status']);
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
