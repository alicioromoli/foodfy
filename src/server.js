const express = require('express')
const server = express()
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')

server.use(session)
server.use((req, res, next)=> {
    res.locals.session = req.session

    next()
})
server.use(express.urlencoded({extended: true}))

/* this trigger every time when the web receive a request, 
in this case express.static is used for static files on the path 'public' */
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)
//set the view engine
server.set('view engine', 'njk')

// configuration of nunjucks
nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5000, () => {
    console.log('server is running')
})