const db = require('../../../config/db')

module.exports = {
    all(){
        return db.query(`SELECT recipes.* , (chefs.name) AS chef_name
                        FROM recipes
                        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                        ORDER BY recipes.updated_at DESC`)
    },
    recipes(filterSearch){
        const { offset, limit, filter } = filterSearch

        let filterQuery = ""

        if(filter){
            filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`
        }
        
        const query = `
            SELECT recipes.id, recipes.chef_id, recipes.updated_at, recipes.title, (chefs.name) AS chef_name, (
                SELECT count(*) 
                FROM recipes
                ${filterQuery}
              ) AS total
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ${filterQuery}
                ORDER BY recipes.updated_at DESC
                LIMIT $1 OFFSET $2
            `

        return db.query(query,[limit, offset])
    },
    chefs(){
        return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes, files.path AS avatar_path
            FROM chefs
            LEFT JOIN recipes ON ( chefs.id = recipes.chef_id)
            LEFT JOIN files ON ( files.id = chefs.file_id)
            GROUP BY chefs.id, files.path
            ORDER BY chefs.id ASC
        `)

    },
    findRecipe(id){
        const query = `
            SELECT *
            FROM recipes
            WHERE id=$1
        `

        return db.query(query,[id])
    },
    findChef(id) {
        const query = `
            SELECT *
            FROM chefs
            WHERE id=$1
        `

        return db.query(query,[id])
    }
}