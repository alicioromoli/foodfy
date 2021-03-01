const User = require('../models/admin/Users')

function onlyUsers(req, res, next){
    if (!req.session.userId) return res.render('admin/session/login',{
        login: "please log into the system to access"
    })

    next()
}

function checkIfLogged(req, res, next){
    if (req.session.userId) return res.redirect('/admin/profile')

    next()
}

async function checkIfAdmin(req, res, next){
    const { userId: id } = req.session

    const user = await User.findOne({
        where: {id}
    })
    
    if(user.is_admin != true) return res.render('admin/profile/index', {
        user,
        error: "You don't have an admin account"
    })
    next()
}

module.exports = {
    onlyUsers,
    checkIfLogged,
    checkIfAdmin
}
