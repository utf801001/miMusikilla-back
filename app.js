'use strict'

const express = require('express')
const nunjucks = require('nunjucks')
const database = require('./modules/database')
const bearerToken = require('express-bearer-token');
const cors = require("cors");

//middlewares con las rutas
const indexController = require('./controllers/IndexController')
const usersController = require('./controllers/UsersController')
const authController = require('./controllers/AuthController')
const genreController = require('./controllers/GenreController')
const tagController = require('./controllers/TagController')
const projectController = require('./controllers/ProjectController')


//server instance
const app = express()

app.use(bearerToken())
app.use(cors())

//middleware para parsear los cuerpos tipo application/JSON en el cuerpo
app.use(express.json())

//enganchamos los controladores de los diferentes recursos
app.use(indexController)
app.use(usersController)
app.use(authController)
app.use(genreController)
app.use(tagController)
app.use(projectController)

//Conexión a base de datos, descomentar cuando esté configurado.
database.connect()

module.exports = app
