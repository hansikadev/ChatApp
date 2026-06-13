# QuickChat - Real-Time Messaging Application

A modern, full-stack real-time chat application built with React, Node.js, and Socket.io. QuickChat enables users to communicate instantly with real-time message delivery, user authentication, and online status tracking.

## 🌟 Features

### Core Messaging
- **Real-Time Messaging**: Send and receive messages instantly using WebSocket connections
- **Message Status**: Track message delivery with read/seen indicators
- **Rich Media Support**: Share images and text messages
- **Conversation History**: Access complete chat history with timestamps

### User Management
- **User Authentication**: Secure sign-up and login with JWT tokens
- **Password Security**: Bcrypt encryption for password storage
- **User Profiles**: Customizable profiles with bio and profile pictures
- **Online Status**: Real-time online/offline user status tracking

### User Experience
- **Responsive Design**: Fully responsive UI with Tailwind CSS
- **Modern Interface**: Sleek, intuitive user interface
- **Toast Notifications**: Real-time feedback for user actions
- **Profile Management**: Update profile information and pictures

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library for building interactive components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Socket.io Client** - Real-time bidirectional communication
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notification system

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for building APIs
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - ODM (Object Data Modeling) for MongoDB
- **Socket.io** - Real-time event-based communication
- **JWT (jsonwebtoken)** - Secure token-based authentication
- **Bcryptjs** - Password hashing and encryption
- **Cloudinary** - Cloud storage for image management
- **CORS** - Cross-Origin Resource Sharing support

## 📁 Project Structure

```
chatapp/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Chatcontainer.jsx    # Main chat interface
│   │   │   ├── Sidebar.jsx          # User list sidebar
│   │   │   └── Rightsidebar.jsx     # Right panel (user info, etc.)
│   │   ├── pages/                   # Page components
│   │   │   ├── Homepage.jsx         # Main chat page
│   │   │   ├── Loginpage.jsx        # Auth page (login/signup)
│   │   │   └── Profilepage.jsx      # User profile page
│   │   ├── context/                 # React Context for state management
│   │   │   ├── AuthContext.jsx      # Authentication context
│   │   │   └── ChatContext.jsx      # Chat state context
│   │   ├── lib/                     # Utility functions
│   │   │   └── util.js              # Helper utilities
│   │   ├── assets/                  # Static assets
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── vite.config.js               # Vite configuration
│   ├── package.json                 # Dependencies
│   └── dockerfile                   # Docker configuration
│
└── server/                          # Backend Express application
    ├── controllers/                 # Business logic
    │   ├── usercontroller.js        # User auth and profile operations
    │   └── messagecontroller.js     # Message operations
    ├── models/                      # Database schemas
    │   ├── user.js                  # User model
    │   └── message.js               # Message model
    ├── routes/                      # API endpoints
    │   ├── userroutes.js            # Auth and user routes
    │   └── messageroutes.js         # Message routes
    ├── middleware/                  # Express middleware
    │   └── auth.js                  # JWT authentication middleware
    ├── lib/                         # Utilities
    │   ├── db.js                    # Database connection
    │   ├── cloudinary.js            # Cloudinary config
    │   └── utils.js                 # Helper functions
    ├── server.js                    # Main server file
    ├── package.json                 # Dependencies
    └── dockerfile                   # Docker configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB database (local or cloud-based)
- Cloudinary account (for image uploads)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd chatapp
```

#### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
# Add the following environment variables:
# MONGODB_URI=<your-mongodb-connection-string>
# JWT_SECRET=<your-jwt-secret-key>
# CLOUDINARY_NAME=<your-cloudinary-name>
# CLOUDINARY_KEY=<your-cloudinary-api-key>
# CLOUDINARY_SECRET=<your-cloudinary-api-secret>
# PORT=5000

# Start the server
npm start
# or with hot reload
npm run server
```

#### 3. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Create .env file
# Add the following environment variable:
# VITE_BACKEND_URL=http://localhost:5000
# For production:
# VITE_BACKEND_URL=https://your-backend-url.com

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:5000
```

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Create a new user account
  - Body: `{ fullName, email, password, bio }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  
- `GET /api/auth/check` - Verify user authentication (requires token)
  
- `PUT /api/auth/update-profile` - Update user profile (requires token)
  - Body: `{ fullName, bio, profilePic }`

### Message Routes
- `GET /api/messages/:userId` - Fetch conversation with a user (requires token)
  
- `POST /api/messages/send/:userId` - Send a message (requires token)
  - Body: `{ text, image }`
  
- `GET /api/messages/users` - Get all conversations (requires token)

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  fullName: String (required),
  password: String (hashed, required),
  profilePic: String (default: ""),
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  senderId: ObjectId (ref: User, required),
  receiverId: ObjectId (ref: User, required),
  text: String,
  image: String,
  seen: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Real-Time Features (Socket.io)

### Client-Side Events
- **Connection**: Automatically establishes connection with user ID
- **getOnlineUsers**: Receives list of currently online users
- **disconnect**: Handles user disconnection

### Server-Side Events
- **User connected**: Broadcasts when user comes online
- **User disconnected**: Broadcasts when user goes offline
- **New message**: Real-time message delivery to recipient
- **Message seen**: Confirmation when recipient views message

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcryptjs for secure password storage
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Restricted cross-origin requests
- **Environment Variables**: Sensitive data stored in .env files

## 📱 Responsive Design

- Mobile-first approach using Tailwind CSS
- Optimized for all screen sizes (mobile, tablet, desktop)
- Touch-friendly interface elements
- Adaptive layout components

## 🐳 Docker Deployment

Both client and server include Dockerfile configurations for containerized deployment.

```bash
# Build Docker images
docker build -t quickchat-client ./client
docker build -t quickchat-server ./server

# Run containers
docker run -p 5173:5173 quickchat-client
docker run -p 5000:5000 quickchat-server
```

## 📦 Build & Deployment

### Frontend Build
```bash
cd client
npm run build
# Output: dist/
```

### Production Deployment
- Frontend: Deploy `dist/` folder to Vercel, Netlify, or any static hosting
- Backend: Deploy to Render, Railway, Heroku, or any Node.js hosting platform

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📧 Support

For support, email support@quickchat.com or create an issue in the repository.

## 🎯 Future Enhancements

- [ ] End-to-end encryption
- [ ] Voice and video calling
- [ ] Group chat functionality
- [ ] Message search and filtering
- [ ] File sharing (documents, videos)
- [ ] User blocking system
- [ ] Message reactions and emojis
- [ ] Dark mode theme

---

**QuickChat** - Connect Instantly, Chat Seamlessly.
