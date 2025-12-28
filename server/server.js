import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http" 
import { connectDB } from "./lib/db.js"
import userrouter from "./routes/userroutes.js"

//create express app and http server
const app = express()
const server = http.createServer(app)

//middleware setup
app.use(express.json({ limit: "4mb" }))
app.use(cors())


//routes sateup
app.use("/api/status", (req, res) => res.send("server is live"))
app.use("/api/auth",userrouter)

//connect to mongodb
await connectDB()

const PORT = process.env.PORT || 5000 
server.listen(PORT,()=>console.log("server running on PORT :" + PORT))