const db = require('../../../config/db')
const fs = require('fs')

module.exports = {
    create({filename, path}){
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES($1, $2)
            RETURNING id
        `

        const values = [
            filename,
            path
        ]

        return db.query(query, values)
    },
    async delete(id){
    try {
        let query = `
        SELECT * FROM files
        WHERE id = $1
        `
        let results = await db.query(query, [id])
        const file = results.rows[0]

        fs.unlinkSync(file.path)

        query = `
            DELETE FROM files
            WHERE id = $1
        `
        db.query(query, [id])

    }catch(error){
           console.log(error)
       }
    }
}