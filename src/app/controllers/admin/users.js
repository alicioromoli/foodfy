const User = require('../../models/admin/Users')
const mailer = require('../../../lib/mailer')
const crypto = require('crypto')
const { hash } = require('bcryptjs')  
const generator = require('generate-password');

module.exports = {
    async index(req, res){
        const users = await User.findAll()

        return res.render('admin/user/index', { users })
    },
    create(req, res){
        return res.render('admin/user/create')
    },
    async post(req, res){
        let { name, email, is_admin } = req.body

        const password = generator.generate({
            length: 10,
            numbers: true
        });

        const passwordHash = await hash(password, 8)

        const token = crypto.randomBytes(20).toString('hex')

        const values = {
            name,
            email,
            password: passwordHash,
            reset_token: token,
            is_admin: is_admin || false
    }

        const userId = await User.create(values)
        req.session.userId = userId

        await mailer.sendMail({
            to: req.body.email,
            from: 'no-reply@launchstore.co.uk',
            subject: 'Reset password',
            html: `
            <h2>RESET PASSWORD</h2>
            <p>your password is : ${password}
            <p>you can reset your password when login into the system
            <p>click below to acess your account </p>
            <p>
                <a href="http://localhost:5000/admin/login" target="_blank">
                    Foodfy
                </a>
            </p>
            `
        })
        
        const users = await User.findAll()

        return res.render('admin/user/index', {
            users:users,
            success: "check email to reset password"
        })
    },
    async edit(req, res){
        try{
            const { id } = req.params
    
        const user = await User.findOne({
            where: { id }
        })

        return res.render('admin/user/edit', { user })
        }catch(err){
            console.log(err)
            return res.send("Some error has occurred or page doesn’t exist")
        }
    },
    async update(req, res){
        let { name, email, is_admin, id } = req.body

        try{
            await User.update(id, {
                name,
                email,
                is_admin: is_admin || false
            })
    
            return res.render('admin/user/edit', {
                user: req.body,
                success: "Update has been successfully"
            })
            
        }catch(err){
            console.error(err)
            return res.render('admin/user/edit', {
                user: req.body,
                error: "An error occurred"
            })

        }
    },
    async delete(req, res){
        const {id} = req.body
        await User.delete(id)

        const users = await User.findAll()

        return res.render('admin/user/index', {
            users: users,
            success: "User has been deleted successfully"
        })
    }
}