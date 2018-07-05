const express = require('express');
const TodosModel = require('./TodosModel');
const TodoHistoryModel = require('./TodoHistoryModel');

const router = express.Router();

router.get('/history', async (req, res) => {
  const allTodoHistoryEvents = await TodoHistoryModel
    .getAllTodoHistoryEvents();

  res.json(allTodoHistoryEvents);
});

router.get('/', async (req, res) => {
  const todos = await TodosModel.getAllTodos();

  res.json({ todos });
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
  if (!req.body.todo.text) {
    res.status(400).json({ error: 'bad request' });
  } else {
    const newTodo = await TodosModel
      .createTodo(req.body.todo.text);

    await TodoHistoryModel.createCreateEvent(newTodo.id);

    res.json({ todo: newTodo });
  }
});

router.put('/:id', async (req, res) => {
  const requestTodo = {
    id: req.params.id,
    text: req.body.todo.text,
    status: req.body.todo.status
  }; 

  try {
    const updatedTodo = await TodosModel.updateTodo(requestTodo);

    await TodoHistoryModel.createEditEvent(req.params.id);

    return res.json({ todo: updatedTodo });
  } catch (error) {
    res.status(404).json({ error });
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
