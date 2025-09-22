# 📝 Blogging System Backend

A comprehensive RESTful API backend for a modern blogging platform built with Node.js, Express.js, and MongoDB. This system provides complete blog management functionality with user authentication, role-based permissions, and file upload capabilities.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with token blacklisting
- **Role-based Access Control (RBAC)** with granular permissions
- **Secure Password Hashing** using bcrypt
- **Token Management** with automatic expiration

### 📚 Content Management
- **Post Management** - Create, read, update, delete blog posts
- **Category System** - Organize posts with hierarchical categories
- **Tag System** - Flexible tagging for better content discovery
- **Comment System** - Nested comments with reactions (like/dislike)
- **Draft & Publish** - Save drafts and publish when ready

### 👥 User Management
- **User Registration & Login**
- **Profile Management** with image uploads
- **User Status Management** (active/inactive)
- **Role Assignment** with custom permissions

### 📁 File Management
- **Image Upload** for posts and user profiles
- **Static File Serving** with organized directory structure
- **File Storage** with unique naming to prevent conflicts

### 🔍 Advanced Features
- **Search & Filtering** - Full-text search across posts
- **Pagination** - Efficient data loading
- **Sorting** - Multiple sorting options
- **Date Range Filtering** - Filter posts by creation date
- **Status Filtering** - Filter by draft/published status

## 🛠️ Tech Stack

### Backend Framework
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Security & Authentication
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### File Handling
- **Multer** - File upload middleware
- **Path** - File path utilities

### Documentation
- **Swagger UI** - Interactive API documentation
- **swagger-jsdoc** - JSDoc to Swagger conversion

### Development Tools
- **dotenv** - Environment variable management
- **nodemon** - Development server with auto-restart

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blogServer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=4050
DB_URI=mongodb://localhost:27017/blogPost
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Start MongoDB
Make sure MongoDB is running on your system.

### 5. Run the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:4050`

## 📖 API Documentation

Interactive API documentation is available at:
```
http://localhost:4050/api-docs
```

### Base URL
```
http://localhost:4050/api
```

### Static Files
```
http://localhost:4050/static/uploads/user/  # User profile images
http://localhost:4050/static/uploads/post/  # Post images
```

## 🗂️ Project Structure

```
blogServer/
├── config/
│   └── db.config.js           # Database configuration
├── controllers/
│   ├── user.controller.js     # User management logic
│   ├── post.controller.js     # Post management logic
│   ├── category.controller.js # Category management logic
│   ├── comment.controller.js  # Comment management logic
│   ├── tags.controller.js     # Tag management logic
│   └── roles.controller.js    # Role management logic
├── middlewares/
│   ├── authToken.js           # JWT authentication middleware
│   ├── rolePermissionCheck.middleware.js # RBAC middleware
│   ├── storageUserFiles.middleware.js    # User file upload config
│   └── storagePostFiles.middleware.js    # Post file upload config
├── models/
│   ├── user.model.js          # User schema
│   ├── post.model.js          # Post schema
│   ├── category.model.js      # Category schema
│   ├── comment.model.js       # Comment schema
│   ├── tag.model.js           # Tag schema
│   ├── role.model.js          # Role schema
│   └── blacklistToken.model.js # Token blacklist schema
├── routes/
│   ├── users.routes.js        # User endpoints
│   ├── posts.routes.js        # Post endpoints
│   ├── category.routes.js     # Category endpoints
│   ├── comments.routes.js     # Comment endpoints
│   ├── tags.routes.js         # Tag endpoints
│   └── roles.routes.js        # Role endpoints
├── public/
│   └── images/
│       ├── user_uploads/      # User profile images
│       └── post_uploads/      # Post images
├── utils/
│   ├── delMediaPaths.js       # File deletion utilities
│   ├── jwt_key_generation.js  # JWT key generation
│   └── stringFunctions.js     # String manipulation utilities
├── .env                       # Environment variables
├── index.js                   # Application entry point
├── swagger.js                 # Swagger configuration
└── package.json              # Dependencies and scripts
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout (token blacklisting)

### Posts
- `GET /api/posts` - Get all posts (with filtering, pagination, search)
- `GET /api/post/:id` - Get single post
- `POST /api/post` - Create new post (Protected)
- `PUT /api/post/:id` - Update post (Protected)
- `DELETE /api/post/:id` - Delete post (Protected)

### Users
- `GET /api/users` - Get all users (Protected)
- `GET /api/user/:id` - Get single user
- `PUT /api/user/:id` - Update user (Protected)
- `DELETE /api/user/:id` - Delete user (Protected)

### Categories & Tags
- `GET /api/categories` - Get all categories
- `POST /api/category` - Create category (Protected)
- `GET /api/tags` - Get all tags
- `POST /api/tag` - Create tag (Protected)

### Comments
- `GET /api/comments` - Get comments for a post
- `POST /api/comment` - Add comment (Protected)
- `PUT /api/comment/:id` - Update comment (Protected)
- `DELETE /api/comment/:id` - Delete comment (Protected)

## 🔒 Security Features

- **Password Encryption** using bcrypt
- **JWT Token Authentication** with expiration
- **Token Blacklisting** for secure logout
- **Role-based Permissions** for different user types
- **Input Validation** and sanitization
- **CORS Configuration** for cross-origin requests

## 📊 Database Schema

### Users
- Personal information (name, email, password)
- Role assignment with permissions
- Profile image support
- Account status management

### Posts
- Rich content with title, slug, content, excerpt
- Author and category relationships
- Tag associations
- Draft/published status
- Featured image support

### Comments
- Nested comment structure
- User reactions (like/dislike)
- Moderation status (approved/pending/spam)
- Author information

## 🚀 Deployment

### Environment Variables
Ensure these environment variables are set in production:
```env
PORT=4050
DB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
```

### Production Considerations
- Use a secure JWT secret
- Configure MongoDB with authentication
- Set up proper CORS origins
- Implement rate limiting
- Add request logging
- Set up SSL/HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using Node.js, Express.js, and MongoDB**