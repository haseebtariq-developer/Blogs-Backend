
const userModel = require('../models/user.model');
const blackListTokenModel = require('../models/blacklistToken.model')
const stringFunc = require('../utils/stringFunctions');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose')
const delMediaPaths = require('../utils/delMediaPaths')


const jwtSecret = process.env.JWT_SECRET

const uploadPath = path.join(__dirname, '../public/images/user_uploads')

/* ++++++++++++++++++++++++++++++++++++++++++++
                    Create User  
  +++++++++++++++++++++++++++++++++++++++++++++ */
exports.createUser = async (req, res) =>{
  try{
    // console.log(req.body)
    const { name , email, password, role, status } = req.body;
    const imageUrl = req?.file?.filename;
    // console.log(req.body)
    // console.log(req.file)

    const findUser = await userModel.findOne({email : stringFunc.cleanLowerCase(email)})

    // console.log(findUser);

    if( findUser){
      return res.status(400).json({
        success : false,
        message : "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('No User Found')

    const newUser = {
      name, 
      email: stringFunc.cleanLowerCase(email),
      password: hashedPassword,
      role : new mongoose.Types.ObjectId(role), 
      status: status ? status : 'active',
    }

    if(imageUrl){
      newUser.userImage = imageUrl
    }

    const user = await userModel.create(newUser);
    // console.log(newUser)
    res.status(200).json(
      {
        success: true,
        message: 'User created successfully',
        // user
      });


  }
  catch(err){
    console.error("Internal Server Error", err);
    res.status(500).json(
      {message: "Internal Server Error"}
    );
  }
}


/* ++++++++++++++++++++++++++++++++++++++++++++
                    Login User  
  +++++++++++++++++++++++++++++++++++++++++++++ */

exports.loginUser = async(req, res)=>{
  try{

    // console.log(req.body)
    // console.log(jwtSecret)
    const {email, password} = req.body;

    const findUser = await userModel.findOne({email: stringFunc.cleanLowerCase(email)}).populate(('role'));
    // console.log(findUser.role.permissions);
    if(!findUser){
      return res.status(404).json({
        success: false,
        message: "User not found"

      })
    }

    const isMatched = await bcrypt.compare(password, findUser.password);
    
    if(isMatched){
      const token = jwt.sign({id: findUser._id, email: findUser.email, permissions: findUser.role.permissions}, jwtSecret, {expiresIn: '30m'});
      // console.log('is Matched');
      // console.log(token)
      res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token
    })
      
    }else{
      return res.status(401).json({
        success: false,
        message: "Invalid password"

      })
    }
    

  }
  catch(err){
    console.error("Internal Server Error", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}


/* ++++++++++++++++++++++++++++++++++++++++++++
                    Log Out User                   
  +++++++++++++++++++++++++++++++++++++++++++++ */
  exports.logoutUser = async(req, res)=>{
    try{
      // console.log('hello')
      const token = req.token;
      
      const blackListToken = await blackListTokenModel.create({
        token
      })
      // console.log(blackListToken);

      res.status(200).json({
        success: true,
        message: "User logged out successfully"
      })

    }catch(err){
      console.error("Internal Server Error", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      })
    }
  }

  /* ++++++++++++++++++++++++++++++++++++++++++++
              Listing All the Users                
  +++++++++++++++++++++++++++++++++++++++++++++ */

  exports.ListAllUsers = async(req, res)=>{
    try{

      // console.log(req.query)
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1 ;
      const skip = limit * (page - 1);
      const searchTerm = req.query.search;
      const sortTerm = req.query.sort || 'createdAt';
      const sortOrder = req.query.sort_ord || 'desc';
      const status = req.query.status ; 
      const role = req.query.role ; 


      const sortCriteria = {};
      if(sortOrder == 'desc'){
        sortCriteria[sortTerm] = -1
      }else {
        sortCriteria[sortTerm] = 1
      }
      
      
      const filter = []


      if(searchTerm){
        filter.push ({
          $or : [
          {name: {$regex : searchTerm , $options: 'i'}},
          {email: {$regex : searchTerm, $options: 'i'}},
          {'role.roleName': {$regex: searchTerm, $options: 'i'}},
          {'role.permissions': {$regex: searchTerm, $options: 'i'}},

        ]

        })  
      }

      if( status){
        filter.push({status : status})
      }

      if(role) {
        
        filter.push({
          'role._id': new mongoose.Types.ObjectId(role)
        }) 
      }



      const userPipeline = [
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField :  '_id',
            as: 'role'
          }

        },
        {
          $unwind: '$role'
        },
        
      ]

      const countPipeline = [
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField :  '_id',
            as: 'role'
          }

        },
        {
          $unwind: '$role'
        },
        
      ]

      if(filter.length > 0){
        userPipeline.push({
          $match : {
            $and : filter
          }
        })

        countPipeline.push({
          $match : {
            $and : filter
          }
        })


      }



      userPipeline.push({
          $sort : sortCriteria
        },
        {
          $skip : skip
        },
        {
          $limit : limit
        })

        countPipeline.push({
          $count : 'userCount'
        })



      const getUsers = await userModel.aggregate(userPipeline).exec();
      // console.log(getUsers);
      const countUser = await userModel.aggregate(countPipeline).exec();

      res.status(200).json({ 
        success: true,
        message: "Fetched the Users",
        count: countUser[0]?.userCount || 0,
        result : getUsers,
        
      })

    }
    catch(err){
      console.error("Internal Server Error", err);
      res.status(500).json({
        success: false,
        message: err.message
      })

    }
  }


  /* ++++++++++++++++++++++++++++++++++++++++++++
                Get Single User               
  +++++++++++++++++++++++++++++++++++++++++++++ */
  exports.getSingleUser = async (req , res)=>{
    try{
      const userId =  new mongoose.Types.ObjectId(req.params.id);
      console.log(userId)

      const user = await userModel.findById(userId).populate('role');

      if(!user){
       return res.status(404).json({
        success: false,
        message: "No user Found"
      })

      }

      res.status(200).json({
        success: true,
        message: "User Found",
        result : user
      })




    }
    catch(err){
      console.error("Internal Server Error", err);
      res.status(500).json({
        success: false,
        message: err.message
      })

    }
  }


  /* ++++++++++++++++++++++++++++++++++++++++++++
              Update the User               
  +++++++++++++++++++++++++++++++++++++++++++++ */

  exports.updateUser = async (req, res)=>{
    try{
      console.log(req.params.id)
      const userId = new mongoose.Types.ObjectId(req.params.id);
      console.log(req.body);
      const {name, email, password, role, status} = req.body;

      const userFind = await userModel.findById(userId);

      if(!userFind){
        return res.status(404).json({
        success: false,
        message: "No user Found"
        })

      }

      if( userFind && req.file && userFind.userImage != null){

        delMediaPaths.delSingleFilePath(userFind.userImage, uploadPath);

      }


      const updateUser = {}

      if(name){
        updateUser.name = name
      }

      if(email){
        updateUser.email = email
      }

      if(password){
        const hashedPass = await bcrypt.hash(password, 10);
        updateUser.password = hashedPass

      }

      if(role){
        updateUser.role = new mongoose.Types.ObjectId(role);
      }

      if(status){
        updateUser.status = status
      }

      if(req.file){
        updateUser.userImage = req.file.filename
      }

      const updatedUser = await userModel.findByIdAndUpdate(userId, updateUser, {new: true})

      res.status(200).json({
        success : true, 
        message : "User Updated Successfully"
      })


    }
    catch(err){
      console.error("Internal Server Error", err);
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }





  /* ++++++++++++++++++++++++++++++++++++++++++++
              Deleting the User               
  +++++++++++++++++++++++++++++++++++++++++++++ */

  exports.deleteUser = async (req, res)=>{
    try{
      const userId = new mongoose.Types.ObjectId(req.params.id);
      
      const userFind = await userModel.findById(userId);

      if(!userFind){
        return res.status(404).json({
        success: false,
        message: "No user Found"
        })

      }

      if( userFind && userFind.userImage != null){

        delMediaPaths.delSingleFilePath(userFind.userImage, uploadPath);

      }

      const deleteUser = await userModel.findByIdAndDelete(userId);

      res.status(200).json({
        success : true, 
        message: "User Deleted Successfully"
      })

    }
    catch(err){
      console.error("Internal Server Error", err);
      res.status(500).json({
        success: false,
        message: err.message
      })

    }

  }