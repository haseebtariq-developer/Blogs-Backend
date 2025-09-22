const express = require('express');
const router = express.Router();
const authToken = require('../middlewares/authToken');
const rolePermissionCheck = require('../middlewares/rolePermissionCheck.middleware')
const commentController = require('../controllers/comment.controller')


/**
    * @swagger
    * /comment:
    *   post:
    *     summary: To Create the Comment (Protected Route) 
    *     tags:
    *       - Comments
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - content
    *               - authorName
    *               - postId
    *               - userId
    *             properties:
    *               postId:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe 
    *                 description: Unique Identifier of the Post
    *               userId:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: User Id of the Author or Current User
    *               authorName:
    *                 type : string
    *                 example : User Name
    *                 description: name of the user 
    *               content:
    *                 type : string
    *                 example : This post is fun
    *                 description: content of the comment
    *               parentId:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: Unique Identifier of the Comment in reply of which this comment is added
    *               status:
    *                 type : string
    *                 example : pending
    *                 description: status of the comment (pending, approved,  spam)
    *     responses:
    *       '200':
    *         description: Successfully Created
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: true
    *                 message:
    *                   type: string
    *                   example: Comment Created Successfully
    *       '401':
    *         description: Access Denied! invalid token or no token
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Access Denied!  
    *       '404':
    *         description: if given the wrong author/ post/parent Id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: No such Post Exist 
    *       '500':
    *         description: A Catch Error! If the server somehow not run or errors in the code 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Internal Server Error
    *                 
    */


// Create Comment 
router.post('/comment', authToken, commentController.createComment);


/**
    * @swagger
    * /comment/status/:id:
    *   patch:
    *     summary: To Update the Post Status (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Comments
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - name : id
    *         in : path
    *         description : The unique identifier of the comment which you want to update
    *         required : true
    *         schema :
    *           type : string
    *           example : 686e0f238b72e806182a4bd6
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - status
    *             properties:
    *               status:
    *                 type : string
    *                 example : approved
    *                 description: tatus of the comment (pending, approved,  spam)
    *     responses:
    *       '200':
    *         description: Successfully Updated
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: true
    *                 message:
    *                   type: string
    *                   example: Comment Status Updated successfully
    *       '401':
    *         description: Access Denied! invalid token or no token
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Access Denied!  
    *       '403':
    *         description: Permission related Error! Either no permission or invalid Permission
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: string
    *                   example: No Permission Found  | Permission Denied
    *       '404':
    *         description: if given the wrong comment Id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Comment Not Found
    *       '500':
    *         description: A Catch Error! If the server somehow not run or errors in the code 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Internal Server Error
    *                 
    */

// Update Comment Status 
router.patch('/comment/status/:id', authToken, rolePermissionCheck("comment_management"), commentController.changeCommentStatus)

/**
    * @swagger
    * /comment/liked/:id:
    *   patch:
    *     summary: For Liking the Status (Protected Route) 
    *     description: this route is for like reaction if the user already liked and again this route is run by the same user the like reaction of this user will nullify.
    *     tags:
    *       - Comments
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - name : id
    *         in : path
    *         description : The unique identifier of the comment which you want to Like
    *         required : true
    *         schema :
    *           type : string
    *           example : 686e0f238b72e806182a4bd6
    *     responses:
    *       '200':
    *         description: Successfully Liked
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: true
    *                 message:
    *                   type: string
    *                   example: Comment Liked
    *       '401':
    *         description: Access Denied! invalid token or no token
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Access Denied!  
    *       '404':
    *         description: if given the wrong comment Id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Comment Not Found
    *       '500':
    *         description: A Catch Error! If the server somehow not run or errors in the code 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Internal Server Error
    *                 
    */


// Comment Liked
router.patch('/comment/liked/:id', authToken, commentController.commentLiked)


/**
    * @swagger
    * /comment/disliked/:id:
    *   patch:
    *     summary: For Disliking the Status (Protected Route) 
    *     description: this route is for dislike reaction if the user already disliked and again this route is run by the same user the dislike reaction of this user will nullify.
    *     tags:
    *       - Comments
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - name : id
    *         in : path
    *         description : The unique identifier of the comment which you want to disLike
    *         required : true
    *         schema :
    *           type : string
    *           example : 686e0f238b72e806182a4bd6
    *     responses:
    *       '200':
    *         description: Successfully DisLiked
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: true
    *                 message:
    *                   type: string
    *                   example: Comment disliked
    *       '401':
    *         description: Access Denied! invalid token or no token
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Access Denied!  
    *       '404':
    *         description: if given the wrong comment Id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Comment Not Found
    *       '500':
    *         description: A Catch Error! If the server somehow not run or errors in the code 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Internal Server Error
    *                 
    */

