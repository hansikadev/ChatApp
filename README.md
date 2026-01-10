# ChatApp 💬

A modern, real-time chat application built with React and Node.js, featuring instant messaging, image sharing, and user presence indicators.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Features in Detail](#features-in-detail)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Real-time Messaging**: Instant message delivery using Socket.io
- **Image Sharing**: Send and receive images in chat conversations
- **Profile Management**: Update profile picture, name, and bio
- **Online Status**: See which users are currently online
- **Unread Messages**: Notification badges for unseen messages
- **Media Gallery**: View all shared images in a conversation
- **User Search**: Search for users in the sidebar
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend

- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and management

## 📁 Project Structure

```
chatapp/
├── client/                 # Frontend React application
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ChatContext.jsx
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Chatcontainer.jsx
│   │   │   ├── Rightsidebar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── Homepage.jsx
│   │   │   ├── Loginpage.jsx
│   │   │   └── Profilepage.jsx
│   │   ├── assets/       # Static assets
│   │   ├── lib/          # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Backend Node.js application
    ├── controllers/       # Route controllers
    │   ├── messagecontroller.js
    │   └── usercontroller.js
    ├── models/           # Mongoose models
    │   ├── message.js
    │   └── user.js
    ├── routes/           # Express routes
    │   ├── messageroutes.js
    │   └── userroutes.js
    ├── middleware/       # Custom middleware
    │   └── auth.js
    ├── lib/              # Utility functions
    │   ├── db.js
    │   ├── utils.js
    │   └── cloudinary.js
    ├── server.js         # Server entry point
    └── package.json
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary** account (for image storage)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chatapp
   ```

2. **Install client dependencies**

   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/chatapp
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

**Note**: For production, update the CORS origin in `server/server.js` and the backend URL accordingly.

## 🏃 Running the Application

### Development Mode

1. **Start the MongoDB server** (if using local MongoDB)

   ```bash
   mongod
   ```

2. **Start the backend server**

   ```bash
   cd server
   npm run server
   ```

   The server will run on `http://localhost:5000`

3. **Start the frontend development server**

   ```bash
   cd client
   npm run dev
   ```

   The client will run on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`

### Production Build

1. **Build the frontend**

   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   npm start
   ```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/signup` - Register a new user
  - Body: `{ fullName, email, password, bio }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
- `PUT /api/auth/update-profile` - Update user profile (Protected)
  - Headers: `token: <JWT_TOKEN>`
  - Body: `{ fullName?, bio?, profilePic? }`
- `GET /api/auth/check` - Verify authentication (Protected)
  - Headers: `token: <JWT_TOKEN>`

### Message Routes (`/api/messages`)

- `GET /api/messages/users` - Get all users for sidebar (Protected)
  - Headers: `token: <JWT_TOKEN>`
- `GET /api/messages/:id` - Get messages with a user (Protected)
  - Headers: `token: <JWT_TOKEN>`
  - Params: `id` - User ID to chat with
- `POST /api/messages/send/:id` - Send a message (Protected)
  - Headers: `token: <JWT_TOKEN>`
  - Params: `id` - Receiver user ID
  - Body: `{ text?, image? }`
- `PUT /api/messages/mark/:id` - Mark message as seen (Protected)
  - Headers: `token: <JWT_TOKEN>`
  - Params: `id` - Message ID

### Status Route

- `GET /api/status` - Check if server is running

## 🎯 Features in Detail

### Authentication Flow

1. Users can sign up with email, password, full name, and bio
2. Passwords are hashed using bcryptjs before storage
3. JWT tokens are generated upon successful login/signup
4. Tokens are stored in localStorage and sent with each request
5. Protected routes verify tokens using middleware

### Real-time Messaging

- Messages are sent via HTTP POST and stored in MongoDB
- Socket.io emits messages to online recipients instantly
- Messages are marked as "seen" when the recipient views the conversation
- Unseen message counts are displayed as badges in the sidebar

### Image Handling

- Images are converted to base64 on the client side
- Uploaded to Cloudinary for storage
- Cloudinary URLs are stored in the database
- Images are displayed in the chat and media gallery

### Online Status

- Socket.io tracks connected users
- Online users are broadcasted to all clients
- Green indicators show online status in the UI

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes with middleware
- CORS configuration for secure cross-origin requests
- Input validation on both client and server

## 🎨 UI/UX Features

- Modern glassmorphism design with backdrop blur
- Responsive layout for mobile and desktop
- Smooth animations and transitions
- Toast notifications for user feedback
- Auto-scroll to latest messages
- Search functionality for users
- Media gallery for shared images

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env` file

2. **CORS Errors**

   - Verify frontend URL matches CORS configuration in `server.js`
   - Check that `VITE_BACKEND_URL` is set correctly

3. **Image Upload Fails**

   - Verify Cloudinary credentials in `.env`
   - Check image file size (limit: 4MB)

4. **Socket Connection Issues**
   - Ensure backend server is running
   - Check that `VITE_BACKEND_URL` matches backend URL

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 🙏 Acknowledgments

- Built with React and Node.js
- Uses Socket.io for real-time functionality
- Cloudinary for image storage
- Tailwind CSS for styling

---

**Happy Chatting! 💬**
