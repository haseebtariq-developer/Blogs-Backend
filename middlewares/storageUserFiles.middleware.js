const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const stringFunc = require('../utils/stringFunctions')

const uploadPath = path.join(__dirname, '../public/images/user_uploads' )



const storage =  multer.diskStorage({
  destination: function (req, file, cb){
    
    


    cb(null, uploadPath )

  },
  filename : function (req, file, cb){
    // console.log(req.body)
    const userName = req.body.name;

    if(userName){
      const sanitizedName = stringFunc.sanitizeFileName(userName);
      const ext = path.extname(file.originalname);
      crypto.randomBytes(10, (err, bytes)=>{
        const newFileName = sanitizedName + "_" + bytes.toString("hex") + ext;
        cb(null, newFileName)
      })

    }
    
  }
})


module.exports = storage