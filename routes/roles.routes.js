const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');
const authToken = require('../middlewares/authToken');
const rolePermissionCheck = require('../middlewares/rolePermissionCheck.middleware')


/**
    * @swagger
    * /roles/create:
    *   post:
    *     summary: To Create the Role (Protected Route) - (Role Permission Check)
    *     tags:
    *       - Roles
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - role
    *               - permissions
    *             properties:
    *               role:
    *                 type : string
    *                 example : Admin
    *                 description: Role of the User like Admin, Editor, Author, Viewer Etc 
    *               permissions:
    *                 type : [string]
    *                 example : ["create_post", "edit_post", "delete_post", "user_management", "comment_management", "role_management", "cat_tag_management", "none"]
    *     responses:
    *       '200':
    *         description: Role Created Successfully
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
    *                   example: Role Created Successfully
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
    *       '402':
    *         description: Role Already Exist
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
    *                   example: This Role Already Exist!      
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


// Route for the Creating the Roles
router.post('/roles/create', authToken, rolePermissionCheck('role_management'), rolesController.createRole);

/**
    * @swagger
    * /roles/all:
    *   get:
    *     summary: To Show All the Roles. And for Assigning to the User via select input or other but assign only _id as it require
    *     tags:
    *       - Roles
    *     responses:
    *       '200':
    *         description: All Data of Roles  
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
    *                   example: Fetching all Roles
    *                 result:
    *                   type : array
    *                   items:
    *                     type: object
    *                     properties: 
    *                       _id :
    *                         type: string
    *                         description: Unique Identifier of the Role
    *                         example: "686cb9c3b38dbbf51915727a"
    *                       roleName :
    *                         type: string
    *                         description: Name of the Role like Admin, Editor etc
    *                         example : Admin
    *                       permissions : 
    *                         type: array
    *                         description: Permissions that are allowed. Can be multiple
    *                         example: ['create_post', "user_management"]
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

// Route for Getting the Roles
router.get('/roles/all', rolesController.showAllRoles);

/**  
    * @swagger
    * /roles/delete/:id:
    *   delete:
    *     summary: Delete a role by ID (Protected Route) - (Role Permission Check)
    *     description: Deletes a specific user role based on its unique identifier. It will only delete the role if role is not assigned to any user. If it is assigned either change the user role or delete the user.
    *     tags:
    *       - Roles
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - in : path
    *         name : id
    *         schema :
    *           type : string
    *           example : 654c8a4c1a2b3c4d5e6f7890
    *         required : true
    *         description : The Unique Identifier to Delete the Role
    *     responses:
    *       '200':
    *         description: Role Deleted Successfully
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
    *                   example: Role is Deleted Successfully
    *       '400':
    *         description: If the role is already assigned to the user.  
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
    *                   example: This Role is already assigned to the User. Either Delete the User or Assign Other Role to the Users, then try again.      
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

// Route for Deleting the Roles
router.delete('/roles/delete/:id', authToken, rolePermissionCheck('role_management'), rolesController.deleteRole)

/**  
    * @swagger
    * /roles/update/:id:
    *   put:
    *     summary: Update a role by ID (Protected Route) - (Role Permission Check)
    *     description: Update a specific user role based on its unique identifier.
    *     tags:
    *       - Roles
    *     security:
    *       - bearerAuth : []
    *     parameters:
    *       - in : header
    *         name : Authorization
    *         description : 'Authorization : `bearer <jwdToken Here>`' 
    *         required : true
    *       - in : path
    *         name : id
    *         schema :
    *           type : string
    *           example : 654c8a4c1a2b3c4d5e6f7890
    *         required : true
    *         description : The Unique Identifier to Update the Role
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - role
    *               - permissions
    *             properties:
    *               role:
    *                 type : string
    *                 example : Admin
    *                 description: Role of the User like Admin, Editor, Author, Viewer or any Custom 
    *               permissions:
    *                 type : [string]
    *                 example : ["create_post", "edit_post", "delete_post", "user_management", "comment_management", "role_management" , "cat_tag_management", "none"]
    *     responses:
    *       '200':
    *         description: Role Updated Successfully
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
    *                   example: Role Updated Successfully   
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

// Route for Updating the Roles
router.put('/roles/update/:id', authToken, rolePermissionCheck('role_management'), rolesController.updateRole)



module.exports = router