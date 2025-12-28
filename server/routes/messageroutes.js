import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { getMessages, getUsersForSidebar } from "../controllers/messagecontroller"

const messagerouter = express.Router()
messagerouter.get("/users", protectRoute, getUsersForSidebar)
messagerouter.get("/:id", protectRoute, getMessages);
