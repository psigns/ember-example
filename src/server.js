const express = require('express');
const server = express();
const todosRouter = require('./todos/todosRouter');
const bodyParser = require('body-parser'); 


async function startServer() {
  const PORT = process.env.PORT;


  return new Promise(async (resolve, reject) => {
    try {

      server.use(bodyParser.json())
      server.get('/', (req, res) => res.status(200).send('hello'));
      server.use('/todos/', todosRouter);
      server.listen(PORT, () => console.log(`Server running on ${PORT}`));

      resolve(server);

    } catch (error) {
      console.log(JSON.stringify(error));
      reject(error);
    }
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  startServer,
};
