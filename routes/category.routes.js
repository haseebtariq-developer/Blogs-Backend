const express = require('express');
const router = express.Router();
const authToken = require('../middlewares/authToken');
const rolePermissionCheck = require('../middlewares/rolePermissionCheck.middleware')
const categoryController = require('../controllers/category.controller')

 /**
    * @swagger
    * /category:
    *   post:
    *     summary: To Create the Category (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Categories
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
    *               - categoryName
    *             properties:
    *               categoryName:
    *                 type : string
    *                 example : Entertainment
    *                 description: Name of the Category
    *               parentId:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: parent Category if want to give it 
    *               description:
    *                 type : string
    *                 description: description of the Category
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
    *                   example: category Created Successfully
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
    *         description: If Category Already Exist
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
    *                   example: This category Already Exist 
    *       '404':
    *         description: if given the wrong parent Id
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
    *                   example: No such Parent Category Exist 
    *       '406':
    *         description: Invalid Parent Id or wrong Id Format
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
    *                   example: Please Provide valid Parent Id 
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

// Create Category 
router.post('/category', authToken, rolePermissionCheck('cat_tag_management'), categoryController.createCategory);

/**  
    * @swagger
    * /categories:
    *   get:
    *     summary: Get All the Categories and Show them Anywhere. Also Use for Filtering, Sorting and Pagination 
    *     description: It is a route to get all the categories. Provide query parameters with the route and based on that you will get the data.
    *     tags:
    *       - Categories
    *     parameters :
    *       - name : limit
    *         in : query
    *         description : The Query Parmeter to limit the data numbers. Mean if provided 10, will get you 10 number of categories
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
    *                   description : count of the Categories based on the filteration 
    *                 result : 
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties:
    *                       _id : 
    *                         type : string
    *                         description : Unique Identifier of the Category
    *                         example: 686cb9c3b38dbbf51915727a  
    *                       categoryName : 
    *                         type : string
    *                         description : Name of the Category
    *                         example: Media
    *                       parentId : 
    *                         type : string
    *                         description : Parent Category Identifier
    *                         example: 686cb9c3b38dbbf51915727a
    *                       description : 
    *                         type : string
    *                         description : Description of the Category
    *                         example: this is the description of the Category
    *                       parentCategory : 
    *                         type : string
    *                         description : Parent Category Name
    *                         example : Entertainment
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

// Show Category  List with Filters
router.get('/categories', categoryController.getCategoryList )

/**
    * @swagger
    * /category/:id:
    *   put:
    *     summary: To Update the Category (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Categories
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
    *               categoryName:
    *                 type : string
    *                 example : Entertainment
    *                 description: Name of the Category
    *               parentId:
    *                 type : string
    *                 example : 6870dd8cb7a4a297c8189bfe
    *                 description: parent Category if want to give it 
    *               description:
    *                 type : string
    *                 description: description of the Category
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
    *                   example: Category Updated Successfully
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
    *         description: If Category Does not Exist
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
    *                   example: No Such Category Exist
    *       '404':
    *         description: if given the wrong parent Id
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
    *                   example: No such Parent Category Exist 
    *       '406':
    *         description: Invalid Parent Id or wrong Id Format
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
    *                   example: Please Provide valid Parent Id 
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

// Update Categories
router.put('/category/:id', authToken, rolePermissionCheck('cat_tag_management'), categoryController.updateCategory)

/**
    * @swagger
    * /category/:id:
    *   delete:
    *     summary: To Delete the Category (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Categories
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - name : id
    *         in : path
    *         description : The unique identifier of the category which you want to delete
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
    *                   example: Category Deleted Successfully
    *       '400':
    *         description: If Category is used in the posts, it will not be deleted
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
    *                   example: Category is used in posts, cannot be deleted  
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
    *         description: if given the wrong category Id
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
    *                   example: Category Not Found
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


// Delete Category
router.delete('/category/:id', authToken, rolePermissionCheck('cat_tag_management'), categoryController.deleteCategory)

module.exports = router