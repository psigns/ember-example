const express = require('express');
const TodosModel = require('./TodosModel');

const router = express.Router();

router.get('/', async (req, res) => {
  const todos = await TodosModel.getAllTodos();

  res.json(todos);
});

router.get('/:id', (req, res) => {
  TodosModel
    .getTodoById(req.params.id)
    .then(result => res.json(result));
});

router.post('/', async (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ error: 'bad request' });
  } else {
    TodosModel
      .createTodo(req.body.text)
      .then(result => res.json(result));
  }
});


router.put('/:id', async (req, res) => {
  if (!req.body.id || Number(req.params.id) !== Number(req.body.id)) {
    res.status(400).json({ error: "bad request" });
  } else {

    const requestTodo = {
      id: req.body.id,
      text: req.body.text,
      status: req.body.status
    }; 

    const updatedTodo = await TodosModel.updateTodo(requestTodo);

    res.json(updatedTodo);
  }
});


router.delete('/:id', async (req, res) => {
  TodosModel
    .deleteTodoById(req.params.id)
    .then(() => res.status(204).json({}));
});


module.exports = router;
