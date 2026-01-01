// import express from "express"
// import "dotenv/config"
// import cors from "cors"
// import http from "http" 
// import { connectDB } from "./lib/db.js"
// import userrouter from "./routes/userroutes.js"
// import messagerouter from "./routes/messageroutes.js"
// import { Server } from "socket.io"

// app.use(
//   cors({
//     origin: "http://localhost:5173", // frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// //create express app and http server
// const app = express()
// const server = http.createServer(app)

// //initialize socket.io server
// export const io = new Server(server, {
//     cors:{origin:"*"}
// })

// //store online users
// export const userSocketMap = {}; //{userId:socketId}

// ///socket.io connection handler
// io.on("connection", (socket) => {
//     const userId = socket.handshake.query.userId;
//     console.log("user connected", userId);

//     if (userId) userSocketMap[userId] = socket.id;

//     //emit online users to all connected clients
//     io.emit("getonlineusers", Object.keys(userSocketMap));
    
//     socket.on("disconnect", () => {
//         console.log("user disconnected", userId);
//         delete userSocketMap[userId];
//         io.emit("getonlineusers",Object.keys(userSocketMap))
//     })
// })


// //middleware setup
// app.use(express.json({ limit: "4mb" }))
// app.use(cors())


// //routes sateup
// app.use("/api/status", (req, res) => res.send("server is live"))
// app.use("/api/auth", userrouter)
// app.use("/api/messages",messagerouter)

// //connect to mongodb
// await connectDB()

// const PORT = process.env.PORT || 5000
// server.listen(PORT, () => console.log("server running on PORT :" + PORT))

import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userrouter from "./routes/userroutes.js";
import messagerouter from "./routes/messageroutes.js";
import { Server } from "socket.io";

// create express app
const app = express();

// create http server
const server = http.createServer(app);

// ======================
// CORS CONFIGURATION
// ======================
const corsOptions = {
  origin: "http://localhost:5173", // frontend (Vite)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// apply cors BEFORE routes
app.use(cors(corsOptions));

// ======================
// MIDDLEWARE
// ======================
app.use(express.json({ limit: "4mb" }));

// ======================
// SOCKET.IO SETUP
// ======================
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// store online users
export const userSocketMap = {}; // { userId: socketId }

// socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // send online users
  io.emit("getOnlineusers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineusers", Object.keys(userSocketMap));
  });
});

// ======================
// ROUTES
// ======================
app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", userrouter);
app.use("/api/messages", messagerouter);

// ======================
// DATABASE & SERVER
// ======================
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));



