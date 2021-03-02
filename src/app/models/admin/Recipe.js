const db = require('../../../config/db')
const Base = require('./Base')

Base.init({table: "recipes"})

module.exports = {
    ...Base,
    all(){
        const query = `
        SELECT recipes.*, (chefs.name) AS chef_name
        FROM recipes
        LEFT JOIN chefs ON ( recipes.chef_id = chefs.id)
        `

        return db.query(query)
    },
    find(id){
        const query= `
        SELECT recipes.*, (chefs.name) AS chef_name
        FROM recipes
        LEFT JOIN chefs ON ( recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `
        return db.query(query, [id])
    },
    chefSelectOptions(){
        const query = `
            SELECT id, name
            FROM chefs
        `

        return db.query(query)

    }
}