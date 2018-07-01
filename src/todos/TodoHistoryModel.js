const knex = require('knex')(require('../knexfile'));

class TodoHistoryModel {
  static async getAllTodoHistoryEvents() {
    return knex
      .select()
      .table('todo_history');
  }

  static async deleteAllTodoHistoryEvents() {
    return knex('todo_history')
      .del();
  }

  static async createCreateEvent(todo_id) {
    const newHistoryEvent = await knex('todo_history')
      .insert({
        todo_id,
        action: {
          type: 'CREATE',
        },
      })
      .returning(['id', 'action', 'date', 'todo_id']);

    return newHistoryEvent.length ? newHistoryEvent[0] : null;
  }

  static async createDeleteEvent(todo_id) {
    const newHistoryEvent = await knex('todo_history')
      .insert({
        todo_id,
        action: {
          type: 'DELETE',
        },
      })
      .returning(['id', 'action', 'date', 'todo_id']);

    return newHistoryEvent.length ? newHistoryEvent[0] : null;
  }

  static async createEditEvent(todo_id) {
    const newHistoryEvent = await knex('todo_history')
      .insert({
        todo_id,
        action: {
          type: 'EDIT',
        },
      })
      .returning(['id', 'action', 'date', 'todo_id']);

    return newHistoryEvent.length ? newHistoryEvent[0] : null;
  }
}

module.exports = TodoHistoryModel;