// Comment Disliked
router.patch('/comment/disliked/:id', authToken, commentController.commentDisliked)


/**  
    * @swagger
    * /comments:
    *   get:
    *     summary: Get All the Comment and Show them Anywhere. Also Use for Filtering, Sorting and Pagination 
    *     description: It is a route to get all the comments. Provide query parameters with the route and based on that you will get the data.
    *     tags:
    *       - Comments
    *     parameters :
    *       - name : limit
    *         in : query
    *         description : The Query Parmeter to limit the data numbers. Mean if provided 10, will get you 10 number of comments
    *         required : false
    *         schema :
    *           type : string
    *           example : 10
    *           default : 10
    *       - name : page
    *         in : query
    *         description : The Query Parmeter for pagination. Provide page number and limit for paginate the data
    *         required : false
    *         schema :
    *           type : string
    *           example : 1
    *           default : 1
    *       - name : sort
    *         in : query
    *         description : The Query Parmeter to sort the data. Provide Sort Term and please provide exact term in the database which you get in this route response
    *         required : false
    *         schema :
    *           type : string
    *           example : name
    *           default : createdAt
    *       - name : sortOrd
    *         in : query
    *         description : The Query Parmeter for the order of sortation. it can be Descending or Ascending
    *         required : false
    *         schema :
    *           type : string
    *           enum :
    *             - desc
    *             - asc
    *           example : asc 
    *           default : desc
    *       - name : search
    *         in : query
    *         description : The Query Parmeter for searching the Data. it filter the posts based on title, excerpt, slug, authorName, categoryName, content, tags.
    *         required : false
    *         schema :
    *           type : string
    *           example : enter
    *       - name : status
    *         in : query
    *         description : The Query Parmeter to only get the data with certain status either pending, approved or spam.
    *         required : false
    *         schema :
    *           type : string
    *           example : pending/approved/spam
    *       - name : authorId
    *         in : query
    *         description : The Query Parmeter to get the data of ceratin author. 
    *         required : false
    *         schema :
    *           type : string
    *           example : 6870dd8cb7a4a297c8189bfe
    *       - name : startDate
    *         in : query
    *         description : The Query Parmeter to get the date based on dateRange 
    *         required : false
    *         schema :
    *           type : string
    *           example : 2025-07-16T09:07:02.367Z
    *       - name : endDate
    *         in : query
    *         description : The Query Parmeter to get the date based on dateRange 
    *         required : false
    *         schema :
    *           type : string
    *           example : 2025-07-16T09:07:02.367Z
    *     responses:
    *       '200':
    *         description: Successfully Data Fetched
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: true
    *                 message:
    *                   type: string
    *                   example: Fetched the Comments
    *                 count:
    *                   type: number
    *                   example: 10
    *                   description : count of the Comments based on the filteration 
    *                 result : 
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties:
    *                       _id : 
    *                         type : string
    *                         description : Unique Identifier of the Comment
    *                         example: 686cb9c3b38dbbf51915727a  
    *                       postId : 
    *                         type : string
    *                         description : Unique Identifier of the post
    *                         example: 686cb9c3b38dbbf51915727a
    *                       userId : 
    *                         type : string
    *                         description : Unique Identifier of the User
    *                         example: 686cb9c3b38dbbf51915727a
    *                       content : 
    *                         type : string
    *                         description : this is the content of the comment
    *                         example: this post is fun
    *                       authorName : 
    *                         type : string
    *                         description : this is name of th euser
    *                         example : User Exam
    *                       parentId :
    *                         type : string
    *                         description : Unique Identifier of the Parent Comment  
    *                         example: 686e0d9afc761364f870f503  
    *                       status : 
    *                         type : string
    *                         description : draft/published
    *                         example: draft
    *                       reactions : 
    *                         type : array
    *                         description : reactions on the comments , likes or dislike and the user
    *                         items:
    *                           type : object
    *                           properties : 
    *                             user : 
    *                               type : string
    *                               description : Unique Identifier of the User who like or dislikes
    *                               example : 686e0d9afc761364f870f503 
    *                             type :
    *                               type : string
    *                               description : Type of the Reaction like/dislike
    *                               example : like
    *                       likes : 
    *                         type : number
    *                         description : Count of the likes
    *                         example : 10
    *                       dislikes :
    *                         type : number
    *                         description : Count of the dislikes
    *                         example: 4    
    *                       createdAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z
    *                       updatedAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z    
    *       '500':
    *         description: A Catch Error! If the server somehow not run or errors in the code 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: message of Error
    *                 
    */

