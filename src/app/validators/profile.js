const User = require('../models/admin/Users')


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
async function post(req, res, next){
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) return res.render('admin/profile/index',{
        user: req.body,
        error: "please fill all fields"
    })

    const {email} = req.body

    const user = await User.findOne({
        where: {email}
    })

    if(!user) return res.render('admin/session/login', {
        user: req.body,
        error: "Sorry, invalid email"
    })

    req.user = user

    next()
}

module.exports = {
    post
}