const db = require('../../../config/db')

function find(filter, table){
    let query= `SELECT * FROM ${table}`

        if(filter){
            Object.keys(filter).map(key => {

                query += ` ${key} `
    
                Object.keys(filter[key]).map(field => {
                    query += `${field} = '${filter[key][field]}'`
                })
            })
        }
        console.log(query)
        return db.query(query)
}

const Base = {
    init({table}){
        if(!table) throw Error("Invalid Params")

        this.table = table

        return this
    },
    async create(fields){

        let keys = []
        let values = []

        Object.keys(fields).map(key => {
            keys.push(key)
            if(Array.isArray(fields[key])){
                const commaSeparated = '","'
                values.push(`'{"${fields[key].join(commaSeparated)}"}'`)
            }else {
                values.push(`'${fields[key]}'`)
            }
        })


        const query = ` INSERT INTO ${this.table} (${keys.join(',')}) 
                        VALUES (${values.join(',')}) 
                        RETURNING id`
        
        console.log(query)
        const results = await db.query(query)

        return results.rows[0]

    },
    async find(id){
        const results = await find({where: { id } }, this.table)
        return results.rows[0]
    },
    async findAll(filter){
        const results = await find(filter, this.table)
        return results.rows
    },
    async findOne(filter){

        const results = await find(filter, this.table)

        return results.rows[0]
    },
    update(id, fields){

        let update = []
        
        Object.keys(fields).map(key => {

            if(Array.isArray(fields[key])){
                const commaSeparated = '","'
                const line = `${key} = '{"${fields[key].join(commaSeparated)}"}'`
                update.push(line)
            }else {
                const line = `${key} = '${fields[key]}'`
                update.push(line)
            }
        })

        const query = `UPDATE ${this.table} SET
                       ${update.join(',')}
                       WHERE id = ${id}
                        `
        return db.query(query)
        
    },
    delete(id){
        return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
    }

}

module.exports = Base