const { Pool } = require('pg')

module.exports = new Pool({
    user:"alicion.j.romoli" , 
    password: "",
    host: "localhost",
    port: 5432,
    database: "foodfymanager"
})