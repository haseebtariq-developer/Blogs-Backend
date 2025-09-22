const mongoose = require('mongoose');
const commentModel = require('../models/comment.model');
const postModel = require('../models/post.model')
const userModel = require('../models/user.model')
const stringFunc = require('../utils/stringFunctions');



/* ++++++++++++++++++++++++++++++++++++++++++++++
                Create Comment
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.createComment = async (req, res)=>{
  try{

    const {postId, authorName, content, parentId, status, userId } = req.body;

   

    if(!content || !authorName || !postId || !userId){
      return res.status(400).json({
        success : false,
        message: 'Missing required fields'
      });
    }


    const idPost = new mongoose.Types.ObjectId(postId);
    const idUser = new mongoose.Types.ObjectId(userId);
    const idParent = parentId ? new mongoose.Types.ObjectId(parentId) : null;

    const newComment = {
      authorName: stringFunc.Capitalize(authorName),
      content: content,

    }

    const checkPost = await postModel.findById(idPost);

    if(!checkPost){
      return res.status(404).json({
      success : false,
      message : `No such Post Exist`
      })
    }

    const checkUser = await userModel.findById(idUser);

    if(!checkUser){
      return res.status(404).json({
      success : false,
      message : `No such User Exist`
      })

    }

    if(parentId){
      const checkParentComment = await commentModel.findById(idParent);
      if(!checkParentComment){
        return res.status(404).json({
          success : false,
          message : `No such Parent Comment Exist`
        })
      }

      
    }

    newComment.postId = idPost;
    newComment.userId = idUser;
    newComment.parentId = idParent;


    if(status){
      newComment.status = status;
    }

    const commentCreated = await commentModel.create(newComment);


    res.status(200).json({
      success: true,
      message: 'Comment created successfully',
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
            Update Comment Status
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.changeCommentStatus = async(req, res)=>{
  try{

    const commentId = req.params.id;
    const idComment = new mongoose.Types.ObjectId(commentId)
    const {status}  = req.body;

    

    const checkComment = await commentModel.findById(idComment)

    if(!checkComment){
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      })
    }

    if(checkComment.status != status){
      await commentModel.findByIdAndUpdate(idComment, {status : status}, {new : true})

    }

     res.status(200).json({
      success: true,
      message: 'Comment Status Updated successfully',
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
            Update Comment Liked
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.commentLiked = async(req, res)=>{
  try{
    const commentId = req.params.id;
    const idComment = new mongoose.Types.ObjectId(commentId)

    const comment = await commentModel.findById(idComment)

    if(!comment){
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      })
    }

    const userId = req.user.id;
    // console.log(userId)

    const newReaction = {
      user : userId,
      type : 'like'
    }
    const reactionExist = comment.reactions.find(rect=> rect.user.toString() == userId.toString());
    if(!reactionExist){
      comment.reactions.push(newReaction)
    }else if(reactionExist.type == 'like'){
      comment.reactions = comment.reactions.filter(rect=>rect.user.toString() != userId.toString());
    }else{
      reactionExist.type = 'like'
    }

    await comment.save()

    res.status(200).json({
      success: true,
      message: 'Comment Liked',
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
            Update Comment DisLiked
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.commentDisliked = async(req, res)=>{
  try{

    const commentId = req.params.id;
    const idComment = new mongoose.Types.ObjectId(commentId)

    const comment = await commentModel.findById(idComment)

    if(!comment){
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      })
    }

    const userId = req.user.id;
    // console.log(userId)

    const newReaction = {
      user : userId,
      type : 'dislike'
    }
    const reactionExist = comment.reactions.find(rect=> rect.user.toString() == userId.toString());
    if(!reactionExist){
      comment.reactions.push(newReaction)
    }else if(reactionExist.type == 'dislike'){
      comment.reactions = comment.reactions.filter(rect=>rect.user.toString() != userId.toString());
    }else{
      reactionExist.type = 'dislike'
    }

    await comment.save()

    res.status(200).json({
      success: true,
      message: 'Comment Disliked',
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
              Show  Comments By Post
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.getCommentsByPost = async(req, res)=>{
  try{
    const postId = new mongoose.Types.ObjectId(req.params.id);

    const checkPost = await postModel.findById(postId)

    if(!checkPost){
      return res.status(404).json({
        success : false,
        message : "No Such Post Exist"
      })
    }

    const pipeLine = [
      {
        $match : {postId : postId}
      },
      {
        $addFields : {
          likes : {
            $size : {
              $filter :{
                input : "$reactions",
                as : 'rect',
                cond : {$eq : ["$$rect.type", "like"]}
              }
            }
          },
          dislikes :  {
            $size : {
              $filter :{
                input : "$reactions",
                as : 'rect',
                cond : {$eq : ["$$rect.type", "dislike"]}
              }
            }
          },
        }
      }
    ]

    const comments = await commentModel.aggregate(pipeLine).exec()
    const commentCount = await commentModel.countDocuments({postId : postId})
    
    res.status(200).json({
      success : true,
      message : "Fetched the Comments",
      count : commentCount,
      result : comments,
      

    })




  }catch(err){

    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}






/* ++++++++++++++++++++++++++++++++++++++++++++++
        Show All Comments With Filters
+++++++++++++++++++++++++++++++++++++++++++++++++ */
exports.getCommentList = async(req, res)=>{
  try{
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const sortTerm = req.query.sort || 'createdBy';
    const sortOrd = req.query.sortOrd || 'desc';
    const searchTerm = req.query.search;
    const authorId = req.query.author;
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;


    const sortCriteria = {}

    if(sortOrd == 'desc'){
      sortCriteria[sortTerm] = -1
    }else{
      sortCriteria[sortTerm] = 1
    }


    const matchFilter = []

    if(searchTerm){
      matchFilter.push({
        $or : [
          {authorName: {$regex : searchTerm , $options: 'i'}},
          {content: {$regex : searchTerm, $options: 'i'}},
          {status: {$regex: searchTerm, $options: 'i'}},
          
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
        status : status
      })
    }

    if(authorId){
      matchFilter.push({
        userId : new mongoose.Types.ObjectId(authorId)
      })
    }


    const pipeLine = []


    if(matchFilter.length > 0){
      pipeLine.push({
        $match : {
          $and : matchFilter
        }
      })
    }

    pipeLine.push(
      {
        $addFields : {
          likes : {
            $size : {
              $filter :{
                input : "$reactions",
                as : 'rect',
                cond : {$eq : ["$$rect.type", "like"]}
              }
            }
          },
          dislikes :  {
            $size : {
              $filter :{
                input : "$reactions",
                as : 'rect',
                cond : {$eq : ["$$rect.type", "dislike"]}
              }
            }
          },
        }
      }
    )





    const commentPipeLine = [...pipeLine]
    const countPipeLine = [...pipeLine]


    

    commentPipeLine.push(
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
      $count : 'commentCount'
    })
    // console.log(commentPipeLine)
    const commentList = await commentModel.aggregate(commentPipeLine).exec();
    const count = await commentModel.aggregate(countPipeLine).exec()

    // console.log(commentList)
    res.status(200).json({
      success: true,
      message : "Fetched the Comments",
      count : count[0]?.commentCount || 0,
      result: commentList
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
             Get Single Comment 
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.getSingleComment = async(req, res)=>{
  try{
    const commentId = new mongoose.Types.ObjectId(req.params.id);


    const pipeLine = [
      {
        $match : {_id : commentId}
      },
      {
        $addFields : {
          likes : {
            $size : {
              $filter :{
                input : "$reactions",
                as : 'rect',
                cond : {$eq : ["$$rect.type", "like"]}
              }
            }
          },
          dislikes :  {
            $size : {
              $filter :{
                input : "$reactions",
                as : 'rect',
                cond : {$eq : ["$$rect.type", "dislike"]}
              }
            }
          },
        }
      }
    ]

    const comment = await commentModel.aggregate(pipeLine).exec();

    if(comment.length == 0){
      return res.status(400).json({
        success : false,
        message : "No Comment Found"
      })
    }
    
    res.status(200).json({
      success : true,
      message : "Fetched the Comment",
      result : comment,
      

    })



  }catch(err){

    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}


/* ++++++++++++++++++++++++++++++++++++++++++++++
            Get Comments By the Parent 
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.getCommentsByParent = async(req, res)=>{
  try{

    const commentId = new mongoose.Types.ObjectId(req.params.id);


    const pipeLine = [
      {
        $match : {parentId : commentId}
      },
      {
        $addFields : {
          likes : {
            $size : {
              $filter :{
                input : "$reactions",
                as : 'rect',
                cond : {$eq : ["$$rect.type", "like"]}
              }
            }
          },
          dislikes :  {
            $size : {
              $filter :{
                input : "$reactions",
                as : 'rect',
                cond : {$eq : ["$$rect.type", "dislike"]}
              }
            }
          },
        }
      }
    ]

    const comments = await commentModel.aggregate(pipeLine).exec();
    const commentCount = await commentModel.countDocuments({parentId : commentId})
    


    res.status(200).json({
      success : true,
      message : "Fetched the Comments",
       count : commentCount,
      result : comments,

    })
    


  }catch(err){

    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}


/* ++++++++++++++++++++++++++++++++++++++++++++++
                  Delete Comment
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.deleteComments = async(req, res)=>{
  try{

    const commentId = new mongoose.Types.ObjectId(req.params.id);


      let deletedCount = 0; 
      const idsToDelete = new Set();
      idsToDelete.add(commentId.toString())

        // const comments = await commentModel.deleteMany({ parentId: commentId})
      await commentCheckAndDelete(commentId, idsToDelete )

      const idsArray = Array.from(idsToDelete).map(ids=> new mongoose.Types.ObjectId(ids));
      
      const deletedComments = await commentModel.deleteMany({
        _id : {
          $in : idsArray
        }
      })
     
      deletedCount = deletedComments.deletedCount;

      if(deletedCount == 0){
        return res.status(400).json({
          success : false,
          message : "No Comments Find to be Deleted"
        })
      }

    res.status(200).json({
      success : true,
      message : "Deleted the Comments Successfully",
      deleteCount : deletedCount
    })

  }catch(err){

    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}


const commentCheckAndDelete = async (commentId, idSet)=>{

  const children = await commentModel.find({parentId : commentId}, '_id' )

  if(children.length == 0){
    return
  }

  const childPromise = children.map(async (id)=>{
  
      idSet.add(id._id.toString())
      await commentCheckAndDelete(id._id,idSet )
  })

  await Promise.all(childPromise)

  

}