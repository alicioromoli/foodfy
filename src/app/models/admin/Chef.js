const db = require('../../../config/db')

module.exports = {
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
    create(data){
        
        const query = `
            INSERT INTO chefs(
                name,
                avatar,
                file_id
            ) VALUES($1, $2, $3)
            RETURNING id
        `

        return db.query(query, data)

    },
    find(id){
        const query = `
                SELECT *
                FROM chefs
                WHERE id = $1
                `

        return db.query(query, [id])
        
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

    },
    update(data){
        const query = `
            UPDATE chefs SET
                name=($1),
                avatar=($2),
                file_id=($3)
            WHERE id=$4
        `

        return db.query(query, data)
    },
    async updateSet(id, fields){
        let query = `UPDATE chefs SET`

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
        const query=`
        DELETE FROM chefs
        WHERE id = $1
        `

        return db.query(query, [id])
    }
}