const express = require('express')
const routes = express.Router()
const profile = require('../../app/controllers/admin/profile')
const PorfileValidator = require('../../app/validators/profile')
const { onlyUsers } = require('../../app/middlewares/session')

routes.get('/', onlyUsers, profile.index)


routes.post('/', PorfileValidator.post, profile.post)


module.exports = routes