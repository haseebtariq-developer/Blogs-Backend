
const blackListTokenModel = require('../models/blacklistToken.model')
const jwt = require('jsonwebtoken');

const authToken = async (req, res, next)=>{
  const authorization = req.headers['authorization'];
  const token = authorization && authorization.split(" ")[1];
  // console.log('Hello World');
  // console.log(req.headers);
  // console.log(token)
  if(!token) return res.status(401).send(
    {
      success: false,
      message: 'Access Denied: No token provided.'
    }
  );

  const checkBlackList = await blackListTokenModel.findOne({token : token});
  if(checkBlackList) {
    // console.log('it is in the checkList')
    return res.status(401).send({
    success: false,
    message: 'Access Denied: Token is blacklisted'
  })
  }

  // console.log(process.env.JWT_SECRET)
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
    if(err){ 
      return res.status(401).send({
      success: false,
      message: 'Access Denied: Invalid token'
    }) 
  }
    // console.log(user)
    req.user = user;
    req.token = token;
    next();
  })

  

}

module.exports = authToken