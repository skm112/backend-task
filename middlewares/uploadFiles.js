const multer = require("multer");
const fs = require("fs")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const exist = fs.existsSync('public/uploads')
        if (!exist) {
            fs.mkdirSync('public/uploads', { recursive: true })
        }
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        let fileName = Date.now() + '_' + file.originalname
        req.body.image = fileName
        cb(null, fileName)
    }
})

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 25000000
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/i)) {
            return cb(new Error('Invalid file format.'));
        }
        cb(undefined, true)
    }
})