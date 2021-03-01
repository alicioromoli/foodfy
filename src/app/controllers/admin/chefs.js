const Chef = require('../../models/admin/Chef')
const File = require('../../models/admin/File')
const FileRecipe = require('../../models/admin/FileRecipe')

module.exports = {
    async index(req, res){

        let results = await Chef.all()
        const chefPromise = results.rows.map(chef => ({
            ...chef,
            avatar_path: `${req.protocol}://${req.headers.host}${chef.avatar_path.replace('public', "")}`
        }))

        const chefs = await Promise.all(chefPromise)

        return res.render('admin/chefs/index', { chefs })
    },
    create(req, res){
        return res.render('admin/chefs/create')
    },
    async show(req, res){
        const { id } = req.params

        let results = await Chef.findBy(id)
        const chef = results.rows[0]

        results = await Chef.findAvatar(chef.file_id)
        const file = results.rows[0]

        results = await Chef.recipesChef(id)
        const promiseRecipes = results.rows.map(async recipe => {
            const results = await FileRecipe.findPath(recipe.id)
            const file = results.rows[0]
            
            const filePath = {
                ...file,
            }
            filePath.path = `${req.protocol}://${req.headers.host}${String(filePath.path).replace('public', "")}`

        return {
            ...recipe,
            ...filePath
        }
    })

    const recipes = await Promise.all(promiseRecipes)

    let now = new Date()
        now = {
            hour: now.getHours(),
            minute: now.getMinutes(),
            seconds: now.getSeconds()
        }

        let success = false

        if(chef.is_creating){
            let messageConfimationAct = new Date(chef.created_at)
            messageConfimationAct = {
            hour: messageConfimationAct.getHours(),
            minute: messageConfimationAct.getMinutes(),
            seconds: messageConfimationAct.getSeconds()
            }

            if(now.hour == messageConfimationAct.hour && now.minute == messageConfimationAct.minute && now.seconds == messageConfimationAct.seconds){
                success = "created successfully"
            }

            await Chef.updateSet(req.params.id,{
                is_creating: false
            })
        }

        if(chef.is_updating) {
            let messageConfimationAct = new Date(chef.updated_at)
            messageConfimationAct = {
            hour: messageConfimationAct.getHours(),
            minute: messageConfimationAct.getMinutes(),
            seconds: messageConfimationAct.getSeconds()
        }

            if(now.hour == messageConfimationAct.hour && now.minute == messageConfimationAct.minute && now.seconds == messageConfimationAct.seconds){
                success = "updated successfully"
            }

            await Chef.updateSet(req.params.id,{
                is_updating: false
            })
        }

        chef.avatar_img = `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`

        return res.render('admin/chefs/show', { chef, recipes, success })

    },
    async post(req, res){
        const keys = Object.keys(req.body)

        for (key of keys){
            if (req.body[key] == "") {
                return res.send('please fill all fields')
            }
        }

        let results = await File.create({
            ...req.file
        })
        const file = results.rows[0]

        const values = [
            req.body.name,
            req.file.filename,
            file.id
        ]

        results = await Chef.create(values)
        const chef = results.rows[0]

        await Chef.updateSet(chef.id,{
            is_creating: true
        })

        return res.redirect(`/admin/chefs/${chef.id}`)
        
    },
    async edit(req, res){

        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        results = await Chef.findAvatar(chef.file_id)
        const file = results.rows[0]

        chef.avatar_img = `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
        chef.fileName = file.name

        return res.render('admin/chefs/edit', { chef })
        
        
    },
    async put(req, res){
        const keys = Object.keys(req.body)

        for (key of keys){
            if (req.body[key] == "") {
                return res.send('please fill all fields')
            }
        }    

        let results = await Chef.find(req.body.id)
        const chef = results.rows[0]

        results = await Chef.findAvatar(chef.file_id)
        let file = results.rows[0]

        if(req.file) {
            await File.delete(chef.file_id)
            
            let results = await File.create({
                ...req.file
            })
            file = results.rows[0]
        }

        const values = [
            req.body.name,
            file.name || req.file.filename,
            file.id,
            req.body.id
        ]

        await Chef.update(values)

        await Chef.updateSet(chef.id,{
            is_updating: true
        })

        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async delete(req, res){
        const { id } = req.body

        await Chef.delete(id)

        let results = await Chef.all()
        const chefPromise = results.rows.map(chef => ({
            ...chef,
            avatar_path: `${req.protocol}://${req.headers.host}${chef.avatar_path.replace('public', "")}`
        }))

        const chefs = await Promise.all(chefPromise)

        return res.render('admin/chefs/index', {
            chefs,
            success: "The chef has been deleted successfully"
        })
    }
}