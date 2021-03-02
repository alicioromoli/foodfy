const Recipe = require('../../models/admin/Recipe')
const File = require('../../models/admin/File')
const FileRecipe = require('../../models/admin/FileRecipe')
const { date } = require('../../../lib/utils')

module.exports = {
    async index(req, res){
        let results = await Recipe.all()
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
        
      
        return res.render('admin/recipes/index', {recipes})
    },
    async create(req, res){

        let results = await Recipe.chefSelectOptions()
        const chefSelectOptions = results.rows

        return res.render('admin/recipes/create', {chefSelectOptions})
    },
    async show(req, res){

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send("recipe not found")

        results = await FileRecipe.find(recipe.id)
        const promiseFiles = results.rows.map(file => ({
            ...file,
            path:`${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
        }))
        
        const files = await Promise.all(promiseFiles)

        let now = new Date()
        now = {
            hour: now.getHours(),
            minute: now.getMinutes(),
            seconds: now.getSeconds()
        }

        let success = false

        if(recipe.is_creating){
            let messageConfimationAct = new Date(recipe.created_at)
            messageConfimationAct = {
            hour: messageConfimationAct.getHours(),
            minute: messageConfimationAct.getMinutes(),
            seconds: messageConfimationAct.getSeconds()
            }

            if(now.hour == messageConfimationAct.hour && now.minute == messageConfimationAct.minute && now.seconds == messageConfimationAct.seconds){
                success = "created successfully"
            }

            await Recipe.update(req.params.id,{
                is_creating: false
            })
        }

        if(recipe.is_updating) {
            let messageConfimationAct = new Date(recipe.updated_at)
            messageConfimationAct = {
            hour: messageConfimationAct.getHours(),
            minute: messageConfimationAct.getMinutes(),
            seconds: messageConfimationAct.getSeconds()
        }

            if(now.hour == messageConfimationAct.hour && now.minute == messageConfimationAct.minute && now.seconds == messageConfimationAct.seconds){
                success = "updated successfully"
            }

            await Recipe.update(req.params.id,{
                is_updating: false
            })
        }

        return res.render('admin/recipes/show', { recipe, files, success})
    },
    async post(req, res){
        const keys = Object.keys(req.body)

        for (key of keys){
            if (req.body[key] == "") {
                return res.send('please fill all fields')
            }
        }
        const {userId: id} = req.session

        const values = {
            chef_id: req.body.chef,
            user_id: id,
            title: req.body.title,
            ingredients: req.body.ingredients,
            preparation: req.body.preparation,
            information: req.body.information
        }
        
        console.log(values)
        const recipe = await Recipe.create(values)

        const filePromise = req.files.map(async file => {
            const fileCreated = await File.create({
                name: file.filename,
                path: file.path
            })

            const data = {
                recipe_id: recipe.id,
                file_id : fileCreated.id
        }

            await FileRecipe.create(data)
        })

        await Promise.all(filePromise)

        await Recipe.update(recipe.id,{
            is_creating: true
        })
        
        return res.redirect(`/admin/recipes/${recipe.id}`)
    },
    async edit(req, res){

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        results = await FileRecipe.find(recipe.id)
        const promiseFiles = results.rows.map(file => ({
            ...file,
            path:`${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
        }))
        
        const files = await Promise.all(promiseFiles)

        if (!recipe) return res.send("recipe not found")



        results = await Recipe.chefSelectOptions()
        const chefSelectOptions = results.rows

        return res.render('admin/recipes/edit',{ recipe , chefSelectOptions, files} )
        
    },
    async put(req, res){

        const values = {
            chef_id: req.body.chef,
            title: req.body.title,
            ingredients: req.body.ingredients,
            preparation: req.body.preparation,
            information: req.body.information,
            id: req.body.id
        }

        await Recipe.update(req.body.id, values)

        await Recipe.update(req.body.id,{
            is_updating: true
        })

        return res.redirect(`/admin/recipes/${req.body.id}`)        
    },
    async delete(req, res){
        const { id } = req.body

        let results = await FileRecipe.find(id)
        const files = results.rows.map(async file => {
            await FileRecipe.delete(file.file_id)

            await File.delete(file.file_id)
        })
        await Promise.all(files)

        await Recipe.delete(id)
        
        return res.redirect(`/admin/recipes`)
    }
}
