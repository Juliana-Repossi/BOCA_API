'use strict';

const app = require('./app')

const PORT = 8080
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
  console.log(`Swagger docs running on http://${HOST}:${PORT}/docs`)
});
