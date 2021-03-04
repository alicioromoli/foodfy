const User = require('./src/app/models/admin/Users')
const File = require('./src/app/models/admin/File')
const Recipe = require('./src/app/models/admin/Recipe')
const FileRecipe = require('./src/app/models/admin/FileRecipe')

const faker = require('faker')
const { hash } = require('bcryptjs')
const Chef = require('./src/app/models/admin/Chef')

const foodNames = ['Beef Stroganoff', 'Reuben', 'Sandwich', 'Waldorf Salad', 'French Fries', 'Chicken à la King', 'Lobster Newburg', 'Salisbury Steak']
let userIds = []
let users = []
let chefFileId = []
let chefFile = []
let chefIds = []
let recipesIds = []
let recipes = []
let recipeFileId = []
let recipeFiles = []
const maxUsers = 3
const maxChefs = 3
const maxRecipes = 8

async function createUser(){
    const passwordHash = await hash('123', 8)

    let user = {
        name: faker.name.firstName(),
        email: 'adminfoodfy@gmail.com',
        password: passwordHash,
        is_admin: true
    }

    let userId = await User.create(user)
    userIds.push(userId)

    while(userIds.length < maxUsers){
        user = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: passwordHash,
            is_admin: faker.random.boolean()
        }
        userId = await User.create(user)
        userIds.push(userId)
    }

    for(userId of userIds){
        const {id} = userId
        const user = await User.find(id)
        users.push(user)
    }
}

async function createChefFile (){
    for(user of users){
        const fileId = await File.create({
            name: `${user.name}-Avatar`,
            path: "https://source.unsplash.com/collection/4389261/avatar"
        })
        chefFileId.push(fileId)
    }

    for(idFile of chefFileId){
        const {id} = idFile
        const fileChef = await File.find(id)
        chefFile.push({
            name: fileChef.name.slice(0, -7),
            avatar: fileChef.path,
            file_id: fileChef.id
        })
    }
}

async function createChef(){
    for (chef of chefFile){
        let chefId = await Chef.create(chef)
        chefIds.push(chefId)
    }
}

async function createRecipes (){
    while(recipesIds.length < maxRecipes){
        const {id} = chefIds[Math.floor(Math.random() * chefIds.length)]
    
        const recipe = {
            chef_id: id,
            user_id: id,
            title: foodNames[Math.floor(Math.random() * foodNames.length)],
            ingredients: [faker.lorem.words(5)],
            preparation: [faker.lorem.words(5)],
            information: faker.lorem.words(10)
        }
        const recipeId = await Recipe.create(recipe)
        recipesIds.push(recipeId)
    }
    for(recipeId of recipesIds){
        const { id } = recipeId
        const results = await Recipe.find(id)
        const recipe = results.rows[0]
        recipes.push(recipe)
    }
}
//ok


async function createRecipeFile (){
    console.log(recipes)

    for(recipe of recipes){
        const fileId = await File.create({
            name: `${recipe.title}-photo`,
            path: "https://source.unsplash.com/collection/335764/gourmand"
        })
        recipeFileId.push(fileId)
    }

    for(let i = 0; i < recipeFileId.length; i++){
        const {id: fileId} = recipeFileId[i]
        const {id: recipeId} = recipesIds[i]

        await FileRecipe.create({
            recipe_id:recipeId,
            file_id: fileId
        })
    }
}

async function init(){
    await createUser()
    await createChefFile()
    await createChef()
    await createRecipes()
    await createRecipeFile()
}

init()
