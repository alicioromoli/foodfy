const db = require('../../../config/db')
const fs = require('fs')

module.exports = {
    create(data){
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES($1, $2)
            RETURNING id
        `

        return db.query(query, data)
    },
    find(id){
        return db.query(`
        SELECT *
        FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
        `, [id])
    },
    async delete(id){
    try {
        const query = `
        DELETE FROM recipe_files
        WHERE file_id = $1
        `
        db.query(query, [id])

    }catch(error){
           console.log(error)
       }
    },
    findPath(id){
        return db.query(`
        SELECT files.path
        FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
        `, [id])
    }
}