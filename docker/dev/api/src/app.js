const express = require('express')
const cors = require('cors')
const { errors } = require('celebrate')
const router = require('./routes')
const bodyParser = require('body-parser')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const PORT = 8080
const HOST = '0.0.0.0'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)
app.use(errors())

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      openapi: '1.0.0',
      title: 'BOCA_API',
      description: 'Documentação da API para o projeto BOCA_API para a disciplina de banco de dados 2023/1.',
      version: '1.0.0'
    },
    servers: [`${HOST}:${PORT}`]
  },
  // apis: ['./src/routes.js']
  apis: ['./docker/dev/api/src/routes.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

module.exports = app
