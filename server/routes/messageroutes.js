import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messagecontroller"

const messagerouter = express.Router()
messagerouter.get("/users", protectRoute, getUsersForSidebar)
messagerouter.get("/:id", protectRoute, getMessages);
messagerouter.put("mark/:id", protectRoute, markMessageAsSeen);
messagerouter.post("/send/:id", protectRoute, sendMessage)


export default messagerouter