// Show Comment List
router.get('/comments', commentController.getCommentList)


/**  
    * @swagger
    * /comments/post/:id:
    *   get:
    *     summary: Get All the Comments of the certain Posts 
    *     description: It is a route to get comments of the Posts. 
    *     tags:
    *       - Comments
    *     parameters :
    *       - name : id
    *         in : path
    *         description : Unique Identifier of the post of which you require the comments
    *         required : true
    *         schema :
    *           type : string
    *           example : 6870dd8cb7a4a297c8189bfe
    *     responses:
    *       '200':
    *         description: Successfully Data Fetched
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: true
    *                 message:
    *                   type: string
    *                   example: Fetched the Comments
    *                 count:
    *                   type: number
    *                   example: 10
    *                   description : count of the Comments found 
    *                 result : 
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties:
    *                       _id : 
    *                         type : string
    *                         description : Unique Identifier of the Comment
    *                         example: 686cb9c3b38dbbf51915727a  
    *                       postId : 
    *                         type : string
    *                         description : Unique Identifier of the post
    *                         example: 686cb9c3b38dbbf51915727a
    *                       userId : 
    *                         type : string
    *                         description : Unique Identifier of the User
    *                         example: 686cb9c3b38dbbf51915727a
    *                       content : 
    *                         type : string
    *                         description : this is the content of the comment
    *                         example: this post is fun
    *                       authorName : 
    *                         type : string
    *                         description : this is name of th euser
    *                         example : User Exam
    *                       parentId :
    *                         type : string
    *                         description : Unique Identifier of the Parent Comment  
    *                         example: 686e0d9afc761364f870f503  
    *                       status : 
    *                         type : string
    *                         description : draft/published
    *                         example: draft
    *                       reactions : 
    *                         type : array
    *                         description : reactions on the comments , likes or dislike and the user
    *                         items:
    *                           type : object
    *                           properties : 
    *                             user : 
    *                               type : string
    *                               description : Unique Identifier of the User who like or dislikes
    *                               example : 686e0d9afc761364f870f503 
    *                             type :
    *                               type : string
    *                               description : Type of the Reaction like/dislike
    *                               example : like
    *                       likes : 
    *                         type : number
    *                         description : Count of the likes
    *                         example : 10
    *                       dislikes :
    *                         type : number
    *                         description : Count of the dislikes
    *                         example: 4    
    *                       createdAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z
    *                       updatedAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z  
    *       '404':
    *         description: if given the wrong  Id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: No such Post Found   
    *       '500':
    *         description: A Catch Error! If the server somehow not run or errors in the code 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: message of Error
    *                 
    */

// Show Comments By Post
router.get('/comments/post/:id', commentController.getCommentsByPost)

/**  
    * @swagger
    * /comment/:id:
    *   get:
    *     summary: Get Single Comment 
    *     description: It is a route to get Single comment
    *     tags:
    *       - Comments
    *     parameters :
    *       - name : id
    *         in : path
    *         description : Unique Identifier of the comment 
    *         required : true
    *         schema :
    *           type : string
    *           example : 6870dd8cb7a4a297c8189bfe
    *     responses:
    *       '200':
    *         description: Successfully Data Fetched
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: true
    *                 message:
    *                   type: string
    *                   example: Fetched the Comments
    *                 result : 
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties:
    *                       _id : 
    *                         type : string
    *                         description : Unique Identifier of the Comment
    *                         example: 686cb9c3b38dbbf51915727a  
    *                       postId : 
    *                         type : string
    *                         description : Unique Identifier of the post
    *                         example: 686cb9c3b38dbbf51915727a
    *                       userId : 
    *                         type : string
    *                         description : Unique Identifier of the User
    *                         example: 686cb9c3b38dbbf51915727a
    *                       content : 
    *                         type : string
    *                         description : this is the content of the comment
    *                         example: this post is fun
    *                       authorName : 
    *                         type : string
    *                         description : this is name of th euser
    *                         example : User Exam
    *                       parentId :
    *                         type : string
    *                         description : Unique Identifier of the Parent Comment  
    *                         example: 686e0d9afc761364f870f503  
    *                       status : 
    *                         type : string
    *                         description : draft/published
    *                         example: draft
    *                       reactions : 
    *                         type : array
    *                         description : reactions on the comments , likes or dislike and the user
    *                         items:
    *                           type : object
    *                           properties : 
    *                             user : 
    *                               type : string
    *                               description : Unique Identifier of the User who like or dislikes
    *                               example : 686e0d9afc761364f870f503 
    *                             type :
    *                               type : string
    *                               description : Type of the Reaction like/dislike
    *                               example : like
    *                       likes : 
    *                         type : number
    *                         description : Count of the likes
    *                         example : 10
    *                       dislikes :
    *                         type : number
    *                         description : Count of the dislikes
    *                         example: 4    
    *                       createdAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z
    *                       updatedAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z  
    *       '400':
    *         description: if given the wrong  Id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: No Comment   
    *       '500':
    *         description: A Catch Error! If the server somehow not run or errors in the code 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: message of Error
    *                 
    */

