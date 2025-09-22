
const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config({ silent: true });
const connectDB = require('./config/db.config');
const path = require('path');
const userRoutes = require('./routes/users.routes')
// const jwtKey = require('./utils/jwt_key_generation')
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const roleRoutes = require('./routes/roles.routes');
const tagRoutes = require('./routes/tags.routes');
const categoryRoutes = require('./routes/category.routes');
const postRoutes = require('./routes/posts.routes');


const commentRoutes = require('./routes/comments.routes')

 
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// const corsOpt ={
//   origin: '*', // it mean origin is all can be requested from anywhere
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //methods that can send request
//   allowedHeaders: [      
//     'Content-Type',
//     // 'Access-Control-Allow-Origin',
//     'Origin', 'Authorization' 
//   ]

// }

app.use(cors())

// Static Directories

const userUploadDir = path.join(__dirname, './public/images/user_uploads');
const postUploadDir = path.join(__dirname, './public/images/post_uploads')

// Static Routes


app.use('/static/uploads/user', express.static(userUploadDir))

app.use('/static/uploads/post', express.static(postUploadDir))



// API Routes
app.get('/', (req, res)=>{
  res.send("hello World")
})

app.use('/api', userRoutes)
app.use('/api', roleRoutes)
app.use('/api', tagRoutes)
app.use('/api', categoryRoutes)
app.use('/api', postRoutes)
app.use('/api', commentRoutes)

// API Docs 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.get('/gettter', (req, res)=>{
  res.send("hello")
})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
  connectDB() 
  // jwtKey()
  console.log(`server is running on port ${port}`);

} )