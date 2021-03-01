const User = require('../models/admin/Users')
const { compare } = require('bcryptjs')

function checkAllFields(body){
    const keys = Object.keys(body)

    for(key of keys){
        if(body[key] == ""){
            return {
                error: "please fill all fields"
            }
        }
    }
}

async function login(req ,res, next){
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) return res.render('admin/session/login',{
        user: req.body,
        error: "please fill all fields"
    })

    let {password, email} = req.body

    const user = await User.findOne({
        where: {email}
    })

    if(!user) return res.render('admin/session/login', {
        user: req.body,
        error: "Sorry, invalid email"
    })

    const passed = await compare(password, user.password)

    if(!passed) return res.render('admin/session/login', {
        user: req.body,
        error: "Sorry wrong password!"
    })

    req.user = user

    next()
}

async function reset(req, res, next){
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) return res.render('admin/session/reset-password',{
        user: req.body,
        error: "please fill all fields"
    })
    const { password, passwordRepeat, email, token } = req.body

    const user = await User.findOne({
        where: {email}
    })

    if(!user) return res.render('admin/session/reset-password', {
        token: token,
        user: req.body,
        error: "Sorry, invalid email"
    })

    if(password != passwordRepeat) return res.render('admin/session/reset-password', {
        token: token,
        user: req.body,
        error: "Sorry, password mismatch!"
    })
    if(token != user.reset_token) return res.render('admin/session/reset-password', {
        token: token,
        user: req.body,
        error: "Invalid token"
    })
    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires) return res.render('admin/session/reset-password', {
        token: token,
        user: req.body,
        error: "Expired token"
    })

    req.user = user

    next()

}

async function forgot(req, res, next){
    const {email} = req.body

    try {
        const user = await User.findOne({
            where: {email}
        })
    
        if(!user) return res.render('admin/session/forgot-password', {
            token: token,
            user: req.body,
            error: "Sorry, email not found"
        })

        req.user = user

        next()

    }catch(err){
        console.error(err)

    }
}

module.exports = {
    login,
    reset,
    forgot
}