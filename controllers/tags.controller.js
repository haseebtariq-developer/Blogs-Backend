const mongoose = require('mongoose');
const tagModel = require('../models/tag.model');
const stringFunc = require('../utils/stringFunctions');


/* ++++++++++++++++++++++++++++++++++++++++++++++
                Create Tag
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.createTag = async(req, res)=>{
  try{
    const {tag} = req.body;
    const tagName = stringFunc.Capitalize(tag);
    const checkTag = await tagModel.findOne({tag : tagName});
    console.log(checkTag)

    if(checkTag){
      return res.status(405).json({
        success : false,
        message : "This Tag Already Exist"
      })
    }

    const newTag = await tagModel.create({tag: tagName})

    res.status(200).json({
      success : true,
      message : " Tag Successfully Created"
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
                Show Tag List
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.showTagList = async (req, res)=>{
  try{

    const limit  = req.query.limit || 10;
    const page  = req.query.page || 1;
    const skip = (page - 1 ) * limit;

    const  searchTerm =  req.query.search ;

    const sortTerm = req.query.sort || 'createdAt';
    const sortOrd = req.query.sortOrd || 'desc';

    const sortQuery = {};

    if(sortOrd == 'desc'){
      sortQuery[sortTerm] = -1

    }else{
      sortQuery[sortTerm] = 1
    }

    const  filter = {};

    if(searchTerm){
      filter.$or = [
        {tag: {$regex : searchTerm , $options: 'i'}},
      ]
    }


    const showTagList = await tagModel.find(filter).sort(sortQuery).limit(limit).skip(skip);

    const showTagCount = await tagModel.countDocuments(filter);

    res.status(200).json({
      success : true,
      message : "Fetched the Data Successfully",
      count : showTagCount,
      result : showTagList
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
                Update Tag 
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.updateTag = async(req, res)=>{
  try{
    const {tag} = req.body;
    const tagsId = req.params.id;
    
        const tagId = new mongoose.Types.ObjectId(tagsId);
    
        const checkTag = await tagModel.findById(tagId);
        if(!checkTag){
          return res.status(405).json({
            success : false,
            message : "No Such Tag Exist"
          })
    
        }
    
    
    const updateTag = {}

    if(tag){
      const tagName = stringFunc.Capitalize(tag);
      updateTag.tag = tagName
    }

    const updation = await tagModel.findByIdAndUpdate(tagId , updateTag, {new : true})

    res.status(200).json({
      success : true,
      message : " Tag Successfully Updated"
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
                Delete Tag 
+++++++++++++++++++++++++++++++++++++++++++++++++ */

exports.deleteTag = async (req, res)=>{
  try{

    const tagsId = req.params.id;
    
        const tagId = new mongoose.Types.ObjectId(tagsId);
    
        const checkTag = await tagModel.findById(tagId);
        if(!checkTag){
          return res.status(405).json({
            success : false,
            message : "No Such Tag Exist"
          })
    
        }

      const deleteTag = await tagModel.findByIdAndDelete(tagId)

      res.status(200).json({
        success : true,
        message : "Tag Deleted Successfully"
      })
    
    



  }catch(err){
    console.log("Internal Server Error", err)
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}
