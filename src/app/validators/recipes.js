const User = require('../models/admin/Users')
const Recipe = require('../models/admin/Recipe')
const File = require('../models/admin/File')
const FileRecipe = require('../models/admin/FileRecipe')

function checkAllFields(body){
    const keys = Object.keys(body)

    for(key of keys){
        if(body[key] == ""){
            return {
                error: "please fill all fields"
            }
        }
    }
}

async function put(req, res, next){
    const keys = Object.keys(req.body)

        for (key of keys){
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('please fill all fields')
            }
        }    

    if(req.files){
        const filePromise = req.files.map(async file => {
            const fileCreated = await File.create({
                name: file.name,
                path: file.path
            })

            const data = {
                recipe_id : req.body.id,
                file_id : fileCreated.id
        }

            await FileRecipe.create(data)
        })

        await Promise.all(filePromise)
    }

    if(req.body.removed_files){
        const removedFiles = req.body.removed_files.split(',')
        removedFiles.splice(removedFiles.length - 1, 1)

        const removedFilesPromise = removedFiles.map(async FileId => {
            await FileRecipe.delete(FileId)

            await File.delete(FileId)
        })

        await Promise.all(removedFilesPromise)
    }

    const{ userId: id} = req.session

    const user = await User.findOne({
        where: {id}
    })

    if(!user.is_admin){
        if(req.body.user_id != id){
            return res.send('You edit delete others recipe')
        }
    }


    next()
}

module.exports = {
    put
}