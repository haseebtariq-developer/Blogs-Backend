const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authToken = require('../middlewares/authToken');
// const swaggerJSDoc = require('swagger-jsdoc');
const rolePermissionCheck = require('../middlewares/rolePermissionCheck.middleware')
const multer = require('multer');
const storageUser = require('../middlewares/storageUserFiles.middleware')

// const storage = multer.memoryStorage()

const upload = multer({ storage: storageUser })


   /**
    * @swagger
    * /auth/register:
    *   post:
    *     summary: To Register the User
    *     tags:
    *       - Users
    *     requestBody:
    *       required: true
    *       content:
    *         multipart/form-data:
    *           schema:
    *             type: object
    *             required:
    *               - name
    *               - email
    *               - password
    *               - role
    *             properties:
    *               name:
    *                 type : string
    *                 example : John Doe
    *                 description: Name of the User
    *               email:
    *                 type : string
    *                 format : email
    *                 description: Email of the user
    *               password:
    *                 type : string
    *                 format : password
    *                 description: Password of the User
    *               status:
    *                 type : string
    *                 default : active
    *                 description: Active/Inactive Status of the User
    *               role:
    *                 type : string
    *                 description: Roles model _Id 
    *                 example: 686ba264734d056664695182
    *               userImage:
    *                 type : file
    *                 description: User Image, an image of the user ( it is optional )
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
    *                   example: User Registered Successfully
    *       '400':
    *         description: If Email is in the DataBase already
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
    *                   example: User already exists
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


// User Create
router.post('/auth/register', upload.single('userImage'), userController.createUser);

   /**
    * @swagger
    * /auth/login:
    *   post:
    *     summary: For User To Login and Recieve the JWT Token
    *     tags:
    *       - Users
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - email
    *               - password
    *             properties:
    *               email:
    *                 type : string
    *                 format : email
    *                 description: Email of the user
    *               password:
    *                 type : string
    *                 format : password
    *                 description: Password of the User
    *     responses:
    *       '200':
    *         description: Successfully Logged In
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
    *                   example: User logged in successfully
    *                 token:
    *                   type: string
    *                   description: Token for the authentication of the user. Have the id, email and permissions of the User
    *       '404':
    *         description: User of this Email Does not Exist
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
    *                   example: User not Found              
    *       '401':
    *         description: Incorrect/ Invalid Password
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
    *                   example: Invalid password       
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

// User Login
router.post('/auth/login', userController.loginUser );


   /**
    * @swagger
    * /auth/logout:
    *   post:
    *     summary: For User To Logout and Delete the Token (Protected Route)
    *     tags:
    *       - Users
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`'    
    *     responses:
    *       '200':
    *         description: Successfully Logged Out
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
    *                   example: User logged out successfully
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


// User Logout
router.post('/auth/logout', authToken, userController.logoutUser);

/**  
    * @swagger
    * /users:
    *   get:
    *     summary: Get All the Users and Show them in the Admin Panel. Also Use for Filtering, Sorting and Pagination (Protected Route) - (Role Permission Check)
    *     description: It is a route to get all the users. Provide query parameters with the route and based on that you will get the data.
    *     tags:
    *       - Users
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - name : limit
    *         in : query
    *         description : The Query Parmeter to limit the data numbers. Mean if provided 10, will get you 10 number of users
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
    *       - name : sort_ord
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
    *         description : The Query Parmeter for searching the Data. it filter the users based on name, email, role name and permissions.
    *         required : false
    *         schema :
    *           type : string
    *           example : admi
    *       - name : status
    *         in : query
    *         description : The Query Parmeter to filter the users based on the status 
    *         required : false
    *         schema :
    *           type : string
    *           enum :
    *             - active
    *             - inactive
    *           example : active
    *       - name : role
    *         in : query
    *         description : The Query Parmeter to filter the users based on the role. Please Provide the id of the Role when filtered
    *         required : false
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
    *                   description : count of the users based on the filteration or pagination
    *                 result : 
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties:
    *                       _id : 
    *                         type : string
    *                         description : Unique Identifier of the User
    *                         example: 686cb9c3b38dbbf51915727a  
    *                       name : 
    *                         type : string
    *                         description : Name of the User
    *                         example: Admin User
    *                       email : 
    *                         type : string
    *                         description : Email of the User
    *                         example: adminuser@text.com
    *                       password : 
    *                         type : string
    *                         description : Encrypted Password of the User
    *                         example: $2b$10$4lTZevQ48.Uk.0Dqud82zOj5or2u4V7IIMLg.5JKhV2eL3wR/UJfG
    *                       role : 
    *                         type : object
    *                         description : All Role Object as in the Role Route. Please see that route /roles/all
    *                         example : "{} All Role Object as in the Role Route. Please see that route /roles/all"
    *                       userImage : 
    *                         type : string
    *                         description : Image of the User If it has OR null
    *                         example : imageexample.png | null
    *                       status : 
    *                         type : string
    *                         description : Status of the user active or inactive
    *                         example : active | inactive
    *                       createdAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z
    *                       updatedAt :
    *                         type : date
    *                         example: 2025-07-08T06:25:07.286Z     
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


// Listing all the Users
router.get('/users', authToken, rolePermissionCheck('user_management'), userController.ListAllUsers)

/**  
    * @swagger
    * /user/:id:
    *   get:
    *     summary: Get Single User and Show them in the Customer or Admin Side. (Protected Route)
    *     description: It is a route to get single. Provide only id in the parameters
    *     tags:
    *       - Users
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - name : id
    *         in : path
    *         description : The unique identifier of the user which you want to get
    *         required : true
    *         schema :
    *           type : string
    *           example : 686e0f238b72e806182a4bd6
    *     responses:
    *       '200':
    *         description: User Found 
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
    *                   example: User Found
    *                 result : 
    *                   type: object
    *                   properties:
    *                     _id : 
    *                       type : string
    *                       description : Unique Identifier of the User
    *                       example: 686cb9c3b38dbbf51915727a  
    *                     name : 
    *                       type : string
    *                       description : Name of the User
    *                       example: Admin User
    *                     email : 
    *                       type : string
    *                       description : Email of the User
    *                       example: adminuser@text.com
    *                     password : 
    *                       type : string
    *                       description : Encrypted Password of the User
    *                       example: $2b$10$4lTZevQ48.Uk.0Dqud82zOj5or2u4V7IIMLg.5JKhV2eL3wR/UJfG
    *                     role : 
    *                       type : object
    *                       description : All Role Object as in the Role Route. Please see that route /roles/all
    *                       example : "{} All Role Object as in the Role Route. Please see that route /roles/all"
    *                     userImage : 
    *                       type : string
    *                       description : Image of the User If it has OR null
    *                       example : imageexample.png | null
    *                     status : 
    *                       type : string
    *                       description : Status of the user active or inactive
    *                       example : active | inactive
    *                     createdAt :
    *                       type : date
    *                       example: 2025-07-08T06:25:07.286Z
    *                     updatedAt :
    *                       type : date
    *                       example: 2025-07-08T06:25:07.286Z     
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
    *         description: If user not found
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
    *                   example: User not Found 
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


// Get Single User 
router.get('/user/:id', authToken,  userController.getSingleUser)

/**
    * @swagger
    * /users/:id:
    *   put:
    *     summary: To Update the User (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Users
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`'  
    *       - name : id
    *         in : path
    *         description : The unique identifier of the user which you want to get
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
    *             properties:
    *               name:
    *                 type : string
    *                 example : John Doe
    *                 description: Name of the User
    *               email:
    *                 type : string
    *                 format : email
    *                 description: Email of the user
    *               password:
    *                 type : string
    *                 format : password
    *                 description: Password of the User
    *               status:
    *                 type : string
    *                 default : active
    *                 description: Active/Inactive Status of the User
    *               role:
    *                 type : string
    *                 description: Roles model _Id 
    *                 example: 686ba264734d056664695182
    *               userImage:
    *                 type : file
    *                 description: User Image, an image of the user ( it is optional )
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
    *                   example: User Updated Successfully
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
    *         description: If User is not Found
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
    *                   example: User not Found
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

// Update The User
router.put('/users/:id', upload.single('userImage'), authToken, rolePermissionCheck('user_management'), userController.updateUser )


/**
    * @swagger
    * /users/:id:
    *   delete:
    *     summary: To Delete the User (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Users
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
    *                   example: User Deleted Successfully
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
    *         description: If User is not Found
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
    *                   example: User not Found
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

// Delete The User 
router.delete('/users/:id', authToken, rolePermissionCheck('user_management'), userController.deleteUser)


module.exports = router