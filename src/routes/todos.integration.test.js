const request = require('supertest');
const { startServer } = require('../server.js');

describe('todos', function() {
  let app;

  before(function(done) {
    startServer().then(function(server) {
      app = server;
      done();
    });
  });

  describe('GET todos/', function() {
    it('responds with a 200', function(done) {
      request(app)
        .get('/todos')
        .expect(200, done);
    });
  });
});
