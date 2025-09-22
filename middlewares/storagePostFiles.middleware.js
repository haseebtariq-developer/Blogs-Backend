const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const stringFunc = require('../utils/stringFunctions')

const uploadPath = path.join(__dirname, '../public/images/post_uploads' )


const postStorage = multer.diskStorage({
  destination : function (req, fil, cb){
    cb(null, uploadPath)
  },
  filename : function (req, file, cb){
    const postTitle = req.body?.title;

    if( postTitle){
      const sanitizedTitle = stringFunc.sanitizeFileName(postTitle);
      const ext  = path.extname(file.originalname);
      crypto.randomBytes(6, (err, bytes)=>{
        const newFileName = sanitizedTitle + "_" + bytes.toString("hex") + ext;

        cb(null, newFileName)
      })
    }
  }
})



module.exports = postStorage