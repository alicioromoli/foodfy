const { hash } = require('bcryptjs')
const User = require('../../models/admin/Users')
const mailer = require('../../../lib/mailer')
const crypto = require('crypto')

module.exports = {
    loginForm(req, res){
        return res.render('admin/session/login')
    },
    login(req, res){
        
        req.session.userId = req.user.id
        
        return res.render('admin/profile/index', {
            user: req.user,
            success: "You're login into the system"
        })
    },
    logout(req, res){
        req.session.destroy()
        res.render('admin/session/login', {
            success: "You have successfully logged out"
        })
    },
    resetForm(req, res){
        return res.render('admin/session/reset-password', {token: req.query.token})
    },
    async reset(req, res){
        const { user } = req

        const { password, token } = req.body

        try{
            const passwordHash = await hash(password, 8)

            await User.update(user.id, {
                password: passwordHash,
                reset_token: "",
                reset_token_expires: ""
            })

            return res.render('admin/session/login', {
                success: "Reset password successful"
            })

        }catch(err){
            console.error(err)
            return res.render('admin/session/reset-password', {
                user: req.body,
                token: token,
                error: "Inexpect error"
            })
        }
        
    },
    forgotForm(req, res){
        return res.render('admin/session/forgot-password')
    },
    async forgot(req, res){
        let user = req.user

        try{
            const token = crypto.randomBytes(20).toString('hex')

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, ({
                reset_token: token,
                reset_token_expires: now
            }))

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@fooodfy.co.uk',
                subject: 'reset password',
                html: `
                <h2>RESET PASSWORD</h2>
                <p>click in the link below to reset password, only valid for one hour</p>
                <p>
                <a href="http://localhost:5000/admin/reset-password?token=${token}" target="_blank">
                    RESET PASSWORD
                </a>
            </p>
                `
            })

            return res.render('admin/session/login', {
                success: "check your email for reset password"
            })

        }catch(err){
            console.error(err)
        }

    }
}