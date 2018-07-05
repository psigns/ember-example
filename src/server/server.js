const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const todosRouter = require('./todos/todosRouter');
const path = require('path');
const { baseTodoRoute } = require('./constants/RouteConstants');


async function startServer() {
  const PORT = process.env.PORT;


  return new Promise(async (resolve, reject) => {
    try {

      app.use(bodyParser.json());

      app.use(express.static(path.join(__dirname, '../client/dist/')));

      app.use(baseTodoRoute, todosRouter);

      app.listen(PORT, () => console.log(`Server running on ${PORT}`));

      resolve(app);

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
