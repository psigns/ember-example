const { assert } = require('chai');
const request = require('supertest');
const { startServer, db } = require('../server.js');
const TodosModel = require('./TodosModel');


describe('todos', function() {
  let app;

  before(function(done) {
    startServer().then(function(server) {
      app = server;
      done();
    });
  });

  beforeEach(async function() {
    await TodosModel.deleteAllTodos();
  });

  describe('GET todos/ listing', function() {
    it('responds with a 200', function() {
      return request(app)
        .get('/todos')
        .expect(200);
    });

    it('returns json content type', function() {
      return request(app)
        .get('/todos')
        .expect('Content-Type', /json/);
    });

    it('returns an empty array when no posts in database', async function() {
      const response = await request(app)
        .get('/todos')
        .expect('Content-Type', /json/);

      assert(response.body.length === 0);
    });

    it('returns array of all todos when database is not empty', async function() {
      await TodosModel.createTodo('todo 1');
      await TodosModel.createTodo('todo 2');
      await TodosModel.createTodo('todo 3');

      return request(app)
        .get('/todos')
        .expect('Content-Type', /json/)
        .then(response => {
          assert(response.body.length === 3);
          assert(response.body[0].text === 'todo 1');
          assert(response.body[1].text === 'todo 2');
          assert(response.body[2].text === 'todo 3');
          assert(response.body.every(todo => todo.status === 'INCOMPLETE'));
          assert(response.body.every(todo => todo.hasOwnProperty('id')));
        });
    });
  });

  describe('GET todos/:id', function() {
    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
    });

    it('returns a single todo object with the correct id', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .get(`/todos/${todo.id}`);

      assert(response.body.text === todo.text);
      assert(response.body.id === todo.id);
    });
    

    it('returns a 404 if no post with id is found in the database', async function() {
      const response = await request(app)
        .get(`/todos/${1115}`);

      assert(response.status === 404);
    });
  });

  describe('POST todos/', function() {
    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
    });

    it('creates a new todo in the database', async function() {
      const todo = await TodosModel.createTodo('todo 1');
      const allTodosFromDb = await TodosModel.getAllTodos(); 

      assert(allTodosFromDb.length === 1);
    });

    it('returns newly created todo in response body', async function() {
      const newTodoText = 'a new todo';
      const response = await request(app)
        .post('/todos')
        .send({ text: newTodoText });

      assert(response.body.hasOwnProperty('id'));
      assert(response.body.hasOwnProperty('status'));
      assert(response.body.hasOwnProperty('text'));
      assert(response.body.text === newTodoText);
    });

    it('newly created todos have INCOMPLETE status', async function() {
      const newTodoText = 'a new todo';
      const response = await request(app)
        .post('/todos')
        .send({ text: newTodoText });

      assert(response.body.status === 'INCOMPLETE');
    });
  });

  describe('DELETE todos/:id', function() {
    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
    });

    it('deletes an existing record', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .delete(`/todos/${todo.id}`);

      const allTodos = await TodosModel.getAllTodos(); 

      assert(allTodos.length === 0);
    });
  });
});
