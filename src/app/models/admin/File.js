const db = require('../../../config/db')
const fs = require('fs')
const Base = require('./Base')

Base.init({table: "files"})

module.exports = {
    ...Base,
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