const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Todos home page');
});

router.get('/:id', (req, res) => {
  res.send(`Todo ${req.params.id}`);
});

module.exports = router;
