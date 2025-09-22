const express = require('express');
const router = express.Router()
const authToken = require('../middlewares/authToken');
const rolePermissionCheck = require('../middlewares/rolePermissionCheck.middleware')
const tagController = require('../controllers/tags.controller')


/**
    * @swagger
    * /tag:
    *   post:
    *     summary: To Create the Tag (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Tags
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
    *               - tag
    *             properties:
    *               tag:
    *                 type : string
    *                 example : tag1
    *                 description: Name of the Tag
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
    *                   example: Tag Successfully Created
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
    *       '405':
    *         description: If Tag Already Exist
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
    *                   example: This Tag Already Exist  
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

// create Tag
router.post('/tag',authToken, rolePermissionCheck('cat_tag_management') ,  tagController.createTag);


/**  
    * @swagger
    * /tags:
    *   get:
    *     summary: Get All the tags and Show them Anywhere. Also Use for Filtering, Sorting and Pagination 
    *     description: It is a route to get all the tags. Provide query parameters with the route and based on that you will get the data.
    *     tags:
    *       - Tags
    *     parameters :
    *       - name : limit
    *         in : query
    *         description : The Query Parmeter to limit the data numbers. Mean if provided 10, will get you 10 number of Records
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
    *         description : The Query Parmeter for searching the Data. it filter the category based on categoryName, parentCategory, description.
    *         required : false
    *         schema :
    *           type : string
    *           example : admi
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
    *                   description : count of the Tags based on the filteration 
    *                 result : 
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties:
    *                       _id : 
    *                         type : string
    *                         description : Unique Identifier of the Tag
    *                         example: 686cb9c3b38dbbf51915727a  
    *                       tag : 
    *                         type : string
    *                         description : tag
    *                         example: tag1
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

// show Tag List
router.get('/tags', tagController.showTagList);

/**
    * @swagger
    * /tag/:id:
    *   put:
    *     summary: To Update the Tag (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Tags
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`'  
    *       - name : id
    *         in : path
    *         description : The unique identifier of the category which you want to update
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
    *             properties:
    *               tag:
    *                 type : string
    *                 example : tag1
    *                 description: Name of the Tag
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
    *                   example: Tag Updated Successfully
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
    *       '405':
    *         description: If Tag Does not Exist
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
    *                   example: No Such Tag Exist
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

// update Tag 
router.put('/tag/:id', authToken, rolePermissionCheck('cat_tag_management'), tagController.updateTag);


/**
    * @swagger
    * /tag/:id:
    *   delete:
    *     summary: To Delete the User (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Tags
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`'  
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
    *                   example: Tag Deleted Successfully
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
    *       '405':
    *         description: If Tag is not Found
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
    *                   example: No Such Tag Exist
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


// Delete Tag
router.delete('/tag/:id', authToken, rolePermissionCheck('cat_tag_management'), tagController.deleteTag);









module.exports = router