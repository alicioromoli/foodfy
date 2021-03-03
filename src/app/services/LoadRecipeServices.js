const Recipe = require('../models/admin/Recipe')
const FileRecipe = require('../models/admin/FileRecipe')

async function getImages(recipeId){
    let results = await FileRecipe.find(recipeId)
    
    const files = results.rows.map(file => ({
        id: file.file_id,
        name: file.path,
        path: file.path,
        src:`${file.path.replace('public', "")}`
    }))
    return files
}

async function format(recipe){
    const files = await getImages(recipe.id)
    recipe.img = files[0].src
    recipe.files = files

    return recipe
}

const LoadService = {
    load(service, filter){
        this.filter = filter
        return this[service]()
    },
    async recipe(){
        try{
            let result = await Recipe.find(this.filter)
            const recipe = result.rows[0]
            return format(recipe)

        }catch(err){
            console.error(err)
        }
    },
    async recipes(){
        try{
            let results = await Recipe.all(this.filter)
            const recipePromise = results.rows.map(format)
            const recipes = await Promise.all(recipePromise)

            return recipes
            

        }catch(err){
            console.error(err)
        }
    },
    format
}

module.exports = LoadService