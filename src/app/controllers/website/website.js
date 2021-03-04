const Website = require('../../models/website/Website')
const FileRecipe = require('../../models/admin/FileRecipe')

module.exports = {
    async home(req, res){
        let results = await Website.all()
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
        const filteredRecipes = recipes.filter((recipe, index, array)=> {
            return index < 6
        })

        return res.render("website/home", { recipes: filteredRecipes })
    },
    about(req, res){
        return res.render("website/about")
    },
    async recipes(req, res){
        let { page, filter, limit } = req.query

        page = page || 1
        limit = limit || 4
        let offset = limit * (page - 1)
        


        const filterSearch = {
            page,
            filter,
            limit,
            offset
        }


        let results = await Website.recipes(filterSearch)
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
        let total = Math.ceil(recipes[0].total / limit)

        return res.render("website/recipes", { page, total, filter, recipes })
    },
    async chefs(req, res){

        let results = await Website.chefs()
        const chefPromise = results.rows.map(chef => ({
            ...chef,
            avatar_path: `${req.protocol}://${req.headers.host}${chef.avatar_path.replace('public', "")}`
        }))

        const chefs = await Promise.all(chefPromise)
        
        return res.render("website/chefs", { chefs })
      
    },
    async showRecipe(req, res){
        try{
            const { id } = req.params

            let results = await Website.findRecipe(id)
            const recipe = results.rows[0]

            results = await FileRecipe.findPath(recipe.id)
            const filePromise = results.rows
            .map(file => ({
                path: file.path.replace('public', "")
            }))
            const files = await Promise.all(filePromise)

            results = await Website.findChef(recipe.chef_id)
            const chef = results.rows[0]

            if(!id) return res.send('recipe not find')

            return res.render("website/recipe", { item: recipe, chef, files})

        }catch(err){
            console.log(err)
            return res.send("Some error has occurred or page doesnt exist")
        }

    }
}