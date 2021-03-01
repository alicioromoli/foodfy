const db = require('../../../config/db')

module.exports = {
    all(){
        const query = `
        SELECT recipes.*, (chefs.name) AS chef_name
        FROM recipes
        LEFT JOIN chefs ON ( recipes.chef_id = chefs.id)
        `

        return db.query(query)
    },
    create(data){
        
        const query = `
            INSERT INTO recipes(
                chef_id,
                user_id,
                title,
                ingredients,
                preparation,
                information
            ) VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        return db.query(query, data)

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
    update(data){
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)
                WHERE id = $6
            `

            return db.query(query, data)

    },
    async updateSet(id, fields){
        let query = `UPDATE recipes SET`

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
    chefSelectOptions(){
        const query = `
            SELECT id, name
            FROM chefs
        `

        return db.query(query)

    },
    delete(id){
        const query=`
        DELETE FROM recipes
        WHERE id = $1
        `

        return db.query(query, [id])
    }
}