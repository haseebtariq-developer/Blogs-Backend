const fs = require('fs');
const path = require('path');

exports.delSingleFilePath = async (fileName, fileDir)=> {
  try{
    
    if(fileName){
      const filePath = path.join(fileDir, fileName);
       fs.accessSync(filePath, fs.constants.F_OK);
       fs.unlinkSync(filePath);
    }


  }catch(err){
    console.log(err);
  }
}