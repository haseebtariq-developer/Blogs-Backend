const mongoose = require('mongoose');
const userModel  = require('../models/user.model');
const catModel = require('../models/category.model');
const postModel = require('../models/post.model');
const tagModel = require('../models/tag.model');
const commentModel = require('../models/comment.model')
const stringFunc = require('../utils/stringFunctions');
const delMediaPaths = require('../utils/delMediaPaths')
const path = require('path');
const fs = require('fs');


const postUploadDir = path.join(__dirname, '../public/images/post_uploads');


/* ++++++++++++++++++++++++++++++++++++++++++++++
                Create Post
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.createPost = async(req, res)=>{
  try{
    
    // console.log(req.body);
    const {title, slug, content, excerpt, authorId, categoryId, status, tags } = req.body;

    // console.log(title)

    if(!title || !authorId || !categoryId){
      return res.status(406).json({
        success : false, 
        message : "Please Provide Required Fields"
      })
    }

    const newPost = {
      title : stringFunc.Capitalize(title),
      
    }


    const validAuthorId = mongoose.Types.ObjectId.isValid(authorId);
    const validCategoryId = mongoose.Types.ObjectId.isValid(categoryId);

    if(!validAuthorId || !validCategoryId){

      return res.status(400).json({
        success : false,
        message : "Please Provide Valid Ids"

      })
      
    }
    const userId = new mongoose.Types.ObjectId(authorId);
    const catId = new mongoose.Types.ObjectId(categoryId);

    const checkUser =  await userModel.findById(userId);
    const checkCategory = await catModel.findById(catId);

    if( !checkUser){
      return res.status(404).json({
        success : false ,
        message : "No Such Author Found"
      })
    }

    if(!checkCategory){
      return res.status(404).json({
        success : false,
        message : "No Such Category Found"
      })
    }


    newPost.authorId = userId;
    newPost.categoryId = catId;

    newPost.slug = slug ? stringFunc.makeSlugType(slug) : stringFunc.makeSlugType(title);

    if(content){
      newPost.content = content
    }

    if(excerpt){
      newPost.excerpt = excerpt
    }

    if(status){
      newPost.status = status
    }

    // console.log(tags);

    
    console.log(typeof tags);
    if(tags && typeof tags != 'string'){
      const tagsIds = tags.filter(item=>{
        return mongoose.Types.ObjectId.isValid(item)
      })

      // console.log(tagsIds)

      if(tagsIds.length != tags.length){
      return res.status(400).json({
        success : false ,
        message : "Invalid Tag Ids"
      })
    }

    const validTagIds = tags.map(item=>{
      return new mongoose.Types.ObjectId(item)
    })

    // console.log(validTagIds)

    const conditions = {
      _id: {
        $in : validTagIds
      }
    }

    const checkTags = await tagModel.find(conditions)

    // console.log(checkTags)

    if(checkTags.length != validTagIds.length){
      return res.status(404).json({
        success : false ,
        message : "No Such Tags Found"
      })
    }

    newPost.tags = validTagIds

    }else if(tags && typeof tags == 'string'){
      
      const tagId = new mongoose.Types.ObjectId(tags)
      const checkTag = await tagModel.findById(tagId)

      if(!checkTag){
        return res.status(404).json({
        success : false ,
        message : "No Such Tags Found"
        })
      }
      newPost.tags = [tagId]


    }

    

    if(req.file){
      const postImage = req.file.filename
      newPost.postImage = postImage

    }

    // console.log(newPost)


    const createPost = await postModel.create(newPost);
    
    res.status(200).json({
      success : true, 
      message: "Post Created Successfully"
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
                Show Posts List
+++++++++++++++++++++++++++++++++++++++++++++++++ */


