const Chef = require('../../models/admin/Chef')
const File = require('../../models/admin/File')
const FileRecipe = require('../../models/admin/FileRecipe')
const { updatingOrCreating } = require('../../../lib/utils')

module.exports = {
    async index(req, res){
        //
        let results = await Chef.all()
        const chefPromise = results.rows.map(chef => ({
            ...chef,
            avatar_path: `${req.protocol}://${req.headers.host}${chef.avatar_path.replace('public', "")}`
        }))

        const chefs = await Promise.all(chefPromise)
        //
        return res.render('admin/chefs/index', { chefs })
    },
    create(req, res){
        return res.render('admin/chefs/create')
    },
    async show(req, res){
        try{
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

    const success = await updatingOrCreating(
        chef.is_updating, 
        chef.is_creating, 
        chef.created_at, 
        chef.updated_at, 
        Chef, req.params.id)
    
    chef.avatar_img = `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
        
    return res.render('admin/chefs/show', { chef, recipes, success })
        }catch(err){
            console.log(err)
            return res.send("Some error has occurred or page doesn’t exist")
        }

    },
    async post(req, res){
        const keys = Object.keys(req.body)

        for (key of keys){
            if (req.body[key] == "") {
                return res.send('please fill all fields')
            }
        }

        const file = await File.create({
            name: req.file.filename,
            path: req.file.path
        })

        const { name } = req.body
        const {filename: avatar} = req.file

        const values = {
            name: String(name),
            avatar: String(avatar),
            file_id: file.id
        }

        const chef = await Chef.create(values)

        await Chef.update(chef.id,{
            is_creating: true
        })

        return res.redirect(`/admin/chefs/${chef.id}`)
        
    },
    async edit(req, res){

        try{
            const chef = await Chef.find(req.params.id)

        results = await Chef.findAvatar(chef.file_id)
        const file = results.rows[0]

        chef.avatar_img = `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
        chef.fileName = file.name

        return res.render('admin/chefs/edit', { chef })
        }catch(err){
            console.log(err)
            return res.send("Some error has occurred or page doesn’t exist")
        }
        
        
    },
    async put(req, res){
        const keys = Object.keys(req.body)

        for (key of keys){
            if (req.body[key] == "") {
                return res.send('please fill all fields')
            }
        }    

        const chef = await Chef.find(req.body.id)
        console.log(chef.id)

        results = await Chef.findAvatar(chef.file_id)
        let file = results.rows[0]

        if(req.file) {
            await File.delete(chef.file_id)
            
            const file = await File.create({
                name: req.file.filename,
                path: req.file.path
            })
        }

        const values = {
            name: req.body.name,
            avatar: file.name || req.file.filename,
            file_id: file.id,
            id: req.body.id
        }

        await Chef.update(chef.id, values)
        
        await Chef.update(chef.id,{
            is_updating: true
        })

        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async delete(req, res){
        const { id } = req.body

        await Chef.delete(id)
        //
        let results = await Chef.all()
        const chefPromise = results.rows.map(chef => ({
            ...chef,
            avatar_path: `${req.protocol}://${req.headers.host}${chef.avatar_path.replace('public', "")}`
        }))

        const chefs = await Promise.all(chefPromise)
        //
        return res.render('admin/chefs/index', {
            chefs,
            success: "The chef has been deleted successfully"
        })
    }
}