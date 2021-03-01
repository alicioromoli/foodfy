const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, './public/assets')
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now().toString()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, callback) => {
    const imageType = ['image/jpeg', 'image/png', 'image/jpeg']
    .find(image => image == file.mimetype)

    if (imageType){
        return callback(null, true)
    }

    return callback(null, false)
}

module.exports = multer({
    storage,
    fileFilter
})