exports.showPostList = async(req, res)=>{
  try{
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sortTerm = req.query.sort || 'createdAt';
    const sortOrder = req.query.sortOrd || 'desc';
    const searchTerm = req.query.search;
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const authorId = req.query.authorId && new mongoose.Types.ObjectId(req.query.authorId);


    const sortCriteria = {};

    if(sortOrder == 'desc'){
      sortCriteria[sortTerm] = -1

    }else{
      sortCriteria[sortTerm] = 1
    }

    const matchFilter = []

    if(searchTerm){
      
      matchFilter.push({
        $or : [ 
          {title: {$regex : searchTerm , $options: 'i'}},
          {slug: {$regex : searchTerm, $options: 'i'}},
          {content: {$regex : searchTerm, $options: 'i'}},
          {excerpt: {$regex : searchTerm, $options: 'i'}},
          {categoryName: {$regex : searchTerm, $options: 'i'}},
          {authorName: {$regex : searchTerm, $options: 'i'}},
          {tagNames: {$regex : searchTerm, $options: 'i'}},

        ]


      })

    }

     let parsedStartDate = null;
    let parsedEndDate = null;

    if (startDate) {
    const tempDate = new Date(startDate);
    if (!isNaN(tempDate.getTime())) { 
      parsedStartDate = tempDate;
      parsedStartDate.setUTCHours(0, 0, 0, 0);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid startDate format.' });
    }
  }



  if (endDate) {
    const tempDate = new Date(endDate);
    if (!isNaN(tempDate.getTime())) { // Check if valid date
      parsedEndDate = tempDate;
      // Set to the very end of the day in UTC
      parsedEndDate.setUTCHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid endDate format.' });
    }
  }



    if(parsedStartDate){


      matchFilter.push({
        createdAt : {$gte : parsedStartDate}
      })

    }

    if(parsedEndDate){


      matchFilter.push({
        createdAt : {$lte : parsedEndDate}
      })
      
    }

    if(status){
      matchFilter.push({
        status: status
      })
    }

    if(authorId){
      matchFilter.push({
        authorId: authorId
      })
    }

    

    const mainPipe = [
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind : {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup : {
          from : 'users',
          localField : 'authorId',
          foreignField : '_id',
          as : 'author'
        }

      },
      {
        $unwind : {
          path: '$author',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup : {
          from : 'tags',
          localField : 'tags',
          foreignField : '_id',
          as : 'tagDetails'
        }

      },
      {
        $addFields : {
          categoryName :{
            $ifNull : ['$category.categoryName', null]
          },
          authorName : {
            $ifNull : ['$author.name', null]
          },
          tagNames : '$tagDetails.tag'
            
         
        },

      },
      {
      $project : {
        category : 0,
        author : 0,
        tagDetails : 0,
      }
    }
    ]


    

    if(matchFilter.length > 0){
      mainPipe.push({
        $match : {
          $and : matchFilter
        }
      });
    }

    // console.log(mainPipe)



    const postPipeLine = [...mainPipe];
    const countPipeLine = [...mainPipe];
    // console.log(mainPipe)


    postPipeLine.push(
      {
        $sort : sortCriteria 
      },
      {
        $skip : skip
      },
      {
        $limit : limit
      }
    )

    countPipeLine.push({
      $count : 'postCount'
    })

    // console.log(postPipeLine)
    const postsList = await postModel.aggregate(postPipeLine).exec();
    const countPosts = await postModel.aggregate(countPipeLine).exec();

    res.status(200).json({
      success : true,
      message : "Fetched the Post Successfully",
      count : countPosts[0]?.postCount || 0,
      result : postsList
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
                Show Single Post
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.showSinglePost = async(req, res)=>{
  try{

    const postId = req.params.id;

    const validId = mongoose.Types.ObjectId.isValid(postId)

    if(!validId){
      return res.status(405).json({
        success : false,
        message : "Invalid Post Id"
      })
    }

  
    const mainPipe = [
      {
          $match: {
            _id: new mongoose.Types.ObjectId(postId)
          }

        },
      {

        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind : {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup : {
          from : 'users',
          localField : 'authorId',
          foreignField : '_id',
          as : 'author'
        }

      },
      {
        $unwind : {
          path: '$author',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup : {
          from : 'tags',
          localField : 'tags',
          foreignField : '_id',
          as : 'tagDetails'
        }

      },
      {
        $addFields : {
          categoryName :{
            $ifNull : ['$category.categoryName', null]
          },
          authorName : {
            $ifNull : ['$author.name', null]
          },
          tagNames : '$tagDetails.tag'
            
         
        },

      },
      {
      $project : {
        category : 0,
        author : 0,
        tagDetails : 0,
      }
    }
    ]


    const postShow = await postModel.aggregate(mainPipe).exec();

    if(postShow.length == 0){
      return res.status(404).send({
        success : false,
        message : 'No Post found'
      })
    }


    res.status(200).json({
      success : true,
      message : "Fetched the Post Successfully",
      result : postShow[0]
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
                Update Post
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.updatePost = async(req, res)=>{
  try{
    
    // console.log(req.body);
    const postId = req.params.id;
    const {title, slug, content, excerpt, authorId, categoryId, status, tags , imageExist } = req.body;

    // console.log(title)


    const newPost = {}
   
    if(title){
      newPost.title = stringFunc.Capitalize(title)
    }


    const validAuthorId = mongoose.Types.ObjectId.isValid(authorId);
    const validCategoryId = mongoose.Types.ObjectId.isValid(categoryId);

    if(!validAuthorId || !validCategoryId){

      return res.status(400).json({
        success : false,
        message : "Please Provide Valid Ids"

      })
    }

    const userId = new mongoose.Types.ObjectId(authorId);
    const catId = new mongoose.Types.ObjectId(categoryId);

    const checkUser =  await userModel.findById(userId);
    const checkCategory = await catModel.findById(catId);

    if( !checkUser){
      return res.status(404).json({
        success : false ,
        message : "No Such Author Found"
      })
    }

    if(!checkCategory){
      return res.status(404).json({
        success : false,
        message : "No Such Category Found"
      })
    }


    newPost.authorId = userId;
    newPost.categoryId = catId;

    

    if(content){
      newPost.content = content
    }

    if(excerpt){
      newPost.excerpt = excerpt
    }

    if(status){
      newPost.status = status
    }

    // console.log(tags);

    
    // console.log(typeof tags);
    if(tags && typeof tags != 'string'){
      const tagsIds = tags.filter(item=>{
        return mongoose.Types.ObjectId.isValid(item)
      })

      // console.log(tagsIds)

      if(tagsIds.length != tags.length){
      return res.status(400).json({
        success : false ,
        message : "Invalid Tag Ids"
      })
    }

    const validTagIds = tags.map(item=>{
      return new mongoose.Types.ObjectId(item)
    })

    // console.log(validTagIds)

    const conditions = {
      _id: {
        $in : validTagIds
      }
    }

    const checkTags = await tagModel.find(conditions)

    // console.log(checkTags)

    if(checkTags.length != validTagIds.length){
      return res.status(404).json({
        success : false ,
        message : "No Such Tags Found"
      })
    }

    newPost.tags = validTagIds

    }else if(tags && typeof tags == 'string'){
      
      const tagId = new mongoose.Types.ObjectId(tags)
      const checkTag = await tagModel.findById(tagId)

      if(!checkTag){
        return res.status(404).json({
        success : false ,
        message : "No Such Tags Found"
        })
      }
      newPost.tags = [tagId]

    }

    const id = new mongoose.Types.ObjectId(postId)
    const postCheck = await postModel.findById(id)


  


    if(!postCheck){
      return res.status(404).json({
        success : false ,
        message : "No Such Post Found"
      })

    }


    if(postCheck.slug == null && !slug ){
      newPost.slug =  stringFunc.makeSlugType(title);
    }else if(postCheck.slug == null && slug) {
      newPost.slug = slug;
    }


    if(imageExist == 'false' && !req.file && postCheck.postImage){
      delMediaPaths.delSingleFilePath(postCheck.postImage, postUploadDir)

    }
    else if(req.file && imageExist == 'true' && postCheck.postImage){
      delMediaPaths.delSingleFilePath(postCheck.postImage)

      const postImage = req.file.filename
      newPost.postImage = postImage

    }else if(req.file && imageExist == 'true' && !postCheck.postImage){
      const postImage = req.file.filename
      newPost.postImage = postImage
    }

    // console.log(newPost)


    const updatePost = await postModel.findByIdAndUpdate(id, newPost, {new : true});
    
    res.status(200).json({
      success : true, 
      message: "Post Updated Successfully"
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
                Delete Post
+++++++++++++++++++++++++++++++++++++++++++++++++ */


exports.deletePost = async (req, res)=>{
  try{
    const id = req.params.id;
    const postId = new mongoose.Types.ObjectId(id)
    const postCheck = await postModel.findById(postId)
    if(!postCheck){
      return res.status(404).json({
        success : false,
        message : "Post Not Found"
      })
    }

    if(postCheck.postImage){
      delMediaPaths.delSingleFilePath(postCheck.postImage, postUploadDir);

    }
    const deleteComments = await commentModel.deleteMany({postId: postId})

    const deletePost = await postModel.findByIdAndDelete(postId);
    res.status(200).json({
      success : true,
      message : "Post Deleted Successfully"
    })




  }catch(err){
    onsole.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}