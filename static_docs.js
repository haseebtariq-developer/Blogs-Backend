/**
    * @swagger
    * /uploads/user:
    *   get:
    *     summary: To  Retrieve a static image file of the User
    *     tags:
    *       - Uploads/Static Files
    *     parameters:
    *       - in : path
    *         name: imageName
    *         required : true
    *         schema : 
    *           type : string
    *           example : 'image1.png'
    *           description: The name of the image file to retrieve
    *     responses:
    *       '200':
    *         description: The Requested Image file of the User
    *         content:
    *           image:
    *             schema:
    *               type: string
    *               format: binary
    *               example: image.png                                    
    *       '404':
    *         description: Image Not Found
    *                 
    */

/**
    * @swagger
    * /uploads/post:
    *   get:
    *     summary: To  Retrieve a static image file of the Post
    *     tags:
    *       - Uploads/Static Files
    *     parameters:
    *       - in : path
    *         name: imageName
    *         required : true
    *         schema : 
    *           type : string
    *           example : 'image1.png'
    *           description: The name of the image file to retrieve
    *     responses:
    *       '200':
    *         description: The Requested Image file of the Post
    *         content:
    *           image:
    *             schema:
    *               type: string
    *               format: binary
    *               example: image.png                                    
    *       '404':
    *         description: Image Not Found
    *                 
    */