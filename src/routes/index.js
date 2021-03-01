const express = require('express')
const routes = express.Router()
const admin = require('../routes/admin/index')

const website = require('../app/controllers/website/website')

//website route
routes.get('/', website.home)
routes.get('/recipes', website.recipes)
routes.get('/recipes/:id', website.showRecipe)
routes.get('/about', website.about)
routes.get('/chefs', website.chefs)

routes.use('/admin', admin)


// //  alias
// routes.get('/ads/create', (req, res) => {
//     return res.redirect('/products/create')
// })

// routes.get('/accounts', (req, res) => {
//     return res.redirect('/users/login')
// })

module.exports = routes