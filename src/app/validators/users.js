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

    if(fillAllFields) return res.render('admin/user/create', fillAllFields)

    const { email } = req.body

    const user = await User.findOne({
        where: {email}
    })

    if (user) return res.render('admin/user/create',{
        user: req.body,
        error: "this user already exists"
    })

    next()
   
}

async function update(req, res, next){
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) return res.render('admin/user/create', fillAllFields)

    try {
        let {userId: id} = req.session

    let { email , id: bodyId} = req.body

    const userSession = await User.findOne({
        where: {id}
    })

    if(!userSession.is_admin && userSession.id != bodyId) return res.render('admin/profile', {
        error: "You don't have permission"
    })

    id = bodyId

    const userBody = await User.findOne({
        where: {id}
    })

    const userFindEmail = await User.findOne({
        where: {email}
    })

    if(userFindEmail){
        if(userBody.id != userFindEmail.id){
            return res.render('admin/user/edit', {
                user: req.body,
                error: "This email already exists"
            })
        }
    }

    req.user = userBody

    next()

    }catch(err){
        console.error(err)
        
    }
}

async function ifOwnUser(req, res, next){

    const { userId: id } = req.session

    const {id: bodyId} = req.body

    const user = await User.findOne({
        where: {id}
    })

    if(user.id == bodyId) return res.render('admin/user/edit', {
        user,
        error: "You can't delete your own account!"
    })

    next()
}

module.exports = {
    post,
    ifOwnUser,
    update
}