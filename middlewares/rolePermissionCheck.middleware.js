

const rolePermissionCheck = (requirePermission)=>{
  return  (req, res, next)=>{
    const permissions = req.user.permissions;
    if(!req.user && !req.user.permissions && !Array.isArray(req.user.permissions)){
      return res.status(403).json({
        message: "No Permission Found"
      })
    }
    // console.log(permissions);
    // console.log(requirePermission)
    // console.log('...Checking')
    const hasPermission = permissions.includes(requirePermission)
    

    if( hasPermission){
      // console.log('has Permission')
      next()
    }else{
      return res.status(403).json({
      message: "Permission Denied"
    })
    }

    


  

  }
}

module.exports = rolePermissionCheck