import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http" 
import { connectDB } from "./lib/db.js"
import userrouter from "./routes/userroutes.js"
import messagerouter from "./routes/messageroutes.js"
import {Server} from "socket.io"

//create express app and http server
const app = express()
const server = http.createServer(app)

//initialize socket.io server
export const io = new Server(server, {
    cors:{origin:"*"}
})

//store online users
export const userSocketMap = {}; //{userId:socketId}

///socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected", userId);

    if (userId) userSocketMap[userId] = socket.id;

    //emit online users to all connected clients
    io.emit("getonlineusers", Object.keys(userSocketMap));
    
    socket.on("disconnect", () => {
        console.log("user disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getonlineusers",Object.keys(userSocketMap))
    })
})


//middleware setup
app.use(express.json({ limit: "4mb" }))
app.use(cors())


//routes sateup
app.use("/api/status", (req, res) => res.send("server is live"))
app.use("/api/auth", userrouter)
app.use("/api/messages",messagerouter)

//connect to mongodb
await connectDB()

const PORT = process.env.PORT || 5000 
server.listen(PORT, () => console.log("server running on PORT :" + PORT))

