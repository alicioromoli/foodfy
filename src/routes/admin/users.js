const express = require('express')
const routes = express.Router()
const users = require('../../app/controllers/admin/users')
const UserValidator = require('../../app/validators/users')
const { onlyUsers, checkIfAdmin } = require('../../app/middlewares/session')

routes.get('/', onlyUsers, checkIfAdmin, users.index)
routes.get('/create', onlyUsers, checkIfAdmin, users.create)
routes.get('/edit/:id', onlyUsers, checkIfAdmin, users.edit)

routes.post('/', UserValidator.post, users.post)
routes.delete('/', UserValidator.ifOwnUser, users.delete)
routes.put('/', UserValidator.update, users.update)



module.exports = routes