// Show Single Comment
router.get('/comment/:id', commentController.getSingleComment)

/**  
    * @swagger
    * /comments/parent/:id:
    *   get:
    *     summary: Get All the Comments of the same Parent Comment 
    *     description: It is a route to get comments by parent Comment
    *     tags:
    *       - Comments
    *     parameters :
    *       - name : id
    *         in : path
    *         description : Unique Identifier of the comment of which you require the comments
    *         required : true
    *         schema :
    *           type : string
    *           example : 6870dd8cb7a4a297c8189bfe
    *     responses:
    *       '200':
    *         description: Successfully Data Fetched
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: true
    *                 message:
    *                   type: string
    *                   example: Fetched the Comments
    *                 count:
    *                   type: number
    *                   example: 10
    *                   description : count of the Comments found 
    *                 result : 
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties:
    *                       _id : 
    *                         type : string
    *                         description : Unique Identifier of the Comment
    *                         example: 686cb9c3b38dbbf51915727a  
    *                       postId : 
    *                         type : string
    *                         description : Unique Identifier of the post
    *                         example: 686cb9c3b38dbbf51915727a
    *                       userId : 
    *                         type : string
    *                         description : Unique Identifier of the User
    *                         example: 686cb9c3b38dbbf51915727a
    *                       content : 
    *                         type : string
    *                         description : this is the content of the comment
    *                         example: this post is fun
    *                       authorName : 
    *                         type : string
    *                         description : this is name of th euser
    *                         example : User Exam
    *                       parentId :
    *                         type : string
    *                         description : Unique Identifier of the Parent Comment  
    *                         example: 686e0d9afc761364f870f503  
    *                       status : 
    *                         type : string
    *                         description : draft/published
    *                         example: draft
    *                       reactions : 
    *                         type : array
    *                         description : reactions on the comments , likes or dislike and the user
    *                         items:
    *                           type : object
    *                           properties : 
    *                             user : 
    *                               type : string
    *                               description : Unique Identifier of the User who like or dislikes
    *                               example : 686e0d9afc761364f870f503 
    *                             type :
    *                               type : string
    *                               description : Type of the Reaction like/dislike
    *                               example : like
    *                       likes : 
    *                         type : number
    *                         description : Count of the likes
    *                         example : 10
    *                       dislikes :
    *                         type : number
    *                         description : Count of the dislikes
    *                         example: 4    
    *                       createdAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z
    *                       updatedAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z  
    *       '404':
    *         description: if given the wrong  Id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: No such Post Found   
    *       '500':
    *         description: A Catch Error! If the server somehow not run or errors in the code 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: message of Error
    *                 
    */


// Show Comments By The Parent
router.get('/comments/parent/:id', commentController.getCommentsByParent)


/**
    * @swagger
    * /comment/:id:
    *   delete:
    *     summary: To Delete the Comments and all the child comments (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Comments
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - name : id
    *         in : path
    *         description : The unique identifier of the comment which you want to delete
    *         required : true
    *         schema :
    *           type : string
    *           example : 686e0f238b72e806182a4bd6
    *     responses:
    *       '200':
    *         description: Successfully Deleted
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: true
    *                 message:
    *                   type: string
    *                   example: Comments Deleted Successfully
    *       '401':
    *         description: Access Denied! invalid token or no token
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Access Denied!  
    *       '403':
    *         description: Permission related Error! Either no permission or invalid Permission
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: string
    *                   example: No Permission Found  | Permission Denied
    *       '400':
    *         description: if given the wrong comment Id
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: No Comments Find to be Deleted
    *       '500':
    *         description: A Catch Error! If the server somehow not run or errors in the code 
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   example: false
    *                 message:
    *                   type: string
    *                   example: Internal Server Error
    *                 
    */


// Delete Comment 
router.delete('/comment/:id', authToken, rolePermissionCheck("comment_management"), commentController.deleteComments)




module.exports = router