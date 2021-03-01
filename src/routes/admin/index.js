const express = require('express')
const routes = express.Router()
const SessionController = require('../../app/controllers/admin/session')
const SessionValidator = require('../../app/validators/session')
const { onlyUsers, checkIfLogged } = require('../../app/middlewares/session')
//admin 
const recipes = require('../admin/recipes')
const chefs = require('../admin/chefs')
const users = require('../admin/users')
const profile = require('../admin/profile')

routes.use('/chefs', chefs)
routes.use('/recipes', recipes)
routes.use('/users', users)
routes.use('/profile', profile)

//session
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

routes.get('/reset-password',SessionController.resetForm)
routes.post('/reset-password', SessionValidator.reset, SessionController.reset)

routes.get('/forgot-password',SessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)


//admin recipes route
routes.get('/', onlyUsers, checkIfLogged,(req, res) => {
    return res.redirect('admin/recipes')
})

module.exports = routes