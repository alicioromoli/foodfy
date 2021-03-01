const express = require('express')
const routes = express.Router()
const multer = require('../../app/middlewares/multer')
const recipes = require('../../app/controllers/admin/recipes')
const { onlyUsers } = require('../../app/middlewares/session')
const RecipeValidator = require('../../app/validators/recipes')

routes.get('/', onlyUsers, recipes.index)
routes.get('/create', onlyUsers, recipes.create)
routes.get('/:id', onlyUsers, recipes.show)
routes.get('/:id/edit', onlyUsers, recipes.edit)

routes.post('/', multer.array('photo', 5), recipes.post)
routes.put('/', multer.array('photo', 5), RecipeValidator.put, recipes.put)
routes.delete('/', recipes.delete)

module.exports = routes