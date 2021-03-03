const Chef = require('../models/admin/Chef')

const LoadService = {
    load(services, fields){
        this.fields = fields
        return LoadService[services]()
    }
}

module.exports = LoadService