const express = require('express');
const server = express();
const { Client } = require('pg');
const todoRoutes = require('./routes/todos');


async function startServer() {
  const PORT = process.env['PORT'];
  const client = new Client({
    connectionString: process.env['DATABASE_URL']
  });

  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();

      server.listen(PORT, () => console.log(`Server running on ${PORT}`));
      server.get('/', (req, res) => res.status(200).send('hello'));
      server.use('/todos/', todoRoutes);

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
  startServer
};
