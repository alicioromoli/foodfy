const db = require('../../../config/db')
const { hash } = require('bcryptjs')    
const fs = require('fs')
const crypto = require('crypto')


module.exports = {
    async findAll(){
        const results = await db.query(`SELECT * FROM users`)
        return results.rows
    },
    async create(data){
        const query = `
        INSERT INTO users (
        name,
        email,
        password,
        reset_token,
        is_admin
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `

        const results = await db.query(query, data)

        return results.rows[0]
        },
    async findOne(filter){
        let query= `SELECT * FROM users`

        Object.keys(filter).map(key => {

            query = `${query}
                     ${key}`

            Object.keys(filter[key]).map(field => {
                query = `${query} ${field} = '${filter[key][field]}'`
            })
        })
        

        const results = await db.query(query)

        return results.rows[0]
    },
    async update(id, fields){
        let query = `UPDATE users SET`

        Object.keys(fields).map((key, index, array) => {
            if(index + 1 < array.length){
                query = `${query}
                         ${key} = '${fields[key]}',
                         `
            }else {
                query = `${query}
                         ${key} = '${fields[key]}'
                         WHERE id = ${id}
                         `

            }
        })
        await db.query(query)
        return
    },
    delete(id){
        return db.query('DELETE FROM users WHERE id = $1', [id])
    }
}

