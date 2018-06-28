module.exports = {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      searchPath: ['knex', 'public'],
}
