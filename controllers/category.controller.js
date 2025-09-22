const mongoose = require('mongoose');
const catModel = require('../models/category.model');
const postModel = require('../models/post.model')
const stringFunc = require('../utils/stringFunctions');



/* ++++++++++++++++++++++++++++++++++++++++++++++
                Create Category
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.createCategory =  async(req, res)=>{
  try{

    const {categoryName, parentId, description } = req.body;

    const catName = stringFunc.Capitalize(categoryName);
    
    // console.log(parentCategory)
    // console.log(catName, description)
    const checkCategory = await catModel.findOne({categoryName : catName})
    
    if(checkCategory){
      return res.status(405).json({
        success: false,
        message : "This category Already Exist"
      })
    }

    const newCategory = {
      categoryName : catName
    }

    // Handle Parent Category
    if(parentId){
      const valid = mongoose.Types.ObjectId.isValid(parentId)
      if(!valid){
        return res.status(406).json({
          success : false,
          message : "Please Provide valid Parent Id"
        })
      }
      const parId = new mongoose.Types.ObjectId(parentId);
      const parentCheck = await catModel.findById(parId);

      if(!parentCheck){
        return res.status(404).json({
          success: false,
          message: "No such Parent Category Exist"
        })
      }


      newCategory.parentId = parId

    }

    // Handle Description

    if(description){
      newCategory.description = description
    }

    const catCreate = await catModel.create(newCategory);

    res.status(200).json({
      success: true ,
      message : "category Created Successfully",
      
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
                Show Categories
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.getCategoryList = async(req, res)=>{
  try{

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1 ) * limit;

    const sortTerm = req.query.sort || 'createdAt';
    const sortOrd = req.query.sortOrd || 'desc';

    const searchTerm = req.query.search || 'Enter';


    const sortQuery = {};

    if(sortOrd == 'desc'){
      sortQuery[sortTerm] = -1

    }else{
      sortQuery[sortTerm] = 1
    }


    const matchRecords = []

    if(searchTerm){
      const searchQuery = {
        $or : [
          {categoryName: {$regex : searchTerm , $options: 'i'}},
          {description: {$regex : searchTerm, $options: 'i'}},
          {parentCategory: {$regex: searchTerm, $options: 'i'}},
         
        ]
      }
      matchRecords.push(searchQuery)

    }

    
    const pipeLine = [
      {
        $lookup : {
          from : 'categories',
          localField : 'parentId',
          foreignField : '_id',
          as : 'parentCat'

        }
      },
      {
        $unwind : {
          path: '$parentCat',
          preserveNullAndEmptyArrays : true
        }

      },
      {
        $addFields : {
          parentCategory :{
            $ifNull : ['$parentCat.categoryName', null]
          }
        }
      },
      {
        $project :{
          parentCat : 0
        }
      },
      
      
    ]


    const countPipeline = [
      {
        $lookup : {
          from : 'categories',
          localField : 'parentId',
          foreignField : '_id',
          as : 'parentCat'

        }
      },
      {
        $unwind : {
          path: '$parentCat',
          preserveNullAndEmptyArrays : true
        }

      },
      {
        $addFields : {
          parentCategory :{
            $ifNull : ['$parentCat.categoryName', null]
          }
        }
      },
      {
        $project :{
          parentCat : 0
        }
      },

    ]





    if(matchRecords.length > 0){
      pipeLine.push({
        $match : {
          $and : matchRecords
        }
      })

      countPipeline.push({
         $match : {
          $and : matchRecords
        }
      })
    }

    pipeLine.push(
      {
        $sort : sortQuery
      },
      {
        $skip : skip
      },
      {
        $limit : limit
      }
    )

    countPipeline.push({
      $count : 'catCount'
    })



    const categoryList  = await catModel.aggregate(pipeLine).exec()
    const countCategories  = await catModel.aggregate(countPipeline).exec()
    // console.log(categoryList)
    res.status(200).json({
      success: true,
      message : "Fetched Category List Successfully",
      count : countCategories[0]?.catCount || 0,
      result : categoryList
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
                Update Category
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.updateCategory = async(req, res)=>{
  try{
    const {categoryName, parentId, description } = req.body;

    const categoryId = req.params.id;

    const catId = new mongoose.Types.ObjectId(categoryId);

    const checkCat = await catModel.findById(catId);
    if(!checkCat){
      return res.status(405).json({
        success : false,
        message : "No Such Category Exist"
      })

    }

    const catName = stringFunc.Capitalize(categoryName);
    
    

    const updateCategory = { }

    if(categoryName){
      updateCategory.categoryName = catName
    } 

    // Handle Parent Category
    if(parentId){
      const valid = mongoose.Types.ObjectId.isValid(parentId)
      if(!valid){
        return res.status(406).json({
          success : false,
          message : "Please Provide valid Parent Id"
        })
      }
      const parId = new mongoose.Types.ObjectId(parentId);
      const parentCheck = await catModel.findById(parId);

      if(!parentCheck){
        return res.status(404).json({
          success: false,
          message: "No such Parent Category Exist"
        })
      }


      updateCategory.parentId = parId

    }

    // Handle Description

    if(description){
      updateCategory.description = description
    }

    const catUpdate = await catModel.findByIdAndUpdate( catId, updateCategory, {new : true});

    

    res.status(200).json({
      success: true ,
      message : "Category Updated Successfully",
      
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
                Delete Category
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.deleteCategory = async(req, res)=>{
  try{
    const id = req.params.id;
    const catId = new mongoose.Types.ObjectId(id);

    const checkCat = await catModel.findById(catId)

    if(!checkCat){
      return res.status(404).json({
        success: false ,
        message: "Category Not Found"
      })
    }

    const checkPost = await postModel.find({categoryId : catId});
    console.log(checkPost)

    if(checkPost.length > 0){
      return res.status(400).json({
        success: false ,
        message: "Category is used in posts, cannot be deleted"
      })

    }

    const deleteCat = await catModel.findByIdAndDelete(catId)


    res.status(200).json({
      success: true ,
      message: "Category Deleted Successfully"
    })


  }catch(err){
    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}