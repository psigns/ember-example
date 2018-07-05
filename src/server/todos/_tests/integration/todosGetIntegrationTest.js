const { assert } = require('chai');
const request = require('supertest');
const { startServer } = require('../../../server.js');
const TodosModel = require('../../TodosModel');
const TodoHistoryModel = require('../../TodoHistoryModel');
const { baseTodoRoute } = require('../../../constants/RouteConstants');


module.exports = function() {
  describe('GET todos/ listing', function() {
    let app;

    before(async function() {
      app = await startServer();
    });

    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
      await TodoHistoryModel.deleteAllTodoHistoryEvents();
    });

    it('responds with a 200', function() {
      return request(app)
        .get(baseTodoRoute)
        .expect(200);
    });

    it('returns json content type', function() {
      return request(app)
        .get(baseTodoRoute)
        .expect('Content-Type', /json/);
    });

    it('returns an empty array when no todo in database', async function() {
      const response = await request(app)
        .get(baseTodoRoute)
        .expect('Content-Type', /json/);

      assert(response.body.todos.length === 0);
    });

    it('returns array of all todos when database is not empty', async function() {
      await TodosModel.createTodo('todo 1');
      await TodosModel.createTodo('todo 2');
      await TodosModel.createTodo('todo 3');

      return request(app)
        .get(baseTodoRoute)
        .expect('Content-Type', /json/)
        .then(response => {
          assert(response.body.todos.length === 3);
          assert(response.body.todos[0].text === 'todo 1');
          assert(response.body.todos[1].text === 'todo 2');
          assert(response.body.todos[2].text === 'todo 3');
          assert(response.body.todos.every(todo => todo.status === 'INCOMPLETE'));
          assert(response.body.todos.every(todo => todo.hasOwnProperty('id')));
        });
    });
  });

  describe('GET todos/:id', function() {
    let app;

    before(function(done) {
      startServer().then(function(server) {
        app = server;
        done();
      });
    });

    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
      await TodoHistoryModel.deleteAllTodoHistoryEvents();
    });

    it('returns a single todo object with the correct id', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .get(`${baseTodoRoute}/${todo.id}`);

      assert(response.body.text === todo.text);
      assert(response.body.id === todo.id);
    });
  

    it('returns a 404 if no todo with id is found in the database', async function() {
      const response = await request(app)
        .get(`${baseTodoRoute}/${1115}`);

      assert(response.status === 404);
    });

  });

  describe('GET todos/history', function() {
    let app;

    before(function(done) {
      startServer().then(function(server) {
        app = server;
        done();
      });
    });

    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
      await TodoHistoryModel.deleteAllTodoHistoryEvents();
    });


    it('returns a list of todo history events', async function() {
      const postResponse = await request(app)
        .post(baseTodoRoute)
        .send({ todo: { text: 'a new todo' }});

      const historyResponse = await request(app)
        .get(`${baseTodoRoute}/history`);

      assert(historyResponse.body.length === 1);
    });
  });
};
