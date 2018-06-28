const { assert } = require('chai');
const request = require('supertest');
const { startServer, db } = require('../server.js');

describe('todos', function() {
  let app;

  before(function(done) {
    startServer().then(function(server) {
      app = server;
      done();
    });
  });

  describe('GET todos/', function() {
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

    it('returns an empty array when database is empty', function() {
      return request(app)
        .get('/todos')
        .expect('Content-Type', /json/)
        .then(response => {
          assert(response.body.length === 0);
        });
    });
  });
});
