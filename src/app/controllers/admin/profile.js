const { hash } = require('bcryptjs')
const User = require('../../models/admin/Users')

module.exports = {
    async index(req, res){
        const { userId: id } = req.session

        const user = await User.findOne({
            where: {id}
        })
        
        return res.render('admin/profile/index', {user})
    },
    async post(req, res){
        const user = req.user
        const { password } = req.body

        const passwordHash = await hash(password, 8)

        await User.update(user.id, {
            password: passwordHash
        })

        return res.render('admin/profile/index', {
            user: user,
            success: "update password sucessful"
        })
    }
}