const db = require('../../../config/db')
const Base = require('./Base')

Base.init({ table: "chefs" })

module.exports = {
    ...Base,
    all(){
        const query = `
        SELECT chefs.*, count(recipes) AS total_recipes, files.path AS avatar_path
        FROM chefs
        LEFT JOIN recipes ON ( chefs.id = recipes.chef_id)
        LEFT JOIN files ON ( files.id = chefs.file_id)
        GROUP BY chefs.id, files.path
        `

        return db.query(query)
    },
    findBy(id){
        const query= `
                SELECT chefs.*, (
                    SELECT count(*) 
                    FROM recipes
                    WHERE recipes.chef_id = $1
                ) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                WHERE chefs.id = $1
                GROUP BY chefs.id
                `
        return db.query(query, [id])
    },
    findAvatar(id){
        const query = `
            SELECT * 
            FROM files
            WHERE id = $1
        `
        return db.query(query, [id])
    },
    recipesChef(id){
        const query = `
            SELECT id, title
            FROM recipes
            WHERE chef_id = $1
        `

        return db.query(query, [id])

    }
}