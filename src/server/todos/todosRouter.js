const express = require('express');
const TodosModel = require('./TodosModel');
const TodoHistoryModel = require('./TodoHistoryModel');

const router = express.Router();

router.get('/history', async (req, res) => {
  const allTodoHistoryEvents = await TodoHistoryModel
    .getAllTodoHistoryEvents();

  console.log(JSON.stringify(allTodoHistoryEvents));
  res.json(allTodoHistoryEvents);
});

router.get('/', async (req, res) => {
  const todos = await TodosModel.getAllTodos();

  res.json(todos);
});

router.get('/:id', async (req, res) => {
  try {
    const todo = await TodosModel
      .getTodoById(req.params.id);

    res.json(todo);
  } catch (error) {
    res.status(404).json({ error });
  }
});

router.post('/', async (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ error: 'bad request' });
  } else {
    const newTodo = await TodosModel
      .createTodo(req.body.text);

    await TodoHistoryModel.createCreateEvent(newTodo.id);

    res.json(newTodo);
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

    try {
      const updatedTodo = await TodosModel.updateTodo(requestTodo);

      await TodoHistoryModel.createEditEvent(req.body.id);

      return res.json(updatedTodo);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
});

router.delete('/:id', async (req, res) => {
  const deleteTodo = await TodosModel
    .deleteTodoById(req.params.id);

  const deletionHistoryEvent = await TodoHistoryModel
    .createDeleteEvent(req.params.id);

  res.status(204).json({});
});


module.exports = router;
