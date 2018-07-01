const { assert } = require('chai');
const request = require('supertest');
const { startServer, db } = require('../../server.js');
const TodosModel = require('../TodosModel');
const deleteIntegrationTests = require('./integration/todosDeleteIntegrationTest');
const postIntegrationTests = require('./integration/todosPostIntegrationTest');
const getIntegrationTests = require('./integration/todosGetIntegrationTest');
const putIntegrationTests = require('./integration/todosPutIntegrationTest');

deleteIntegrationTests();
postIntegrationTests();
getIntegrationTests();
putIntegrationTests();
