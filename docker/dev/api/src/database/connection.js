const Pool = require('pg').Pool

const pool = new Pool({
  host: 'boca-db',
  port: 5432,
  user: 'postgres',
  password: 'superpass',
  database: 'bocadb',
})

module.exports = pool
