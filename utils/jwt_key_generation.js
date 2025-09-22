const crypto = require('crypto');

const jwtKey = ()=>{

  const jwtSecretKey = crypto.randomBytes(32).toString('hex');
  console.log(jwtSecretKey)



}
 
module.exports = jwtKey