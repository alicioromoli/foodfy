const Recipe = require('../../models/admin/Recipe')
const File = require('../../models/admin/File')
const FileRecipe = require('../../models/admin/FileRecipe')
const { updatingOrCreating } = require('../../../lib/utils')
const LoadService = require('../../services/LoadRecipeServices')


module.exports = {
    async index(req, res){
        const recipes = await LoadService.load('recipes')
      
        return res.render('admin/recipes/index', {recipes})
    },
    async create(req, res){

        let results = await Recipe.chefSelectOptions()
        const chefSelectOptions = results.rows

        return res.render('admin/recipes/create', {chefSelectOptions})
    },
    async show(req, res){

        try{
            const recipe = await LoadService.load('recipe', req.params.id)

            const success = await updatingOrCreating(
                recipe.is_updating, 
                recipe.is_creating, 
                recipe.created_at, 
                recipe.updated_at, 
                Recipe, req.params.id)

            return res.render('admin/recipes/show', { recipe, success})
        }catch(err){
            console.log(er)
        }
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
        
        try{
            const recipe = await LoadService.load('recipe', req.params.id)

            if (!recipe) return res.send("recipe not found")

            results = await Recipe.chefSelectOptions()
            const chefSelectOptions = results.rows

            return res.render('admin/recipes/edit',{ recipe , chefSelectOptions} )
            }catch(err){
                console.log(err)
                return res.send("Some error has occurred or page doesn’t exist")
            }
        
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
