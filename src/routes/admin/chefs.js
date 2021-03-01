const express = require('express')
const routes = express.Router()
const multer = require('../../app/middlewares/multer')
const chefs = require('../../app/controllers/admin/chefs')
const { onlyUsers, checkIfAdmin } = require('../../app/middlewares/session')

routes.get('/', onlyUsers, chefs.index)
routes.get('/create', onlyUsers, chefs.create)
routes.get('/:id', onlyUsers, chefs.show)
routes.get('/:id/edit', onlyUsers, checkIfAdmin, chefs.edit)

routes.post('/', multer.single('avatar'), checkIfAdmin, chefs.post)
routes.put('/', multer.single('avatar'), checkIfAdmin, chefs.put)
routes.delete('/', checkIfAdmin, chefs.delete)


module.exports = routes