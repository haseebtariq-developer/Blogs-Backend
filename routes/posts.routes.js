const express = require('express');
const router = express.Router()
const authToken = require('../middlewares/authToken');
const multer  = require('multer')
const rolePermissionCheck = require('../middlewares/rolePermissionCheck.middleware')
const postController = require('../controllers/post.controller')
const postStorage = require('../middlewares/storagePostFiles.middleware')



// const storage = multer.memoryStorage()

const upload = multer({ storage: postStorage })




/**
    * @swagger
    * /post:
    *   post:
    *     summary: To Create the Post (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Posts
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
    *         multipart/form-data:
    *           schema:
    *             type: object
    *             required:
    *               - title
    *               - authorId
    *               - categoryId
    *             properties:
    *               title:
    *                 type : string
    *                 example : Entertainment in Busy Life
    *                 description: title of the Post
    *               authorId:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: User Id of the Author or Current User
    *               categoryId:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: Category Id of the Post 
    *               slug:
    *                 type : string
    *                 example : entertainment-in-busy-life
    *                 description: slug of the Post if not provided will automatically set to the title
    *               content:
    *                 type : string
    *                 example : <p> Hello World</p>
    *                 description: content of the Post
    *               excerpt:
    *                 type : string
    *                 description: short Descripton of the Post 
    *               status:
    *                 type : string
    *                 example : draft/published
    *                 description: status of the Post draft/published
    *               tags:
    *                 type : [string]
    *                 example : [6870dd8cb7a4a297c8189bfe, 6870dd8cb7a4a297c8189bfe ]
    *                 description: Array of Tag Ids
    *               postFile:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: Category Id of the Post 
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
    *                   example: Post Created Successfully
    *       '400':
    *         description: For Checking the  Ids validity
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
    *                   example: Please Provide Valid Ids  
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
    *         description: if given the wrong author/ category/tags Id
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
    *                   example: No such Category Exist 
    *       '406':
    *         description: if all the required Fields are not Provided 
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
    *                   example: Please Provide Required Fields
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


// Create Post 
router.post('/post',authToken,rolePermissionCheck("create_post"), upload.single('postFile') ,  postController.createPost)



/**  
    * @swagger
    * /posts:
    *   get:
    *     summary: Get All the Posts and Show them Anywhere. Also Use for Filtering, Sorting and Pagination 
    *     description: It is a route to get all the posts. Provide query parameters with the route and based on that you will get the data.
    *     tags:
    *       - Posts
    *     parameters :
    *       - name : limit
    *         in : query
    *         description : The Query Parmeter to limit the data numbers. Mean if provided 10, will get you 10 number of posts
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
    *         description : The Query Parmeter to only get the data with certain status either draft or published.
    *         required : false
    *         schema :
    *           type : string
    *           example : draft/published
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
    *                   example: Fetched the Users
    *                 count:
    *                   type: number
    *                   example: 10
    *                   description : count of the Posts based on the filteration 
    *                 result : 
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties:
    *                       _id : 
    *                         type : string
    *                         description : Unique Identifier of the Post
    *                         example: 686cb9c3b38dbbf51915727a  
    *                       title : 
    *                         type : string
    *                         description : Title of the Post
    *                         example: Entertainment in busy Life
    *                       slug : 
    *                         type : string
    *                         description : slug of the Post
    *                         example: entertainment-in-busy-life
    *                       content : 
    *                         type : string
    *                         description : Description of the Post
    *                         example: this is the description of the Post
    *                       excerpt : 
    *                         type : string
    *                         description : short Description of the Post
    *                         example : This is the excerpt of the good new one and better one
    *                       authorId :
    *                         type : string
    *                         description : Author/User Id   
    *                         example: 686e0d9afc761364f870f503
    *                       categoryId :
    *                         type : string
    *                         description : Category Id
    *                         example: 686e0d9afc761364f870f503   
    *                       status : 
    *                         type : string
    *                         description : draft/published
    *                         example: draft
    *                       tags : 
    *                         type : string
    *                         description : tag Ids of the Post
    *                         example: [686e0d9afc761364f870f503, 686e0d9afc761364f870f503]
    *                       postImage : 
    *                         type : string
    *                         description : Image of the Post
    *                         example : image.png
    *                       categoryName :
    *                         type : string
    *                         description : Category Name
    *                         example: Entertainment    
    *                       authorName : 
    *                         type : string
    *                         description : User Name or author Name who wrote the post
    *                         example: User 1
    *                       tagNames : 
    *                         type : string
    *                         description : tags with the names in them
    *                         example: [tag1, tag2]
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

// Show Posts List
router.get('/posts', postController.showPostList);


/**  
    * @swagger
    * /post/:id:
    *   get:
    *     summary: Get Single Posts and Show it Anywhere. 
    *     description: It is a route to get single post. 
    *     tags:
    *       - Posts
    *     parameters :
    *       - name : id
    *         in : path
    *         description : The unique identifier of the post which you want to get
    *         required : true
    *         schema :
    *           type : string
    *           example : 686e0f238b72e806182a4bd6
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
    *                   example: Fetched the Users
    *                 count:
    *                   type: number
    *                   example: 10
    *                   description : count of the Categories based on the filteration 
    *                 result : 
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties:
    *                       _id : 
    *                         type : string
    *                         description : Unique Identifier of the Post
    *                         example: 686cb9c3b38dbbf51915727a  
    *                       title : 
    *                         type : string
    *                         description : Title of the Post
    *                         example: Entertainment in busy Life
    *                       slug : 
    *                         type : string
    *                         description : slug of the Post
    *                         example: entertainment-in-busy-life
    *                       content : 
    *                         type : string
    *                         description : Description of the Post
    *                         example: this is the description of the Post
    *                       excerpt : 
    *                         type : string
    *                         description : short Description of the Post
    *                         example : This is the excerpt of the good new one and better one
    *                       authorId :
    *                         type : string
    *                         description : Author/User Id   
    *                         example: 686e0d9afc761364f870f503
    *                       categoryId :
    *                         type : string
    *                         description : Category Id
    *                         example: 686e0d9afc761364f870f503   
    *                       status : 
    *                         type : string
    *                         description : draft/published
    *                         example: draft
    *                       tags : 
    *                         type : string
    *                         description : tag Ids of the Post
    *                         example: [686e0d9afc761364f870f503, 686e0d9afc761364f870f503]
    *                       postImage : 
    *                         type : string
    *                         description : Image of the Post
    *                         example : image.png
    *                       categoryName :
    *                         type : string
    *                         description : Category Name
    *                         example: Entertainment    
    *                       authorName : 
    *                         type : string
    *                         description : User Name or author Name who wrote the post
    *                         example: User 1
    *                       tagNames : 
    *                         type : string
    *                         description : tags with the names in them
    *                         example: [tag1, tag2]
    *                       createdAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z
    *                       updatedAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z    
    *       '405':
    *         description: if given the invalid post Id
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
    *                   example: Invalid Post Id
    *       '404':
    *         description: if the id that is provided is wrong or such post are not found
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
    *                   example: No post found
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

// Single Post Show 
router.get('/post/:id', postController.showSinglePost )


/**
    * @swagger
    * /post/:id:
    *   put:
    *     summary: To Update the Post (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Posts
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - name : id
    *         in : path
    *         description : The unique identifier of the post which you want to update
    *         required : true
    *         schema :
    *           type : string
    *           example : 686e0f238b72e806182a4bd6
    *     requestBody:
    *       required: true
    *       content:
    *         multipart/form-data:
    *           schema:
    *             type: object
    *             required:
    *               - authorId
    *               - categoryId
    *             properties:
    *               title:
    *                 type : string
    *                 example : Entertainment in Busy Life
    *                 description: title of the Post
    *               authorId:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: User Id of the Author or Current User
    *               categoryId:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: Category Id of the Post 
    *               slug:
    *                 type : string
    *                 example : entertainment-in-busy-life
    *                 description: slug of the Post if not provided will automatically set to the title
    *               content:
    *                 type : string
    *                 example : <p> Hello World</p>
    *                 description: content of the Post
    *               excerpt:
    *                 type : string
    *                 description: short Descripton of the Post 
    *               status:
    *                 type : string
    *                 example : draft/published
    *                 description: status of the Post draft/published
    *               tags:
    *                 type : [string]
    *                 example : [6870dd8cb7a4a297c8189bfe, 6870dd8cb7a4a297c8189bfe ]
    *                 description: Array of Tag Ids
    *               postFile:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: Category Id of the Post 
    *               imageExist:
    *                 type : string
    *                 example : true
    *                 description: true or false based on the image exist. It means if image is selected or image exist and not deleted from the frontend it will be true if image is deleted from front end and no image selected it will be false 
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
    *                   example: Post Updated Successfully
    *       '400':
    *         description: For Checking the  Ids validity
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
    *                   example: Please Provide Valid Ids  
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
    *         description: if given the wrong author/ category/tags Id
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
    *                   example: No such Category Exist 
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



// Update Post
router.put('/post/:id', authToken, rolePermissionCheck("edit_post"), upload.single('postFile'), postController.updatePost)

/**
    * @swagger
    * /post/:id:
    *   delete:
    *     summary: To Delete the Post (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Posts
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - name : id
    *         in : path
    *         description : The unique identifier of the post which you want to delete
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
    *                   example: Post Deleted Successfully
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
    *         description: if given the wrong post Id
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
    *                   example: Post Not Found
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



// Delete Post
router.delete('/post/:id',authToken, rolePermissionCheck("delete_post"), postController.deletePost)






module.exports = router