const { default: mongoose } = require('mongoose');
const rolesModel = require('../models/role.model');
const userModel = require('../models/user.model');



/* ++++++++++++++++++++++++++++++++++++++++++++++
                Create Role
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.createRole = async(req, res)=>{
  try{
    // console.log(req.body)
    const {role, permissions} = req.body;
    // console.log(role, permissions);

    const checkRole = await rolesModel.findOne({roleName : role});
    if(checkRole){
      return res.status(402).json({
        success: false,
        message: "This Role Already Exist!"
      })
    }

    const newRole = await rolesModel.create({
      roleName : role,
      permissions: permissions
    })
    
    res.status(200).json({
      success: true,
      message: "Role Created Successfully",
    })


  }
  catch(err){
    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

/* ++++++++++++++++++++++++++++++++++++++++++++++
                Show All Roles
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.showAllRoles = async (req, res)=>{
  try{

    const allRoles = await rolesModel.find()
    // console.log(allRoles);

    res.status(200).json({
      success: true,
      message: "Fetching all Roles",
      result: allRoles 
    })

  }
  catch(err){
    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}


/* ++++++++++++++++++++++++++++++++++++++++++++++
                Delete the Role
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.deleteRole = async (req, res)=>{
  try{
    // console.log(req.params.id)
    const roleId = new mongoose.Types.ObjectId(req.params.id);
    // console.log(roleId);

    const userFound = await userModel.find({role: roleId});
    // console.log(userFound)
    if(userFound.length > 0){
      return res.status(400).json({
        success : false,
        message : "This Role is already assigned to the User. Either Delete the User or Assign Other Role to the Users, then try again."
      })
    }

    const deleteRole = await rolesModel.findByIdAndDelete(roleId);
    res.status(200).json({
      success: true,
      message: "Role is Deleted Successfully"
    })



  }
  catch(err){
    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}

/* ++++++++++++++++++++++++++++++++++++++++++++++
                Update the Role
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.updateRole = async(req, res)=>{
  try{
    const roleId = new mongoose.Types.ObjectId(req.params);
    const {role , permissions } = req.body;

    let updateRole = {}
    if( role ){
      updateRole.roleName = role;
      
    }

    if(permissions){
      updateRole.permissions = permissions
    }

    const roleUpdated = await rolesModel.findByIdAndUpdate(roleId, updateRole, {new : true})

    res.status(200).json({
      success : true, 
      message : "Role Updated Successfully"
    })

  }
  catch(err){
    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })
    
  }
}

