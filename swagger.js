const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
       swaggerDefinition: {
           openapi: '3.0.0',
           info: {
               title: 'API Documentation',
               version: '1.0.0',
               description: 'Documentation of the Routes ',
           },
           servers: [
               {
                   url: `http://localhost:4050/api`,
                   description: "Operations related to the API"
               },
               {
                url: `http://localhost:4050/static`,
                description: "Static Files "
               }
           ],
      components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT', 
                description: 'Enter JWT Bearer token **_only_** ',
            },
        },
    },
      tags: [
        {
          name : `Users`,
          description : `User related endpoints`
        },
        {
            name: `Roles`,
            description: `Role related endpoints`
        },
        {
            name: `Posts`,
            description: `Posts related endpoints`
        },
        {
            name: `Comments`,
            description: `Comments related endpoints`
        },
        {
            name: `Categories`,
            description: `Category related endpoints`
        },
        {
            name: `Tags`,
            description : `Tags related endpoints`
        },
        {
            name : `Uploads/Static Files`,
            description: `Uploads files endpoints`
        }
      ]
       },
       apis: ['./routes/*.js', './static_docs.js'], // Path to your API docs
   };

const specs = swaggerJsdoc(swaggerOptions);


module.exports = specs;